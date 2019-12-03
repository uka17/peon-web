<template>
  <div class="container">
    <vuetable ref="vuetable"
      api-url="http://localhost:8080/v1.0/jobs"
      :fields="fields"
      data-path="data"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
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
import VuetablePagination from '../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import vue_css from './components/vue-table-style.js'
import fields_definition from './components/joblist-fields-defintion.js'

export default {
  data () {
    return {
      css: vue_css,
      fields: fields_definition        
    }
  },
  methods: {
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    }
  },
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo
  }
}
</script>
