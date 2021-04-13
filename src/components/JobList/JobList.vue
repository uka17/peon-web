<template>
  <div>
    <h1 class="title">Job list</h1>
    <div class="columns">   
      <div class="column">
        <p class="control">
          <router-link id="new-job" class="button is-success" qa-data="job-list-create" title="Create new job" :to="'/jobs/create'">
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </router-link>
        </p>                       
      </div>
      <div class="column">
        <p class="control">
          <button qa-data="job-list-delete-modal-show" class="button is-danger is-pulled-right" :disabled="selectedRow === null" title="Delete selected job" @click="modalDeleteShow()">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>
    <filter-bar qa-data="job-list-filter"></filter-bar>
    <vuetable qa-data="job-list-table" ref="jobList"
      :api-url="apiUrl"
      :fields="fields"
      data-path="data"
      :row-class="onRowClass"
      :sort-order="sortOrder"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      :css="css.table"
      :append-params="moreParams"      
    >
      <template slot="job-name" slot-scope="props">
        <router-link :qa-data="`${props.rowData.name}`" :to="`/jobs/${props.rowData.id}`">{{ props.rowData.name }}</router-link>
      </template>     
    </vuetable>
    <div class="columns">
      <div qa-data="job-list-delete-modal-show" class="column is-paddingless">
        <vuetable-pagination-info qa-data="job-list-pagination-info" ref="jobListPaginationInfo"
        ></vuetable-pagination-info>
      </div>
      <div class="column">
        <vuetable-pagination qa-data="job-list-pagination" ref="jobListPagination"
          @vuetable-pagination:change-page="onChangePage"
          :css="css.pagination"
        ></vuetable-pagination>
      </div>
    </div>   
    <div class="modal" v-bind:class="{ 'is-active': deleteDialogIsVisible }" v-on:keyup.esc="deleteDialogIsVisible = false">
      <div class="modal-background"></div>
      <div class="modal-content" id="job-delete-modal-content">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <article class="message is-danger">
                <div class="message-body">
                  Once you delete a job, there is no going back. <br/>
                  Please be certain. Type <span><b>{{ selectedJobName }}</b></span> to confirm.<br/><br/>
                  <div class="field has-addons">
                    <div class="control">
                      <input class="input" v-model="jobNameToDelete" type="text" placeholder="Job name">
                    </div>
                    <div class="control">
                      <a class="button is-danger" qa-data="job-list-delete" :disabled="deleteLocked" @click="executeJobDeletion">
                        Delete
                      </a>
                    </div>
                  </div>                   
                </div>                    
              </article>                                         
            </div>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="deleteDialogIsVisible = false"></button>
    </div>                
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetable from 'vuetable-2'
import VuetablePagination from '../../../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import FilterBar from './JobListFilterBar.vue'

import vue_css from '../table-style.js'
import fields_definition from './joblist-fields-defintion.js'
import { EventBus } from '../../components/utils.js';

import config from '../config.js';
import axios from 'axios';

export default {
  data () {
    return {
      moreParams: {},
      selectedRow: null,
      selectedJobName: null,
      deleteDialogIsVisible: false,
      jobNameToDelete: null,
      css: vue_css,
      fields: fields_definition,
      apiUrl: `${config.apiUrl}/jobs`,
      sortOrder: [
        {
          field: 'created_on',
          direction: 'desc'
        }
      ]
    }
  },
  created() {
    EventBus.$on('list-filter-set', v => this.onFilterSet(v));
    EventBus.$on('list-filter-reset', v => this.onFilterReset());
  },  
  methods: {
    onFilterReset() {
      this.moreParams = {};
      Vue.nextTick( () => this.$refs.jobList.refresh());
    },
    onFilterSet(filterText) {
      this.moreParams = {
          'filter': filterText
      };
      Vue.nextTick( () => this.$refs.jobList.refresh());
    },
    onPaginationData (paginationData) {
      this.$refs.jobListPagination.setPaginationData(paginationData)
      this.$refs.jobListPaginationInfo.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.jobList.changePage(page)
    },
    async onCellClicked (data, field, event) {
      console.log(data.id);
      this.selectedRow = data.id;   
      this.selectedJobName = data.name;        
    },
    refreshJobList() {
      this.$refs.jobList.refresh();
    },
    onRowClass (dataItem, index) {
      return (dataItem.id == this.selectedRow) ? 'is-selected' : ''
    },
    modalDeleteShow: function() {
      if(this.selectedRow !== null) {
        this.deleteDialogIsVisible = true;
        this.jobNameToDelete = '';
      }
    },
    executeJobDeletion: async function() {      
      try {        
        const response = await axios.delete(`${this.apiUrl}/${this.selectedRow}`);
        this.selectedRow = null;
        this.refreshJobList();
        this.deleteDialogIsVisible = false;
      } catch (error) {
        EventBus.$emit('app-error', utils.parceApiError(error));
      }
    }
  },
  computed: {
    deleteLocked: function() {
      return !(this.selectedJobName === this.jobNameToDelete);
    }
  },
  components: {
    'vuetable': Vuetable,
    'vuetable-pagination': VuetablePagination,
    'vuetable-pagination-info': VuetablePaginationInfo,
    'filter-bar': FilterBar
  }
}
</script>
<style lang="scss" >
  #job-delete-modal-content {
    width: 430px;    
  }
</style>
