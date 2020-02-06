<template>
  <div>
    <h1 class="title">Schedule list</h1>
    <div class="columns">   
      <div class="column">
        <p class="control">
          <router-link id="new-schedule" class="button is-success" title="Create new schedule" @click="modalNewShow()">
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </router-link>
        </p>                       
      </div>
      <div class="column">
        <p class="control">
	      <button class="button is-danger is-pulled-right" :disabled="clickedRow === null" title="Delete selected schedule" @click="deleteSelected()">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>
    <vuetable ref="scheduleList"
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
      <template slot="schedule-summary" slot-scope="props">
        `Summary: ${props.rowData.name}`
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

import config from '../config.js';
import utils from '../utils.js';

export default {
  data () {
    return {
      clickedRow: null,
      css: vue_css,
      fields: fields_definition
    }
  },
  props: ['scheduleList'],
  methods: {
    onCellClicked (data, field, event) {
      this.clickedRow = data.name;      
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
      return (dataItem.order == this.clickedRow) ? 'is-selected' : ''
    },    
    deleteSelected: function() {
      if(this.clickedRow !== null) {
        this.scheduleList.splice(this.clickedRow - 1, 1);
        utils.reorderElements(this.scheduleList);
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

