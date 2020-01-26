<template>
  <div>
    <div class="columns">   
      <div class="column">
        <p class="control">
          <button class="button is-success" title="Create new job" @click="modalNewShow()">
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </button>
        </p>                       
      </div>
      <div class="column">
        <p class="control">
          <button class="button is-danger is-pulled-right" :disabled="selectedRow === null" title="Delete selected job" @click="modalDeleteShow()">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>
    <filter-bar></filter-bar>
    <vuetable ref="jobList"
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
        <a @click="modalEditShow(props.rowData.id)">{{ props.rowData.name }}</a>
      </template>     
    </vuetable>
    <div class="columns">
      <div class="column is-paddingless">
        <vuetable-pagination-info ref="jobListPaginationInfo"
        ></vuetable-pagination-info>
      </div>
      <div class="column">
        <vuetable-pagination ref="jobListPagination"
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
                      <a class="button is-danger" :disabled="deleteLocked" @click="executeJobDeletion">
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
    <job ref="jobDialog" v-on:job-list-refresh="refreshJobList()"></job>                
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetable from 'vuetable-2'
import VuetablePagination from '../../../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import Job from '../Job/Job.vue'
import FilterBar from '../../components/FilterBar/FilterBar.vue'

import vue_css from '../table-style.js'
import fields_definition from './joblist-fields-defintion.js'
import job_template from '../Job/job-template.js'
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
    EventBus.$on('job-list-filter-set', v => this.onFilterSet(v));
    EventBus.$on('job-list-filter-reset', v => this.onFilterReset());
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
    async modalEditShow(jobId) {
      try {        
        const response = await axios.get(`${this.apiUrl}/${jobId}`);
        this.$refs.jobDialog.modalShow(response.data);
      } catch (error) {
        EventBus.$emit('app-error', utils.parceApiError(error));
      }    
    },
    modalNewShow() {
      //Break reactivity for modal edit
      this.$refs.jobDialog.modalShow(JSON.parse(JSON.stringify(job_template.newJob)), true);         
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
    'job': Job,
    'filter-bar': FilterBar
  }
}
</script>
<style lang="scss" >
  #job-delete-modal-content {
    width: 430px;    
  }
</style>
