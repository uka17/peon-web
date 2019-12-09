<template>
  <div class="container">
    <vuetable ref="vuetable"
      :api-url="apiUrl"
      :fields="fields"
      data-path="data"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      :css="css.table"
    >
    </vuetable>
    <div class="columns">
      <div class="column is-paddingless">
        <vuetable-pagination-info ref="paginationInfo"
        ></vuetable-pagination-info>
      </div>
      <div class="column">
        <vuetable-pagination ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
          :css="css.pagination"
        ></vuetable-pagination>
      </div>
    </div>
  </div>            
</template>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from '../../../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import vue_css from '../table-style.js'
import fields_definition from './joblist-fields-defintion.js'
import config from '../config.js';

export default {
  data () {
    return {
      css: vue_css,
      fields: fields_definition,
      apiUrl: `${config.apiUrl}/jobs`
    }
  },
  methods: {
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked (data, field, event) {
      this.$emit('job-modal-show', data.id);
    }
  },
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo
  }
}
</script>
