<template>
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
import utils from './components/utils.js'
import config from './components/config.js'

export default {
  data () {
    return {
      css: vue_css,
      fields:
        [
          {name: 'description', title: '', callback: this.jobDescription},
          {name: 'name', sortField: 'name', title: 'Name'},
          {name: 'enabled', sortField: 'enabled', title: 'Enabled'},
          {name: 'status', sortField: 'status', title: 'Status'},
          {name: 'last_run_result', sortField: 'last_run_result', title: 'Last run', callback: this.runResult},
          {name: 'last_run_on', sortField: 'last_run_on', title: 'Last run on', callback: this.formatDateTime},
          {name: 'next_run', sortField: 'next_run', title: 'Next run', callback: this.formatDateTime},
          {name: 'step_count', sortField: 'step_count', title: 'Steps'},
          {name: 'schedule_count', sortField: 'schedule_count', title: 'Schedules'},
          {name: 'created_by', sortField: 'created_by', title: 'Created by'},
          {name: 'created_on', sortField: 'created_on', title: 'Created', callback: this.formatDateTime},
          {name: 'modified_by', sortField: 'created_by', title: 'Modified by'},
          {name: 'modified_on', sortField: 'modified_on', title: 'Modified', callback: this.formatDateTime}
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
    },
    formatDateTime: (v) => utils.formatDateTime(v, config.tableDateTimeFormat, 'en'),
    jobDescription: (v) => `<span class="icon has-text-info" data-tooltip="${v}"><i class="mdi mdi-information"></i></span>`,
    runResult (v) {
      let tooltip = v ? 'Success' : 'Failure';
      let icon = v ? 'mdi mdi-checkbox-marked-circle' : 'mdi mdi-close-circle';
      let color = v ? 'icon has-text-success' : 'icon has-text-danger';
      return `<span class="${color}" data-tooltip="${tooltip}"><i class="${icon}"></i></span>`
    }
  },
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo
  }
}
</script>
