<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Schedule properties: {{schedule.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input v-model="schedule.name" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }" placeholder="Schedule name">
          </div>
          <p id="schedule-dialog-name-error" class="help is-danger">{{ fieldIsValid('name') }}</p>
        </div>  
        <div class="field">
          <label class="label">Schedule type*</label>
          <div class="control">
            <div class="select">
              <select v-model="scheduleType">
                <option value="onetime">One time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>     
        </div> 
        <div>
          <section v-bind:class="{ 'is-hidden': this.scheduleType != 'onetime' }">
            <div class="field">
              <label class="label">Date and time*</label>
              <div class="control">
                <input v-model="schedule.oneTime" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }" placeholder="Schedule name">
              </div>
              <p id="schedule-dialog-onetime-error" class="help is-danger">{{ fieldIsValid('oneTime') }}</p>
            </div>  
          </section>
          <section v-bind:class="{ 'is-hidden': this.scheduleType != 'daily' }">
            DAILY
          </section>
          <section v-bind:class="{ 'is-hidden': this.scheduleType != 'weekly' }">
            WEEKLY
          </section>
          <section v-bind:class="{ 'is-hidden': this.scheduleType != 'monthly' }">
            MONTHLY
          </section>                               
        </div>                                   
      </section>      
      <footer class="modal-card-foot buttons is-right">
          <button v-if="!isNew" class="button is-link" @click="save" v-bind:class="{ 'is-static': !formIsValid }" title="Save schedule changes">Save changes</button>
          <button v-if="isNew" class="button is-success" @click="create" v-bind:class="{ 'is-static': !formIsValid }" title="Create schedule">Create schedule</button>
          <button @click="modalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>

import validate from 'validate.js';
import constraints from './schedule-validation.js';
import utils from '../utils.js';


export default {
  data() {
    return {
      schedule: {},
      isNew: undefined,
      scheduleType: undefined
    }
  },
  methods: {
    modalShow(schedule, isNew = false) {
      this.$set(this, 'isNew', isNew);
      this.$set(this, 'schedule', schedule);

      if(Object.prototype.hasOwnProperty.call(schedule, 'oneTime')) {
        this.$set(this, 'scheduleType', 'onetime');
      }      
      if(Object.prototype.hasOwnProperty.call(schedule, 'eachNDay')) {
        this.$set(this, 'scheduleType', 'daily');
      }      
      if(Object.prototype.hasOwnProperty.call(schedule, 'eachNWeek')) {
        this.$set(this, 'scheduleType', 'weekly');
      }      
      if(Object.prototype.hasOwnProperty.call(schedule, 'month')) {
        this.$set(this, 'scheduleType', 'monthly');
      }      
    },
    save: function() {
      this.$emit('schedule-modal-save', this.schedule);       
      this.modalClose();
    },
    create() {
      this.$emit('schedule-modal-new', this.schedule);       
      this.modalClose();
    },
    modalClose: function() {
      this.$set(this, 'schedule', {});
    },
    fieldIsValid(field) {
      const result = validate(this.schedule, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    },
    isNumber: utils.isNumber   
  },
  computed: {
    modalIsActive: function() {
      return this.schedule.name !== undefined;
    },
    retryAttempts: function() {
      return this.schedule.retryAttempts !== undefined ? this.schedule.retryAttempts : {};
    },
    formIsValid() {
      return (validate(this.schedule, constraints('en')) === undefined)
    }
  },
  components: {
    //'schedule-result-action': ScheduleResultAction
  }
}
</script>

<style lang="scss" >

</style>