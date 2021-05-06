<template>
  <div>
    <label class="label">Duration*</label>                 
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static">
          Start date
        </a>           
      </p>              
      <div v-bind:class="{ 'custom-warning-inline': fieldIsValid('startDateTime', { 'startDateTime': startDateTimeValue }, startDateTimeConstraints) !== '' }" >
        <p class="control">        
          <date-time-picker v-model="startDateTimeValue" type="datetime">   
            </date-time-picker>                       
        </p>
      </div>          
      <p v-if="!endlessValue" class="control">
        <a class="button is-static">
          End date
        </a>           
      </p>  
      <div v-if="!endlessValue" v-bind:class="{ 'custom-warning-inline': fieldIsValid('endDateTime', { 'endDateTime': endDateTimeValue }, endDateTimeConstraints) !== '' }" >        
        <p class="control">          
          <date-time-picker v-model="endDateTimeValue" type="datetime">   
            </date-time-picker>           
        </p>
      </div>
    </div>
    <p id="schedule-start-date-time-error" class="help is-danger">{{ fieldIsValid('startDateTime', { 'startDateTime': startDateTimeValue }, startDateTimeConstraints) }}</p>
    <p v-if="!this.endlessValue" id="schedule-end-date-time-error" class="help is-danger">{{ fieldIsValid('endDateTime', { 'endDateTime': endDateTimeValue }, endDateTimeConstraints) }}</p>      
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" v-model="endlessValue"> Endless schedule duration
      </label>
    </div>
  </div>  
</template>

<script>

import constraints from './schedule-validation.js';
import { fieldIsValid } from './schedule-helpers.js';
import DatePicker from 'vue2-datepicker';

import 'vue2-datepicker/index.css';

export default {
  data() {
    return {   
       startDateTimeValue: this.startDateTime,
       endDateTimeValue: this.endDateTime,
       endlessValue: this.endless,
       fieldIsValid,
       startDateTimeConstraints: {'startDateTime': constraints('en')['startEndDateTime'].startDateTime },
       endDateTimeConstraints: {'endDateTime': constraints('en')['startEndDateTime'].endDateTime }   
    }
  },
  props: ['startDateTime', 'endDateTime', 'endless'],
  watch: {
    startDateTimeValue: function() {
      this.$emit('schedule-duration-start-update', { value: this.startDateTimeValue });
    },
    endDateTimeValue: function() {
      this.$emit('schedule-duration-end-update', { value: this.endDateTimeValue });
    }, 
    endlessValue: function() {
      this.$emit('schedule-endless-update', { value: this.endlessValue });
    }        
  },
  components: {
    'date-time-picker': DatePicker
  }
}
</script>

<style lang="scss" >
  @import './schedule.css';
</style>