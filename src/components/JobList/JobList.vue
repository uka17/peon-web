<template>
  <div>
    <div class="columns">   
      <div class="column">
        <p class="control">
          <button class="button is-success" title="Create new step">
            <span class="icon is-small">
              <i class="mdi mdi-shape-square-plus"></i>
            </span>
            <span>New</span>
          </button>
        </p>                       
      </div>
      <div class="column">
        <p class="control">
          <button class="button is-danger is-pulled-right" :disabled="selectedRow === null" title="Delete selected job" @click="deleteSelectedJob()">
            <span class="icon is-small">
              <i class="mdi mdi-trash-can-outline"></i>
            </span>
          </button>
        </p>          
      </div>
    </div>

    <vuetable ref="jobList"
      :api-url="apiUrl"
      :fields="fields"
      data-path="data"
      :row-class="onRowClass"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      :css="css.table"
    >
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
    <job v-bind:jobRecord="activeJobRecord" ref="job" v-on:job-modal-close="jobModalClose"></job>                
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from '../../../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import Job from '../Job/Job.vue'

import vue_css from '../table-style.js'
import fields_definition from './joblist-fields-defintion.js'
import config from '../config.js';
import axios from 'axios';

export default {
  data () {
    return {
      selectedRow: null,
      selectedJobName: null,
      activeJobRecord: {},
      deleteDialogIsVisible: false,
      jobNameToDelete: null,
      css: vue_css,
      fields: fields_definition,
      apiUrl: `${config.apiUrl}/jobs`
    }
  },
  methods: {
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
      try {                
        if(field.name == 'name') {
          const response = await axios.get(`${config.apiUrl}/jobs/${data.id}`);
          this.activeJobRecord = response.data;          
        }
      } catch (error) {
        this.activeJobRecord = {};
      }            
    },
    jobModalClose: function() {
      this.activeJobRecord = {};
      this.$refs.jobList.refresh();
    },            
    onRowClass (dataItem, index) {
      return (dataItem.id == this.selectedRow) ? 'is-selected' : ''
    },
    deleteSelectedJob: function() {
      if(this.selectedRow !== null) {
        this.deleteDialogIsVisible = true;
      }
    },
    executeJobDeletion: async function() {      
      try {        
        const response = await axios.delete(`${config.apiUrl}/jobs/${this.selectedRow}`);
        this.$refs.jobList.refresh();
        this.deleteDialogIsVisible = false;
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    deleteLocked: function() {
      return !(this.selectedJobName === this.jobNameToDelete);
    },
    selectedJobName: function() {
      return this.activeJobRecord.job !== undefined ? this.activeJobRecord.job.name : 'confirm';
    }
  },
  components: {
    'vuetable': Vuetable,
    'vuetable-pagination': VuetablePagination,
    'vuetable-pagination-info': VuetablePaginationInfo,
    'job': Job
  }
}
</script>
<style lang="scss" >
  #job-delete-modal-content {
    width: 430px;    
  }
</style>
