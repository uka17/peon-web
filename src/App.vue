<template>
	<div id="app">
    <div class="ui container">
      <vuetable ref="vuetable"
        api-url="https://vuetable.ratiw.net/api/users"
        :fields="fields"
        data-path="data"
        pagination-path=""
        sortField="email"
        @vuetable:pagination-data="onPaginationData"
      ></vuetable>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
	</div>
</template>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from '../node_modules/vuetable-2/src/components/VuetablePagination.vue'

export default {
  data () {
    return {
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
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    }
  },
  components: {
    Vuetable,
    VuetablePagination
  }
}
</script>
