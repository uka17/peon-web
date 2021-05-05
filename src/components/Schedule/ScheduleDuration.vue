<template>
  <div class="field">
    <label class="label">Duration*</label>                 
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static">
          Start date
        </a>           
      </p>              
      <p class="control">
        <date-time-picker v-model="startDateTimeValue" type="datetime">   
            </date-time-picker>               
      </p>
      <p id="schedule-start-date-time-error" class="help is-danger">{{ fieldIsValid('startDateTime', startDateTimeValue, constraints('en')['startEndDateTime']) }}</p>                
      <p v-if="!endlessValue" class="control">
        <a class="button is-static">
          End date
        </a>           
      </p>  
      <p v-if="!endlessValue" class="control">              
        <date-time-picker v-model="endDateTimeValue" type="datetime">   
            </date-time-picker>           
      </p>
      <p v-if="!this.endlessValue" id="schedule-end-date-time-error" class="help is-danger">{{ fieldIsValid('endDateTime', endDateTimeValue, constraints('en')['startEndDateTime']) }}</p>      
    </div> 
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
       startDateTimeValue: this.startDateTime,
       endDateTimeValue: this.endDateTime,
       endlessValue: this.endless,
       fieldIsValid,
       constraints     
    }
  },
  props: ['startDateTime', 'endDateTime', 'endless'],
  watch: {
    startDateTime: function() {
      this.$emit('schedule-duration-start-update', { value: this._startDateTime });
    },
    endDateTime: function() {
      this.$emit('schedule-duration-end-update', { value: this._endDateTime });
    }    
  },
  components: {
    'date-time-picker': DatePicker
  }
}
</script>

<style lang="scss" >

</style>