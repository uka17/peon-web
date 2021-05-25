<template>
  <div>
    <label class="label">Weekly*</label>
    <div class="columns">
      <div class="column is-narrow">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-static">
              Each
            </a>           
          </p>              
          <p class="control">
            <input id="schedule-eachnweek"  type="text" qa-data="schedule-dialog-eachnweek"   
              v-bind:class="{ 'is-danger': fieldIsValid('eachNWeek', { 'eachNWeek': eachNWeekValue }, eachNWeekConstraints) !== '' }"
              maxlength="3" @keypress="isNumber($event)" v-model.number="eachNWeekValue" class="input">
          </p>
          <p class="control">
            <a class="button is-static">
              weeks
            </a>           
          </p>  
        </div>
      </div>
      <div class="column">
        <div class="field"> 
          <div class="control">
            <div class="buttons has-addons" qa-data="schedule-dialog-weekday">                
              <button v-for="(value, index) in reference.weekDayList" class="button"
                v-bind:key="index" 
                v-bind:id="value.toLowerCase()" 
                v-bind:class="{ 'is-info': weekDayIsToggled(index), 'is-danger is-outlined': fieldIsValid('dayOfWeek', { 'dayOfWeek': dayOfWeek }, dayOfWeekConstraints) !== '' }"
                @click="toggleWeekDay(index)">
                  {{ value.substring(0, 3) }}
              </button>
            </div>
          </div>
        </div>
      </div>            
    </div>                       
    <p id="schedule-eachnweek-error" qa-data="schedule-eachnweek-error" class="help is-danger">{{ fieldIsValid('eachNWeek', { 'eachNWeek': eachNWeekValue }, eachNWeekConstraints) }}</p>                           
    <p id="schedule-weekdays-error" qa-data="schedule-weekdays-error" class="help is-danger">{{ fieldIsValid('dayOfWeek', { 'dayOfWeek': dayOfWeek }, dayOfWeekConstraints) }}</p>
  </div>
</template>

<script>

import constraints from './schedule-validation.js';
import { fieldIsValid } from '../common/common-helpers.js';
import utils from '../utils.js';
import weekMonthReference from './week-month-reference.js';

export default {
  data() {
    return {   
       dayOfWeekValue: this.dayOfWeek,
       fieldIsValid,
       eachNWeekConstraints: {'eachNWeek': constraints('en')['weekly'].eachNWeek },
       dayOfWeekConstraints: {'dayOfWeek': constraints('en')['weekly'].dayOfWeek },
       isNumber: utils.isNumber,
       reference: weekMonthReference['en'],
    }
  },
  props: ['eachNWeek', 'dayOfWeek'],
  methods: {
    toggleWeekDay(weekDay) {
      let index = this.dayOfWeek.indexOf(weekDay);
      if(index > -1) {
        this.dayOfWeek.splice(index, 1);
      } else {
        this.dayOfWeek.push(weekDay);
      }
    },
    weekDayIsToggled(weekDay) {
      if(this.dayOfWeek) {
        return this.dayOfWeek.indexOf(weekDay) > -1
      } else {
        return false;
      }
    }
  },
  watch: {
    dayOfWeek: function() {
      this.$emit('schedule-day-of-week-update', { value: this.dayOfWeek });
    }             
  },
  computed: {
    eachNWeekValue: {
      get() {
        return this.eachNWeek;
      },
      set(newValue) {
        this.$emit('schedule-each-n-week-update', { value: newValue });
      }
    }       
  },  
  components: {
  }
}
</script>

<style lang="scss" >
  @import './schedule.css';
</style>