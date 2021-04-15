<template>
  <div>
    <div class="columns">   
      <div class="column">
       <p class="control">
          <button qa-data="create-new-schedule" class="button is-success" title="Create new step" @click="modalNewShow()">
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </button>
        </p>       
      </div>
      <div class="column">
        <p class="control">
	      <button qa-data="delete-schedule" class="button is-danger is-pulled-right" :disabled="clickedRow === null" title="Delete selected schedule" @click="deleteSelected()">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>
    <vuetable qa-data="schedule-list" ref="scheduleList"
      :api-mode="false"
      :data="scheduleList"
      :fields="fields"
      :row-class="onRowClass"
      @vuetable:cell-clicked="onCellClicked"      
      :css="css.table"
    >
      <template slot="schedule-name" slot-scope="props">
        <a @click="modalEditShow(props.rowData)">{{ props.rowData.name }}</a>
      </template>    
    </vuetable>
    <schedule ref="schedule" v-on:schedule-modal-save="save($event)" v-on:schedule-modal-new="create($event)"></schedule>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'
import Schedule from '../Schedule/Schedule.vue'

import vue_css from '../table-style.js'
import fields_definition from './schedulelist-fields-defintion.js'
import schedule_template from '../Schedule/schedule-template.js'
import scheduleSummary from '../Schedule/schedule-summary.js'

import config from '../config.js';
import utils from '../utils.js';

export default {
  data () {
    return {
      clickedRow: null,
      css: vue_css,
      fields: fields_definition.concat({name: 'name', dataClass: 'default-cursor', title: 'Summary', callback: this.getDescription })
    }
  },
  props: ['scheduleList'],
  methods: {
    onCellClicked (data, field, event) {
      this.clickedRow = data.name;      
    },
    getDescription(name) {
      if(this.scheduleList) {
        let cellSchedule = this.scheduleList.find((elem) => elem.name === name);
        return cellSchedule === undefined ? undefined : scheduleSummary(cellSchedule);
      } else {
        return undefined;
      }
    },
    modalEditShow(schedule) {
      //Break reactivity for modal edit
      this.$refs.schedule.modalShow(JSON.parse(JSON.stringify(schedule)));
    },
    modalNewShow() {
      //Break reactivity for modal edit
      this.$refs.schedule.modalShow(JSON.parse(JSON.stringify(schedule_template.newSchedule)), true);         
    },    
    save (schedule){
      this.$set(this.scheduleList, this.clickedRow - 1, schedule);
    },
    create(newSchedule) {
      let index = this.clickedRow === null ? this.scheduleList.length : this.clickedRow;          
      this.scheduleList.splice(index, 0, newSchedule);
      utils.reorderElements(this.scheduleList);
    },    
    onRowClass (dataItem, index) {
      return (dataItem.name == this.clickedRow) ? 'is-selected' : ''
    },    
    deleteSelected: function() {
      let recordIndex = this.scheduleList.findIndex((elem) => elem.name === this.clickedRow);
      if(recordIndex !== -1) {        
        this.scheduleList.splice(recordIndex, 1);
        this.clickedRow = null;
      }
    }
  },
  components: {
    Vuetable,
    Schedule
  }
}
</script>
<style lang="scss" >
  .vuetable-th-slot-schedule-name {
    width: 50px;
  }

</style>
