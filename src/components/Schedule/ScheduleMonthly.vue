<template>
  <div>
    <div class="field">
      <label class="label">Months*</label>
      <div class="control">
        <div class="buttons has-addons">                
          <button v-for="(value, index) in reference.monthList" class="button"
            v-bind:key="index" 
            v-bind:id="value.toLowerCase()"
            v-bind:class="{ 'is-info': monthIsToggled(index), 'is-danger is-outlined': fieldIsValid('month', {'month': month}, monthConstraints) !== ''}" 
            @click="toggleMonth(index)">
              {{ value.substring(0, 3) }}
          </button>
        </div>
      </div>     
      <p id="schedule-months-error" class="help is-danger">{{ fieldIsValid('month', {'month': month}, monthConstraints) }}</p>
    </div>         
    <div class="field">
      <label class="label">Month days*</label>
      <div class="control">
        <input v-model="dayValue" class="input" type="text" 
          v-bind:class="{ 'is-danger': fieldIsValid('day', {'day': dayValue}, dayConstraints) !== '' }" 
          placeholder="Month days comma separated list (e.g. 1,13,29)">
      </div>
      <p id="schedule-monthdays-error" class="help is-danger">{{ fieldIsValid('day', {'day': dayValue}, dayConstraints) }}</p>
    </div>  
  </div>
</template>

<script>

import constraints from './schedule-validation.js';
import { fieldIsValid } from './schedule-helpers.js';
import utils from '../utils.js';
import weekMonthReference from './week-month-reference.js';

export default {
  data() {
    return {   
      dayValue: this.day,
      fieldIsValid,
      monthConstraints: { 'month': constraints('en')['monthly'].month },
      dayConstraints: { 'day': constraints('en')['monthly'].day },       
      isNumber: utils.isNumber,
      reference: weekMonthReference['en'],
    }
  },
  props: ['day', 'month'],
  methods: {
    toggleMonth(month) {
      let index = this.month.indexOf(month);
      if(index > -1) {
        this.month.splice(index, 1);
      } else {
        this.month.push(month);
      }
    },
    monthIsToggled(month) {
      if(this.month) {
        return this.month.indexOf(month) > -1
      } else {
        return false;
      }
    },
  },
  watch: {
    month: function() {
      this.$emit('schedule-month-update', { value: this.month });
    },
    dayValue: function() {
      this.$emit('schedule-month-day-update', { value: this.dayValue });
    }             
  },
  components: {
  }
}
</script>

<style lang="scss" >
  @import './schedule.css';
</style>