<template>
  <div>
    <div class="columns">
      <div class="column">
        <p class="control">
          <button
            qa-data="create-new-schedule"
            class="button is-success"
            title="Create new schedule"
            @click="modalNewShow()"
          >
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </button>
        </p>
      </div>
      <div class="column">
        <p class="control">
          <button
            qa-data="delete-selected-schedule"
            class="button is-danger is-pulled-right"
            :disabled="clickedRow === null"
            title="Delete selected schedule"
            @click="deleteSelected()"
          >
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>
      </div>
    </div>
    <vuetable
      qa-data="schedule-list"
      id="schedule-list"
      ref="scheduleList"
      :api-mode="false"
      :data="scheduleList"
      :fields="fields"
      :row-class="onRowClass"
      @vuetable:cell-clicked="onCellClicked"
      :css="css.table"
    >
      <template slot="schedule-name" slot-scope="props">
        <a
          :qa-data="props.rowData.name"
          @click="modalEditShow(props.rowData)"
          >{{ props.rowData.name }}</a
        >
      </template>
    </vuetable>
    <p
      id="schedule-list-empty-error"
      v-if="this.scheduleList.length === 0"
      class="help is-danger"
    >
      {{ messages.scheduleListShouldNotBeEmpty["en"] }}
    </p>
    <schedule
      ref="schedule"
      v-on:schedule-modal-save="save($event)"
      v-on:schedule-modal-new="create($event)"
    ></schedule>
  </div>
</template>

<script>
import Vuetable from "vuetable-2";
import Schedule from "../Schedule/Schedule.vue";

import vue_css from "../table-style.js";
import fields_definition from "./schedulelist-fields-defintion.js";
import schedule_template from "../Schedule/schedule-template.js";
import scheduleSummary from "../Schedule/schedule-summary.js";

import messages from "../translation/messages.js";
import { nanoid } from "nanoid";

export default {
  data() {
    return {
      clickedRow: null,
      css: vue_css,
      messages: messages,
      fields: fields_definition.concat({
        name: "id",
        dataClass: "default-cursor summary-label",
        title: "Summary",
        callback: this.getDescription,
      }),
    };
  },
  props: ["scheduleList"],
  methods: {
    onCellClicked(data, field, event) {
      this.clickedRow = data.id;
    },
    getDescription(id) {
      if (this.scheduleList) {
        let cellSchedule = this.scheduleList.find((elem) => elem.id === id);
        return cellSchedule === undefined
          ? undefined
          : `<span qa-data="${cellSchedule.name}">${scheduleSummary(
              cellSchedule
            )}</span>`;
      } else {
        return undefined;
      }
    },
    modalEditShow(schedule) {
      //Break reactivity for modal edit
      this.clickedRow = schedule.id;
      this.$refs.schedule.modalShow(JSON.parse(JSON.stringify(schedule)));
    },
    modalNewShow() {
      //Break reactivity for modal edit
      this.$refs.schedule.modalShow(
        JSON.parse(JSON.stringify(schedule_template.newSchedule)),
        true
      );
    },
    save(schedule) {
      let index = this.scheduleList.findIndex(
        (elem) => elem.id === schedule.id
      );
      if (index > -1) {
        this.$set(this.scheduleList, index, schedule);
      }
    },
    create(newSchedule) {
      newSchedule.id = nanoid();
      this.scheduleList.push(newSchedule);
    },
    onRowClass(dataItem, index) {
      return dataItem.id == this.clickedRow ? "is-selected" : "";
    },
    deleteSelected: function () {
      let recordIndex = this.scheduleList.findIndex(
        (elem) => elem.id === this.clickedRow
      );
      if (recordIndex !== -1) {
        this.scheduleList.splice(recordIndex, 1);
        this.clickedRow = null;
      }
    },
  },
  components: {
    Vuetable,
    Schedule,
  },
};
</script>
<style lang="scss">
table#schedule-list .vuetable-th-slot-schedule-name {
  width: 150px;
}
table#schedule-list .summary-label {
  font-size: 10pt;
}
</style>
