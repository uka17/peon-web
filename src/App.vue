<template>
  <div id="main">
    <div class="columns">
      <div class="column is-narrow" style="width: 220px;">
        <aside class="menu">
          <ul class="menu-list">
            <li><p class="menu-label" is-active><br>General</p></li>
            <li><router-link to="/jobs">Job list</router-link></li>
            <li><router-link to="/connections">Connections</router-link></li>
            <li><router-link to="/monitor">Activity monitor</router-link></li>
            <li><p class="menu-label"><br>Configuration</p></li>
            <li><router-link to="/settings">Settings</router-link></li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <transition name="fade">
          <router-view></router-view>                             
        </transition>
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
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import JobList from './components/JobList/JobList.vue';
import Job from './components/Job/Job.vue';
import ConnectionList from './components/ConnectionList/ConnectionList.vue';
//import Connection from './components/Connection/Connection.vue';
import config from './components/config.js';

import { EventBus } from './components/utils.js';

const appRouter = new VueRouter({
  routes: [
    { path: '/jobs', component: JobList },
    { path: '/jobs/:id', component: Job, props: true },
    { path: '/connections', component: ConnectionList },
	
	/*
    { path: '/connections/:id', component: Connection, props: true }   
    { path: '/monitor', component: JobList },
    { path: '/settings', component: JobList }
    */
  ],
  linkActiveClass: 'is-active'
});

export default {
  router: appRouter,  
  data () {
    return {
      erorrMessage: null
    }
  },
  created() {
    EventBus.$on('app-error', v => { this.erorrMessage = v; })
  },
  methods: {

  },
  computed: {
    
  }
}
</script>
<style lang="scss" >
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
</style>

