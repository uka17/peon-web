<template>
  <div class="field">
    <label class="label">Daily*</label>
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static">
          Each
        </a>           
      </p>              
      <p class="control">
        <input id="schedule-eachnday"  type="text"                
          v-bind:class="{ 'is-danger': fieldIsValid('eachNDay', { 'eachNDay': eachNDayValue }, dailyConstraints) !== '' }"
          maxlength="3" @keypress="isNumber($event)" v-model.number="eachNDayValue" class="input">
      </p>
      <p class="control">
        <a class="button is-static">
          days
        </a>           
      </p>  
    </div>
    <p id="schedule-eachnday-error" class="help is-danger">{{ fieldIsValid('eachNDay', { 'eachNDay': eachNDayValue }, dailyConstraints) }}</p>
  </div>
</template>

<script>

import constraints from './schedule-validation.js';
import { fieldIsValid } from './schedule-helpers.js';
import utils from '../utils.js';

export default {
  props: ['eachNDay'],
  data() {
    return {   
       fieldIsValid,
       dailyConstraints: {'eachNDay': constraints('en')['daily'].eachNDay },
       isNumber: utils.isNumber,
    }
  },
  computed: {
    eachNDayValue: {
      get() {
        return this.eachNDay;
      },
      set(newValue) {
        this.$emit('schedule-each-n-day-update', { value: newValue });
      }
    }
  },
}
</script>

<style lang="scss" >
  @import './schedule.css';
</style>