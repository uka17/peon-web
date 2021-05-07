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
    <div class="field" v-bind:class="{ 'is-hidden': everyValue}">
      <label class="label">Time*</label>
      <div class="control">     
        <input id="schedule-occurs-once-at" maxlength="8" type="text"
        v-bind:class="{ 'is-danger': fieldIsValid('occursOnceAt', dailyFrequency, occursOnceAtConstraints) !== '' }"
        v-model="dailyFrequency.occursOnceAt" class="input">   
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
        <p class="control">
          <input id="schedule-occurs-every-start" maxlength="8" type="text"
            v-bind:class="{ 'is-danger': fieldIsValid('start', dailyFrequency, everyConstraints) !== '' }"
            v-model="dailyFrequency.start" class="input">
        </p>
        <p class="control">
          <a class="button is-static">
            till
          </a>           
        </p>  
        <p class="control">              
          <input id="schedule-occurs-every-end" maxlength="8" type="text"
            v-bind:class="{ 'is-danger': fieldIsValid('end', dailyFrequency, everyConstraints) !== '' }"
            v-model="dailyFrequency.end" class="input">
        </p>
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

import constraints from './schedule-validation.js';
import { fieldIsValid } from './schedule-helpers.js';
import utils from '../utils.js';

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
  }
}
</script>

<style lang="scss" >
  @import './schedule.css';
</style>