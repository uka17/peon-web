<template>
  <div>
    <select v-model="formValue">
      <option value="gotoNextStep">Go to next step</option>
      <option value="quitWithSuccess">Quit with success</option>
      <option value="quitWithFailure">Quit with failure</option>
      <option value="gotoStep">Go to step</option>
    </select>
    <input v-if="typeof onStepResult == 'object'" class="input" v-model="stepNumber" type="text">   
  </div>
</template>

<script>

export default {
  data() {
    return {
      stepNumber: 1
    }
  },
  props: {
    onStepResult: {
      required: true
    }
  },
  computed: {
    formValue: {
      get: function() {
        if(typeof this.onStepResult == 'object') {
          stepNumber = this.onStepResult.gotoStep;
          return 'gotoStep';  
        }
        else
          return this.onStepResult;
      },
      set: function(v) {
        if(v == 'gotoStep')
          this.onStepResult = {gotoStep: this.stepNumber}
        else
          this.onStepResult = v;
      }
    }
  }
}
</script>