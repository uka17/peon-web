<template>
  <div>
    <div class="field">
      <div class="control">
        <label class="radio">
          <input type="radio" name="once" v-bind:value="true" v-model="cEvery">
          Once
        </label>
        <label class="radio">
          <input type="radio" name="every" v-bind:value="false" v-model="cEvery">
          Periodicaly
        </label>
      </div>
    </div>
    <div class="field" v-bind:class="{ 'is-hidden': !cEvery}">
      <label class="label">Time*</label>
      <div class="control">
        <input v-model="cDailyFrequency.occursOnceAt" class="input" type="text" placeholder="Execution time">
      </div>
    </div>   
    <div class="field has-addons" v-bind:class="{ 'is-hidden': cEvery}">
      <p class="control">
        <a class="button is-static">
          Every
        </a>           
      </p>
      <p class="control">
        <input id="schedule-interval-value" v-model.number="cDailyFrequency.occursEvery.intervalValue" class="input" type="text">
      </p>                  
      <p class="control">
        <span class="select">
          <select v-model="cDailyFrequency.occursEvery.intervalType">
            <option v-bind:value="`minute`">Minute(s)</option>
            <option v-bind:value="`hour`">Hour(s)</option>
          </select>
        </span>
      </p>
    </div>  
  </div>
</template>

<script>

import utils from '../utils.js';

export default {
  data() {
    return {
      cDailyFrequency: this.dailyFrequency,
      cEvery: this.every
    }
  },
  props: ['dailyFrequency', 'every'],
  watch: {
    cDailyFrequency() {
      this.$emit('daily-frequency', this.cDailyFrequency);
    },
    cEvery() {
      this.$emit('every', this.cEvery);
    }
  }
}
</script>
<style lang="scss" >

</style>