<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Job properties: {{job.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="tabs is-boxed">
          <ul>
            <li v-bind:class="{ 'is-active': this.activeTab == 'general' }">
              <a @click="tabClick('general')"><span>General</span></a>
            </li>
            <li v-bind:class="{ 'is-active': this.activeTab == 'steps' }">
              <a @click="tabClick('steps')"><span>Steps</span></a>
            </li>
            <li v-bind:class="{ 'is-active': this.activeTab == 'schedules' }">
              <a @click="tabClick('schedules')"><span>Schedules</span></a>
            </li>
            <li v-bind:class="{ 'is-active': this.activeTab == 'notifications' }">
              <a @click="tabClick('notifications')"> <span>Notifications</span></a>
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
      </section>
      <footer class="modal-card-foot buttons is-right">
          <button v-if="!isNew" class="button is-link" v-bind:class="{ 'is-static': !formIsValid }" @click="saveChanges">Save changes</button>
          <button v-if="isNew" class="button is-success" v-bind:class="{ 'is-static': !formIsValid }" @click="createJob">Create job</button>
          <button @click="modalClose" class="button">Cancel</button>
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

import { EventBus } from '../utils.js';

export default {
  data() {
    return {
      jobRecord: {},
      activeTab: 'general',
      isNew: null
    }
  },
  methods: {
    modalShow(jobRecord, isNew = false) {
      this.$set(this, 'isNew', isNew);
      this.$set(this, 'jobRecord', jobRecord);      
    },    
    modalClose: function() {
      this.activeTab = 'general';      
      this.$refs.stepList.clickedRow = null;
      this.$set(this, 'jobRecord', {});
      this.$router.push('/jobs/');
    },
    tabClick: function(tabName) {
      this.activeTab = tabName;
    },
    async saveChanges() {
      try {            
        const response = await axios.patch(`${config.apiUrl}/jobs/${this.jobRecord.id}`, this.jobRecord.job);        
        if(response.status === 200)
          this.modalClose();
        this.$emit('job-list-refresh');
      } catch (error) {      
        EventBus.$emit('app-error', utils.parceApiError(error));
      }
    },
    async createJob() {      
      try {             
        debugger;   
        const response = await axios.post(`${config.apiUrl}/jobs`, this.jobRecord.job);        
        if(response.status === 201)
          this.modalClose();
        this.$emit('job-list-refresh');
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
      return (validate(this.jobRecord.job, constraints('en')) === undefined);      
    },
  },
  components: {
    'job-general-tab': JobGeneralTab,
    'step-list-tab': StepList
  }
}
</script>