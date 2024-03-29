<template>
  <div>
    <h1 class="title">Connection list</h1>
    <div class="columns">
      <div class="column">
        <p class="control">
          <router-link
            id="new-connection"
            qa-data="connection-list-create"
            class="button is-success"
            title="Create new connection"
            :to="'/connections/create'"
          >
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </router-link>
        </p>
      </div>
      <div class="column">
        <p class="control">
          <button
            qa-data="connection-list-delete-modal-show"
            class="button is-danger is-pulled-right"
            :disabled="selectedRow === null"
            title="Delete selected connection"
            @click="modalDeleteShow()"
          >
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>
      </div>
    </div>
    <filter-bar qa-data="connection-list-filter"></filter-bar>
    <vuetable
      qa-data="connection-list-table"
      ref="connectionList"
      :api-url="apiUrl"
      :fields="fields"
      data-path="data"
      :row-class="onRowClass"
      :sort-order="sortOrder"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      :css="css.table"
      :append-params="moreParams"
    >
      <template slot="connection-name" slot-scope="props">
        <div
          class="slot-link"
          :qa-data="`${props.rowData.name}-cell`"
          @click="onCellClicked(props.rowData)"
        >
          <router-link
            :qa-data="props.rowData.name"
            :to="`/connections/${props.rowData.id}`"
            >{{ props.rowData.name }}</router-link
          >
        </div>
      </template>
      <template slot="connection-summary" slot-scope="props">
        <span
          :qa-data="`${props.rowData.login}@${props.rowData.host}:${props.rowData.port}`"
          :data-tooltip="`${props.rowData.login}@${props.rowData.host}:${props.rowData.port}`"
          ><i class="mdi mdi-information-outline"></i
        ></span>
      </template>
    </vuetable>
    <div class="columns">
      <div class="column is-paddingless">
        <vuetable-pagination-info
          ref="connectionListPaginationInfo"
          qa-data="connection-list-pagination-info"
        ></vuetable-pagination-info>
      </div>
      <div class="column">
        <vuetable-pagination
          ref="connectionListPagination"
          qa-data="connection-list-pagination"
          @vuetable-pagination:change-page="onChangePage"
          :css="css.pagination"
        ></vuetable-pagination>
      </div>
    </div>
    <div
      class="modal"
      qa-data="connection-delete-modal"
      v-bind:class="{ 'is-active': deleteDialogIsVisible }"
      v-on:keyup.esc="deleteDialogIsVisible = false"
    >
      <div class="modal-background"></div>
      <div class="modal-content" id="connection-delete-modal-content">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <article class="message is-danger">
                <div class="message-body">
                  Once you delete a connection, there is no going back. <br />
                  Please be certain. Type
                  <span qa-data="connection-delete-modal-connection-name"
                    ><b>{{ selectedConnectionName }}</b></span
                  >
                  to confirm.<br /><br />
                  <div class="field has-addons">
                    <div class="control">
                      <input
                        qa-data="connection-delete-modal-text"
                        class="input"
                        v-model="connectionNameToDelete"
                        type="text"
                        placeholder="Connection name"
                      />
                    </div>
                    <div class="control">
                      <a
                        class="button is-danger"
                        qa-data="connection-delete-modal-confirm"
                        :disabled="deleteLocked"
                        @click="executeConnectionDeletion"
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        qa-data="connection-delete-modal-close"
        aria-label="close"
        @click="deleteDialogIsVisible = false"
      ></button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Vuetable from "vuetable-2";
import VuetablePagination from "../../../node_modules/vuetable-2/src/components/VuetablePagination.vue";
import VuetablePaginationInfo from "../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue";
import FilterBar from "./ConnectionListFilterBar.vue";

import vue_css from "../table-style.js";
import fields_definition from "./connectionlist-fields-defintion.js";
import { EventBus } from "../../components/utils.js";

import config from "../config.js";
import axios from "axios";

export default {
  data() {
    return {
      moreParams: {},
      selectedRow: null,
      selectedConnectionName: null,
      deleteDialogIsVisible: false,
      connectionNameToDelete: null,
      css: vue_css,
      fields: fields_definition,
      apiUrl: `${config.apiUrl}/connections`,
      sortOrder: [
        {
          field: "created_on",
          direction: "desc",
        },
      ],
    };
  },
  created() {
    EventBus.$on("connection-list-filter-set", (v) => this.onFilterSet(v));
    EventBus.$on("connection-list-filter-reset", (v) => this.onFilterReset());
  },
  methods: {
    onFilterReset() {
      this.moreParams = {};
      if (this.$refs.connectionList)
        Vue.nextTick(() => this.$refs.connectionList.refresh());
    },
    onFilterSet(filterText) {
      this.moreParams = {
        "filter": filterText,
      };
      if (this.$refs.connectionList)
        Vue.nextTick(() => this.$refs.connectionList.refresh());
    },
    onPaginationData(paginationData) {
      this.$refs.connectionListPagination.setPaginationData(paginationData);
      this.$refs.connectionListPaginationInfo.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.connectionList.changePage(page);
    },
    async onCellClicked(data) {
      this.selectedRow = data.id;
      this.selectedConnectionName = data.name;
    },
    refresh() {
      this.$refs.connectionList.refresh();
    },
    onRowClass(dataItem, index) {
      return dataItem.id == this.selectedRow ? "is-selected" : "";
    },
    modalDeleteShow: function () {
      if (this.selectedRow !== null) {
        this.deleteDialogIsVisible = true;
        this.connectionNameToDelete = "";
      }
    },
    executeConnectionDeletion: async function () {
      try {
        const response = await axios.delete(
          `${this.apiUrl}/${this.selectedRow}`
        );
        this.selectedRow = null;
        this.refresh();
        this.deleteDialogIsVisible = false;
      } catch (error) {
        EventBus.$emit("app-error", utils.parceApiError(error));
      }
    },
  },
  computed: {
    deleteLocked: function () {
      return !(this.selectedConnectionName === this.connectionNameToDelete);
    },
  },
  components: {
    "vuetable": Vuetable,
    "vuetable-pagination": VuetablePagination,
    "vuetable-pagination-info": VuetablePaginationInfo,
    "filter-bar": FilterBar,
  },
};
</script>
<style lang="scss">
#connection-delete-modal-content {
  width: 430px;
}
.slot-link {
  height: 100%;
  padding: 0px;
  margin: 0px;
}
</style>
