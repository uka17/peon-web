<template>
  <div class="container">
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
