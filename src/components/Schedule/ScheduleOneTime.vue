<template>
  <div class="field">
    <label class="label">Date and time*</label>
    <div class="control">
      <div v-bind:class="{ 'custom-warning': fieldIsValid('oneTime', { 'oneTime': oneTime }, constraints) !== '' }" >
        <date-time-picker v-model="oneTime" type="datetime">   
        </date-time-picker>
      </div>
    </div>
    <p id="schedule-onetime-error" class="help is-danger">{{ fieldIsValid('oneTime', { 'oneTime': oneTime }, constraints) }}</p>                  
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
       oneTime: this.value,
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
  props: ['value'],
  watch: {
    oneTime: function() {
      this.$emit('schedule-one-time-update', { value: this.oneTime });
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