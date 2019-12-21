<template>
  <div class="container">
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

    <vuetable ref="vuetable"
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
                      <a class="button is-danger" :disabled="deleteLocked" @click="executeJobDeletion()">
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
import Vuetable from 'vuetable-2'
import VuetablePagination from '../../../node_modules/vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from '../../../node_modules/vuetable-2/src/components/VuetablePaginationInfo.vue'
import vue_css from '../table-style.js'
import fields_definition from './joblist-fields-defintion.js'
import config from '../config.js';

export default {
  data () {
    return {
      selectedRow: null,
      selectedJobName: null,
      deleteDialogIsVisible: false,
      css: vue_css,
      fields: fields_definition,
      apiUrl: `${config.apiUrl}/jobs`,
      jobNameToDelete: null
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
      console.log(data.id);
      this.selectedRow = data.id;   
      this.selectedJobName = data.name;   
      if(field.name == 'name')
        this.$emit('job-modal-show', data.id);
    },
    onRowClass (dataItem, index) {
      return (dataItem.id == this.selectedRow) ? 'is-selected' : ''
    },
    deleteSelectedJob: function() {
      if(this.selectedRow !== null) {
        this.deleteDialogIsVisible = true;
      }
    },
    executeJobDeletion: function() {
      alert(this.selectedRow);
      this.deleteDialogIsVisible = false;
    }
  },
  computed: {
    deleteLocked: function() {
      if(this.selectedJobName !== null && this.jobNameToDelete !== null) {
        return !(this.selectedJobName === this.jobNameToDelete);
      } else {
        return true;
      }
    }
  },
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo
  }
}
</script>
<style lang="scss" >
  #job-delete-modal-content {
    width: 430px;    
  }
</style>
