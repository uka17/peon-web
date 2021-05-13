<template>
  <div>
    <label class="label">Daily frequency*</label>
    <div class="field">            
      <div class="control">
        <label class="radio">
          <input type="radio" name="once" qa-data="schedule-daily-once" v-bind:value="false" v-model="everyValue">
          Once
        </label>
        <label class="radio">
          <input type="radio" name="every" qa-data="schedule-daily-periodical" v-bind:value="true" v-model="everyValue">
          Periodicaly
        </label>
      </div>            
    </div>
    <div class="field" v-bind:class="{ 'is-hidden': everyValue }" >
      <label class="label">Time*</label>
      <div class="control" qa-data="schedule-daily-frequency-once" v-bind:class="{ 'custom-warning': fieldIsValid('occursOnceAt', dailyFrequency, occursOnceAtConstraints) !== ''}"> 
        <date-time-picker
          v-model="dailyFrequency.occursOnceAt"
          format="HH:mm:ss"
          value-type="format"
          type="time"
          placeholder="HH:mm:ss">
        </date-time-picker>
      </div>
      <p id="schedule-occursonceat-error" qa-data="schedule-daily-frequency-once-error" class="help is-danger">{{ fieldIsValid('occursOnceAt', dailyFrequency, occursOnceAtConstraints)  }}</p>
    </div>   
    <div v-bind:class="{ 'is-hidden': !everyValue}">
      <label class="label">Recurrence*</label>
      <div class="field has-addons">
        <p class="control">
          <a class="button is-static">
            Starting
          </a>           
        </p>              
        <div qa-data="schedule-daily-frequency-start" v-bind:class="{ 'custom-warning-inline': fieldIsValid('start', dailyFrequency, everyConstraints) !== '' }">
          <p class="control date-time-picker">          
            <date-time-picker
              v-model="dailyFrequency.start"
              format="HH:mm:ss"
              value-type="format"
              type="time"
              placeholder="HH:mm:ss"
              :disabled-time="isLaterThanEnd">
            </date-time-picker>          
          </p>
        </div>
        <p class="control">
          <a class="button is-static">
            till
          </a>           
        </p>  
        <div qa-data="schedule-daily-frequency-end" v-bind:class="{ 'custom-warning-inline': fieldIsValid('end', dailyFrequency, everyConstraints) !== '' }">        
          <p class="control date-time-picker">              
            <date-time-picker
              v-model="dailyFrequency.end"
              format="HH:mm:ss"
              value-type="format"
              type="time"
              placeholder="HH:mm:ss"
              :disabled-time="isEarlierThanStart">
            </date-time-picker>   
          </p>
        </div>
        <p class="control">
          <a class="button is-static">
            every
          </a>           
        </p>
        <p class="control">
          <input id="schedule-interval-value" qa-data="schedule-daily-frequency-interval" maxlength="3" @keypress="isNumber($event)" type="text"
            v-bind:class="{ 'is-danger': fieldIsValid('intervalValue', dailyFrequency.occursEvery, intervalValueConstraints) !== '' }" 
            v-model.number="dailyFrequency.occursEvery.intervalValue" class="input">
        </p>                  
        <p class="control">
          <span class="select">
            <select v-model="dailyFrequency.occursEvery.intervalType">
              <option v-bind:value="`minute`">minute(s)</option>
              <option v-bind:value="`hour`">hour(s)</option>
            </select>
          </span>
        </p>                    
      </div>
      <p id="schedule-occurs-every-start-error" qa-data="schedule-occurs-every-start-error" class="help is-danger">{{ fieldIsValid('start', dailyFrequency, everyConstraints) }}</p>
      <p id="schedule-occurs-every-end-error" qa-data="schedule-occurs-every-end-error" class="help is-danger">{{ fieldIsValid('end', dailyFrequency, everyConstraints) }}</p>
      <p id="schedule-every-error" qa-data="schedule-every-error" class="help is-danger">{{ fieldIsValid('intervalValue', dailyFrequency.occursEvery, intervalValueConstraints) }}</p>
    </div> 
  </div>
</template>

<script>

import DatePicker from 'vue2-datepicker';
import constraints from './schedule-validation.js';
import { fieldIsValid } from './schedule-helpers.js';
import utils from '../utils.js';
import dayjs from 'dayjs';

export default {
  data() {
    return {   
       fieldIsValid,
       occursOnceAtConstraints: constraints('en')['occursOnceAt'],
       everyConstraints: constraints('en')['every'],
       intervalValueConstraints: constraints('en')['intervalValue'],
       isNumber: utils.isNumber,
    }
  },
  methods: {
    isLaterThanEnd(time) {  
      if(this.dailyFrequency.end === '')
        return false;
      let endDateTimeSplit = this.dailyFrequency.end.split(':');
      return time > new Date(new Date().setHours(endDateTimeSplit[0], endDateTimeSplit[1], endDateTimeSplit[2], 0))
    },
    isEarlierThanStart(time) {
      if(this.dailyFrequency.start === '')
        return false;
      let startDateTimeSplit = this.dailyFrequency.start.split(':');
      return time < new Date(new Date().setHours(startDateTimeSplit[0], startDateTimeSplit[1], startDateTimeSplit[2], 0));
    },
  },
  props: ['dailyFrequency', 'every'],
  watch: {
    eachNDayValue: function() {
      this.$emit('schedule-daily-frequency-update', { value: this.dailyFrequency });
    }        
  },
  computed: {
    everyValue: {
      get() {
        return this.every;
      },
      set(newValue) {
        this.$emit('schedule-daily-frequency-every-update', { value: newValue });
      }
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