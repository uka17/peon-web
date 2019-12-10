<template>
  <div class="modal" v-bind:class="{ 'is-active': jobModalIsActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Job properties: {{job.name}}</p>
        <button class="delete" aria-label="close" @click="jobModalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="tabs is-boxed">
          <ul>
            <li v-bind:class="{ 'is-active': this.activeTab == 'general' }">
              <a @click="jobTabClick('general')"><span>General</span></a>
            </li>
            <li v-bind:class="{ 'is-active': this.activeTab == 'steps' }">
              <a @click="jobTabClick('steps')"><span>Steps</span></a>
            </li>
            <li v-bind:class="{ 'is-active': this.activeTab == 'schedules' }">
              <a @click="jobTabClick('schedules')"><span>Schedules</span></a>
            </li>
            <li v-bind:class="{ 'is-active': this.activeTab == 'notifications' }">
              <a @click="jobTabClick('notifications')"> <span>Notifications</span></a>
            </li>
          </ul>
        </div>
        <div>
          <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'general' }">
            <job-general-tab v-bind:jobRecord="jobRecord"></job-general-tab>
          </section>
          <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'steps' }">Stepst</section>
          <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'schedules' }">Schedules</section>
          <section class="tab-content" v-bind:class="{ 'is-hidden': this.activeTab != 'notifications' }">Notifications</section>
        </div>        
      </section>
      <footer class="modal-card-foot">
          <button class="button is-success" @click="jobModalClose">Save changes</button>
          <button @click="jobModalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import JobGeneralTab from './JobGeneralTab.vue'

export default {
  data() {
    return {
      activeTab: 'general'
    }
  },
  props: {
    jobRecord: {
      type: Object,
      required: true
    }
  },
  methods: {
    jobModalClose: function() {
      this.$emit('job-modal-close');
    },
    jobTabClick: function(tabName) {
      this.activeTab = tabName;
    }
  },
  computed: {
    jobModalIsActive: function() {
      return this.jobRecord.job !== undefined;
    },
    job: function() {
      return this.jobRecord.job !== undefined ? this.jobRecord.job : {};
    }
  },
  components: {
    'job-general-tab': JobGeneralTab
  }
}
</script>