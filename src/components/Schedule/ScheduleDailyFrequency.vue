<template>
  <div>
    <label class="label">Daily frequency*</label>
    <div class="field">            
      <div class="control">
        <label class="radio">
          <input type="radio" name="once" v-bind:value="false" v-model="everyValue">
          Once
        </label>
        <label class="radio">
          <input type="radio" name="every" v-bind:value="true" v-model="everyValue">
          Periodicaly
        </label>
      </div>            
    </div>
    <div class="field" v-bind:class="{ 'is-hidden': everyValue }" >
      <label class="label">Time*</label>
      <div class="control" v-bind:class="{ 'custom-warning': fieldIsValid('occursOnceAt', dailyFrequency, occursOnceAtConstraints) !== ''}"> 
        <date-time-picker
          v-model="dailyFrequency.occursOnceAt"
          format="HH:mm:ss"
          value-type="format"
          type="time"
          placeholder="HH:mm:ss">
        </date-time-picker>
      </div>
      <p id="schedule-occursonceat-error" class="help is-danger">{{ fieldIsValid('occursOnceAt', dailyFrequency, occursOnceAtConstraints)  }}</p>
    </div>   
    <div v-bind:class="{ 'is-hidden': !everyValue}">
      <label class="label">Recurrence*</label>
      <div class="field has-addons">
        <p class="control">
          <a class="button is-static">
            Starting
          </a>           
        </p>              
        <div v-bind:class="{ 'custom-warning-inline': fieldIsValid('start', dailyFrequency, everyConstraints) !== '' }">
          <p class="control date-time-picker">          
            <date-time-picker
              v-model="dailyFrequency.start"
              format="HH:mm:ss"
              value-type="format"
              type="time"
              placeholder="HH:mm:ss"
              :disabled-time="startIsEarlierThanEnd">
            </date-time-picker>          
          </p>
        </div>
        <p class="control">
          <a class="button is-static">
            till
          </a>           
        </p>  
        <div v-bind:class="{ 'custom-warning-inline': fieldIsValid('end', dailyFrequency, everyConstraints) !== '' }">        
          <p class="control date-time-picker">              
            <date-time-picker
              v-model="dailyFrequency.end"
              format="HH:mm:ss"
              value-type="format"
              type="time"
              placeholder="HH:mm:ss"
              :disabled-time="endIsLaterThanStart">
            </date-time-picker>   
          </p>
        </div>
        <p class="control">
          <a class="button is-static">
            every
          </a>           
        </p>
        <p class="control">
          <input id="schedule-interval-value" maxlength="3" @keypress="isNumber($event)" type="text"
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
      <p id="schedule-occurs-every-start-error" class="help is-danger">{{ fieldIsValid('start', dailyFrequency, everyConstraints) }}</p>
      <p id="schedule-occurs-every-end-error" class="help is-danger">{{ fieldIsValid('end', dailyFrequency, everyConstraints) }}</p>
      <p id="schedule-every-error" class="help is-danger">{{ fieldIsValid('intervalValue', dailyFrequency.occursEvery, intervalValueConstraints) }}</p>
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
    startIsEarlierThanEnd(time) {  
      let endDateTime = this.dailyFrequency.end === '' ? '00:00:00' : this.dailyFrequency.end;
      let endDateTimeSplit = endDateTime.split(':');
      return time > new Date(new Date().setHours(endDateTimeSplit[0], endDateTimeSplit[1], endDateTimeSplit[2], 0))
    },
    endIsLaterThanStart(time) {
      let startDateTime = this.dailyFrequency.end === '' ? '00:00:00' : this.dailyFrequency.start;
      let startDateTimeSplit = startDateTime.split(':');
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