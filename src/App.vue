<template>
  <div id="main">
    <div class="columns">
      <div class="column is-narrow" style="width: 220px;">
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
          <job-list v-on:app-error="throwAppError($event)"></job-list>
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
    <div class="modal" v-bind:class="{ 'is-active': this.erorrMessage !== null }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Error</p>
          <button class="delete" aria-label="close" @click="erorrMessage = null"></button>
        </header>
        <section class="modal-card-body">
          <article class="message is-danger">
            <div class="message-body">
              <span>{{ erorrMessage }}</span>                  
            </div>                    
          </article>      
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button class="button" @click="erorrMessage = null">OK</button>
        </footer>
      </div>
    </div>      
  </div>   
</template>

<script>
import JobList from './components/JobList/JobList.vue'
import menuDefinition from './components/menu-definition.js'
import config from './components/config.js';

import { EventBus } from './components/utils.js';


export default {
  data () {
    return {
      menu: menuDefinition,
      erorrMessage: null
    }
  },
  created() {
    EventBus.$on('app-error', v => { this.erorrMessage = v; })
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
    }
  },
  computed: {
    
  },
  components: {
    'job-list': JobList
  }
}
</script>
