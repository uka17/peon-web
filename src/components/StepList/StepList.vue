<template>
  <div class="container">
    <div class="columns">   
      <div class="column">
        <div class="field is-grouped">
          <div class="field has-addons">
            <p class="control">
              <button class="button" title="Move step up">
                <span class="icon is-small">
                  <i class="mdi mdi-arrow-up-bold"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button" title="Move step down">
                <span class="icon is-small">
                  <i class="mdi mdi-arrow-down-bold"></i>
                </span>
              </button>
            </p> 
          </div>
          <span>&nbsp;</span>
          <div class="field has-addons">      
            <p class="control">
              <button class="button" title="Create new step">
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
          <button class="button is-danger is-pulled-right" title="Delete selected step(s)">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>
    
    <vuetable ref="vuetable"
      :api-mode="false"
      :data="stepList"
      :fields="fields"
      @vuetable:cell-clicked="onCellClicked"
      :css="css.table"
    >
    </vuetable>
    <step v-bind:step="activeStep" v-on:step-modal-close="stepModalClose"></step>
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

export default {
  data () {
    return {
      css: vue_css,
      fields: fields_definition,
      activeStep: {}     
    }
  },
  props: ['stepList'],
  methods: {
    onCellClicked (data, field, event) {
      if(field.name == 'name')
        this.activeStep = data;
    },
    stepModalClose: function () {
      this.activeStep = {};
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
