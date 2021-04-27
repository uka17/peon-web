<template>
  <div class="field">
    <label class="label">Date and time*</label>
    <div class="control">
      <input v-model="schedule.oneTime" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }" placeholder="Execution date and time">
        <date-time-picker :value="schedule.oneTime" 
          :dayStr="weekDays" 
          :monthStr="monthStr" 
          :btnStr="btnStr" 
          :timeStr="timeStr" 
          :timeType="timeType" 
          :placeholder="placeholder"
          @input="chooseDateTime">          
            </date-time-picker>
    </div>
    <p id="schedule-dialog-onetime-error" class="help is-danger">{{ fieldIsValid('oneTime') }}</p>
  </div>  
</template>

<script>

import { DatetimePicker } from '@livelybone/vue-datepicker';

import validate from 'validate.js';
import constraints from './schedule-validation.js';
import translation from '../translation/controls.js';
import utils from '../utils.js';


export default {
  data() {
    return {   
      weekDays: translation.dateTimePicker.weekDays,
      monthStr: translation.dateTimePicker.monthStr,
      btnStr: translation.dateTimePicker.btnStr,
      timeStr: translation.dateTimePicker.timeStr,
      //not a translation, but parameter... nevermind
      timeType: translation.dateTimePicker.timeType,
      placeholder: translation.dateTimePicker.placeholder          
    }
  },
  props: ['schedule'],
  methods: {
    fieldIsValid(field) {
      const result = validate(this.schedule, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    },
    chooseDateTime(val) {
      this.schedule.oneTime = val;
    }    
  },
  computed: {

  },
  components: {
    //'schedule-result-action': ScheduleResultAction
    'date-time-picker': DatetimePicker
  }
}
</script>

<style lang="scss" >
@import 'node_modules/@livelybone/vue-datepicker/lib/css/index.scss'
</style>