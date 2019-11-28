<template>
	<div id="app">
    <div class="container">
      <vuetable ref="vuetable"
        api-url="http://localhost:8080/v1.0/jobs"
        :fields="fields"
        data-path="data"
        pagination-path="pagination"
        @vuetable:pagination-data="onPaginationData"
        :css="css.table"
      ></vuetable>
      <div class="columns">
        <div class="column">
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
	</div>
</template>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from '../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import vue_css from './vue-table-style.js'

export default {
  data () {
    return {
      css: vue_css,
      fields:
        [
          {name: 'name', sortField: 'name'},
          {name: 'description', sortField: 'description'},
          {name: 'enabled', sortField: 'enabled'},
          {name: 'step_count', sortField: 'step_count'},
          {name: 'steps', callback: v => v.length }
        ]
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
