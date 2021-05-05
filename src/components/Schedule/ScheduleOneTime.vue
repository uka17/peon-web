<template>
  <div class="field">
    <label class="label">Date and time*</label>
    <div class="control">
        <date-time-picker v-model="oneTime" type="datetime">   
            </date-time-picker>
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

</style>