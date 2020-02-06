<template>
  <div class="container">
    <div class="columns">   
      <div class="column">
        <div class="field is-grouped">
          <div class="field has-addons">
            <p class="control">
              <button class="button" :disabled="clickedRow === null || clickedRow == 1" title="Move step up" @click="moveUpSelectedStep()">
                <span class="icon is-small">
                  <i class="mdi mdi-arrow-up-bold"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button" :disabled="clickedRow === null || clickedRow == stepList.length" title="Move step down" @click="moveDownSelectedStep()">
                <span class="icon is-small">
                  <i class="mdi mdi-arrow-down-bold"></i>
                </span>
              </button>
            </p> 
          </div>
          <span>&nbsp;</span>
          <div class="field has-addons">      
            <p class="control">
              <button class="button is-success" title="Create new step" @click="modalNewShow()">
                <span class="icon is-small">
                  <i class="mdi mdi-shape-square-plus"></i>
                </span>
                <span>New</span>
              </button>
            </p>                      
          </div>    
        </div>
      </div>
      <div class="column">
        <p class="control">
          <button class="button is-danger is-pulled-right" :disabled="clickedRow === null" title="Delete selected step" @click="deleteSelectedStep()">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>
    
    <vuetable ref="stepList"
      :api-mode="false"
      :data="stepList"
      :fields="fields"
      :row-class="onRowClass"
      @vuetable:cell-clicked="onCellClicked"      
      :css="css.table"
    >
      <template slot="step-name" slot-scope="props">
        <a @click="modalEditShow(props.rowData)">{{ props.rowData.name }}</a>
      </template>    
    </vuetable>
    <p id="step-list-empty-error" v-if="this.stepList.length === 0" class="help is-danger">{{ messages.stepListShouldNotBeEmpty['en'] }}</p>
    <step ref="stepDialog" v-on:step-modal-save="stepSave($event)" v-on:step-modal-new="stepCreate($event)"></step>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'
import Step from '../Step/Step.vue'

import vue_css from '../table-style.js'
import fields_definition from './steplist-fields-defintion.js'
import step_template from '../Step/step-template.js'

import config from '../config.js';
import messages from '../translation/messages.js'
import utils from '../utils.js';

export default {
  data () {
    return {
      clickedRow: null,
      css: vue_css,
      fields: fields_definition,
      messages: messages
    }
  },
  props: ['stepList'],
  methods: {
    onCellClicked (data, field, event) {
      this.clickedRow = data.order;      
    },
    modalEditShow(step) {
      //Break reactivity for modal edit
      this.$refs.stepDialog.modalShow(JSON.parse(JSON.stringify(step)), this.stepList);
    },
    modalNewShow() {
      //Break reactivity for modal edit
      this.$refs.stepDialog.modalShow(JSON.parse(JSON.stringify(step_template.newStep)), this.stepList, true);         
    },    
    stepSave (step){
      this.$set(this.stepList, this.clickedRow - 1, step);
    },
    stepCreate(newStep) {
      let index = this.clickedRow === null ? this.stepList.length : this.clickedRow;          
      this.stepList.splice(index, 0, newStep);
      utils.reorderElements(this.stepList);
    },    
    onRowClass (dataItem, index) {
      return (dataItem.order == this.clickedRow) ? 'is-selected' : ''
    },    
    deleteSelectedStep: function() {
      if(this.clickedRow !== null) {
        this.stepList.splice(this.clickedRow - 1, 1);
        utils.reorderElements(this.stepList);
        this.clickedRow = null;
      }
    },
    moveUpSelectedStep: function() {
      if(this.clickedRow !== null) {
        utils.moveListElement(this.stepList, this.clickedRow - 1, true);
        this.clickedRow--; 
      }
    },
    moveDownSelectedStep: function() {
      if(this.clickedRow !== null) {
        utils.moveListElement(this.stepList, this.clickedRow - 1, false);
        this.clickedRow++;
      }
    }
  },
  components: {
    Vuetable,
    Step
  }
}
</script>

