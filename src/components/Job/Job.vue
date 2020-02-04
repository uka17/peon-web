<template>
  <div class="modal is-active" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card" id="job-modal-content">
      <header class="modal-card-head">
        <p v-if="jobRecord.job" class="modal-card-title">Job properties: {{job.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="has-text-centered" v-if="!jobRecord.job">
          Loading job data...
          <progress id="job-loading" class="progress is-small is-info" max="100">10%</progress>
        </div>
        <div v-if="jobRecord.job">
          <div class="tabs is-boxed">
            <ul>
              <li v-bind:class="{ 'is-active': this.activeTab == 'general' }">
                <a id="general-tab" @click="tabClick('general')"><span>General</span></a>
              </li>
              <li  v-bind:class="{ 'is-active': this.activeTab == 'steps' }">
                <a id="steps-tab" @click="tabClick('steps')"><span>Steps</span></a>
              </li>
              <li v-bind:class="{ 'is-active': this.activeTab == 'schedules' }">
                <a id="schedules-tab" @click="tabClick('schedules')"><span>Schedules</span></a>
              </li>
              <li v-bind:class="{ 'is-active': this.activeTab == 'notifications' }">
                <a id="notifications-tab" @click="tabClick('notifications')"> <span>Notifications</span></a>
              </li>
            </ul>
          </div>
          <div>
            <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'general' }">
              <job-general-tab v-bind:jobRecord="jobRecord"></job-general-tab>
            </section>
            <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'steps' }">
              <step-list-tab ref="stepList" v-bind:stepList="stepList"></step-list-tab>
            </section>
            <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'schedules' }">Schedules</section>
            <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'notifications' }">Notifications</section>
          </div>    
        </div>    
      </section>
      <footer class="modal-card-foot buttons is-right" v-if="jobRecord.job">
          <button v-if="!isNew" id="button-job-save-changes" class="button is-link" v-bind:class="{ 'is-static': !formIsValid }" @click="saveChanges">Save changes</button>
          <button v-if="isNew" id="button-job-create" class="button is-success" v-bind:class="{ 'is-static': !formIsValid }" @click="createJob">Create job</button>
          <button @click="modalClose" id="button-job-cancel" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import JobGeneralTab from './JobGeneralTab.vue'
import StepList from '../StepList/StepList.vue'

import config from '../config.js';
import utils from '../utils.js';
import axios from 'axios';
import validate from 'validate.js';
import constraints from './job-validation.js';

import job_template from './job-template.js'

import { EventBus } from '../utils.js';

export default {
  data() {
    return {
      jobRecord: {},
      activeTab: 'general',
      isNew: null,
      apiUrl: `${config.apiUrl}/jobs`
    }
  },
  async beforeMount() {
    try {      
      let dialogRecord;
      if(this.id === 'create') {
        dialogRecord = JSON.parse(JSON.stringify(job_template.newJob));
        this.modalShow(dialogRecord, true);
      }
      else {
        dialogRecord = await axios.get(`${this.apiUrl}/${this.id}`);
        this.modalShow(dialogRecord.data);
      }
    } catch (error) {
      EventBus.$emit('app-error', utils.parceApiError(error));
    }  
  },
  props: ['id'],
  methods: {
    modalShow(jobRecord, isNew = false) {
      this.$set(this, 'isNew', isNew);
      this.$set(this, 'jobRecord', jobRecord);      
    },    
    modalClose: function() {
      try {
        this.activeTab = 'general';      
        this.$refs.stepList.clickedRow = null;
        this.$set(this, 'jobRecord', {});
      }
      finally {
        this.$router.push('/jobs/');
      }
    },
    tabClick: function(tabName) {
      this.activeTab = tabName;
    },
    async saveChanges() {
      try {            
        const response = await axios.patch(`${config.apiUrl}/jobs/${this.jobRecord.id}`, this.jobRecord.job);        
        if(response.status === 200)
          this.modalClose();
      } catch (error) {      
        EventBus.$emit('app-error', utils.parceApiError(error));
      }
    },
    async createJob() {      
      try {             
        const response = await axios.post(`${config.apiUrl}/jobs`, this.jobRecord.job);        
        if(response.status === 201)
          this.modalClose();
      } catch (error) {      
        EventBus.$emit('app-error', utils.parceApiError(error));
      }
    }    
  },
  computed: {
    modalIsActive: function() {
      return this.jobRecord.job !== undefined;
    },
    job: function() {
      return this.jobRecord.job !== undefined ? this.jobRecord.job : {};
    },
    stepList: function() {
      return this.job.steps !== undefined ? this.job.steps : [];
    },
    formIsValid() {
      return (validate(this.jobRecord.job, constraints('en')) === undefined) && (this.stepList.length > 0);      
    },
  },
  components: {
    'job-general-tab': JobGeneralTab,
    'step-list-tab': StepList
  }
}
</script>
<style lang="scss" >
  #job-modal-content {
    width: 860px;
    height: 650px;    
  }
</style>