<template>
  <div id="main">
    <div class="columns">
      <div class="column is-one-fifth">
        <aside class="menu">
          <ul class="menu-list">
              <li v-for="item in menu" v-bind:key="item.id">
                <p v-if="item.id.includes('---')" class="menu-label"><br>{{ item.title }}</p>
                <a v-if="!item.id.includes('---')" :id="item.id" v-bind:class="{ 'is-active': menuItemClass(item.id) }" @click="menuItemClick">{{ item.title }}</a>
              </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <div v-show="menuItemClass('job-list')" id="job-list-container">        
          <h1 class="title">{{ this.findMenuItemById('job-list').title }}</h1>
          <job-list v-on:job-modal-show="jobModalShow($event)"></job-list>
          <job v-bind:jobRecord="activeJobRecord" v-on:job-modal-close="jobModalClose"></job>
        </div>
        <div v-show="menuItemClass('schedule')" id="schedule-container">        
          <h1 class="title">{{ this.findMenuItemById('schedule').title }}</h1>
        </div>
        <div v-show="menuItemClass('activity-monitor')" id="activity-monitor-container">        
          <h1 class="title">{{ this.findMenuItemById('activity-monitor').title }}</h1>
        </div>
        <div v-show="menuItemClass('log-viewer')" id="log-viewer-container">        
          <h1 class="title">{{ this.findMenuItemById('log-viewer').title }}</h1>
        </div>
        <div v-show="menuItemClass('settings')" id="settings-container">        
          <h1 class="title">{{ this.findMenuItemById('settings').title }}</h1>
        </div>                                      
      </div>
    </div>    
  </div>   
</template>

<script>
import JobList from './components/JobList/JobList.vue'
import Job from './components/Job/Job.vue'
import menuDefinition from './components/menu-definition.js'
import axios from 'axios';
import config from './components/config';

export default {
  data () {
    return {
      menu: menuDefinition,
      activeJobRecord: {}
    }
  },
  methods: {
    menuItemClick: function() {
      this.menu.map((elem) => elem.active = false);
      this.findMenuItemById(event.target.id).active = true; 
    },
    menuItemClass: function (id) {
      return this.findMenuItemById(id).active;
    },
    findMenuItemById(id) {
      return this.menu.find((elem) => { if(elem.id == id && !(elem.id.includes('---'))) return elem; })
    },
    jobModalShow: async function(jobId) {
      try {        
        const response = await axios.get(`${config.apiUrl}/jobs/${jobId}`);
        this.activeJobRecord = response.data;

      } catch (error) {
        this.activeJobRecord = {};
      }
    },
    jobModalClose: function() {
      console.log(this.activeJobRecord);
      this.activeJobRecord = {};
    }    
  },
  computed: {
    
  },
  components: {
    'job-list': JobList,
    'job': Job
  }
}
</script>
