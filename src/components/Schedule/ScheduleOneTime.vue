<template>
  <div class="field">
    <label class="label">Date and time*</label>
    <div class="control">
        <date-time-picker :value="this.oneTime" 
          :dayStr="weekDays" 
          :monthStr="monthStr" 
          :btnStr="btnStr" 
          :timeStr="timeStr" 
          :timeType="timeType" 
          :placeholder="placeholder"
          @input="chooseDateTime">          
            </date-time-picker>
    </div>
  </div>  
</template>

<script>

import { DatetimePicker } from '@livelybone/vue-datepicker';

import validate from 'validate.js';
import constraints from './schedule-validation.js';
import translation from '../translation/controls.js';
import utils from '../utils.js';
import dayjs from 'dayjs'

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
    'oneTime': function() {
      console.log("time: ", this.schedule.oneTime)
      return this.schedule.oneTime !== undefined ? dayjs(this.schedule.oneTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    },
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