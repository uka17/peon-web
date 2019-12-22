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
              <button class="button is-success" title="Create new step">
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
    </vuetable>
    <step ref="step" v-on:step-modal-save="stepSave($event)"></step>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from '../../../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import Step from '../Step/Step.vue'
import vue_css from '../table-style.js'
import fields_definition from './steplist-fields-defintion'
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
  props: ['stepList'],
  methods: {
    onCellClicked (data, field, event) {
      this.clickedRow = data.order;
      if(field.name == 'name') {
        //Break reactivity for modal edit
        this.$refs.step.modalShow(JSON.parse(JSON.stringify(data)));
      }
    },
    onRowClass (dataItem, index) {
      return (dataItem.order == this.clickedRow) ? 'is-selected' : ''
    },
    stepSave (v){
      this.$set(this.stepList, this.clickedRow - 1, v);
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
    VuetablePagination,
    VuetablePaginationInfo,
    Step
  }
}
</script>

