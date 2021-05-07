<template>
  <div class="field">
    <label class="label">Date and time*</label>
    <div class="control">
      <div v-bind:class="{ 'custom-warning': fieldIsValid('oneTime', { 'oneTime': oneTimeValue }, constraints) !== '' }" >
        <date-time-picker v-model="oneTimeValue" type="datetime" value-type="format" format="YYYY-MM-DD HH:mm:ss">   
        </date-time-picker>
      </div>
    </div>
    <p id="schedule-onetime-error" class="help is-danger">{{ fieldIsValid('oneTime', { 'oneTime': oneTimeValue }, constraints) }}</p>                  
  </div>  
</template>

<script>

import constraints from './schedule-validation.js';
import { fieldIsValid } from './schedule-helpers.js';
import DatePicker from 'vue2-datepicker';
import config from '../config.js';
import dayjs from 'dayjs';

import 'vue2-datepicker/index.css';

export default {
  data() {
    return {   
      fieldIsValid,
      constraints: {'oneTime': constraints('en')['onetime'].oneTime }     
    }
  },
  methods: {
    dateIsInPast(date) {
      const currentDate = dayjs().subtract(1, 'day').valueOf();
      return date < currentDate;
    },
  },
  computed: {
    oneTimeValue: {
      get() {        
        return dayjs(this.oneTime).isValid() ? dayjs(this.oneTime).format(config.dateTimeFormatSec) : '';
      },
      set(newValue) {
        this.$emit('schedule-one-time-update', { value: newValue });
      }
    }
  },
  props: ['oneTime'],
  components: {
    'date-time-picker': DatePicker
  }
}
</script>

<style lang="scss" >
  @import './schedule.css';

</style>