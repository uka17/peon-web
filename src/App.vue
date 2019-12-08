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
          <job-list></job-list>
        </div>
        <div v-show="menuItemClass('schedule')" id="schedule-container">        
          schedule-list-container
        </div>
        <div v-show="menuItemClass('activity-monitor')" id="activity-monitor-container">        
          activity-monitor-list-container
        </div>
        <div v-show="menuItemClass('log-viewer')" id="log-viewer-container">        
          log-viewer-list-container
        </div>
        <div v-show="menuItemClass('settings')" id="settings-container">        
          settings
        </div>                                      
      </div>
    </div>    
  </div>   
</template>

<script>
import JobList from './components/JobList/JobList.vue'

export default {
  data () {
    return {
      menu: [
        {
          id: '---1', 
          title: 'General',
          active: true
        },        
        {
          id: 'job-list', 
          title: 'Job list',
          active: true
        },
        {
          id: 'schedule', 
          title: 'Schedule',
          active: false
        },
        {
          id: 'activity-monitor', 
          title: 'Activity monitor',
          active: false
        },
        {
          id: 'log-viewer', 
          title: 'Log viewer',
          active: false
        },
        {
          id: '---2', 
          title: 'Configuration',
          active: true
        },          
        {
          id: 'settings', 
          title: 'Settings',
          active: false
        }
      ]
    }
  },
  methods: {
    menuItemClick: function() {
      this.menu.map((elem) => elem.active = false);
      this.menu.find((elem) => { if(elem.id == event.target.id) return elem }).active = true; 
    },
    menuItemClass: function (id) {
      return this.menu.find((elem) => { if(elem.id == id && elem.id != '---') return elem }).active;
    }
  },
  components: {
    'job-list': JobList
  }
}
</script>
