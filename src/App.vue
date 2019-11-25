<template>
	<div id="app">
    <div class="container">
      <vuetable ref="vuetable"
        api-url="https://vuetable.ratiw.net/api/users"
        :fields="fields"
        data-path="data"
        pagination-path=""
        sortField="email"
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
import css from './vue-table-style'

export default {
  data () {
    return {
      css: css,
      fields:
        [
          {name: 'name', sortField: 'name'},
          {name: 'nickname', sortField: 'nickname'},
          {name: 'email', sortField: 'email'}, 
          {name: 'gender', title: 'Sex', sortField: 'gender', callback: (v) => {return v.toUpperCase() === 'M' ? 'Male' : 'Femail' }} 
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
