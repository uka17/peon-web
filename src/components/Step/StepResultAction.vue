<template>
  <div class="field has-addons">
    <p class="control">
      <span class="select">
        <select v-model="stepResultAction">
          <option value="gotoNextStep">Go to next step</option>
          <option value="quitWithSuccess">Quit with success</option>
          <option value="quitWithFailure">Quit with failure</option>
          <option v-if="stepList.length > 0" value="gotoStep">Go to step</option>
        </select>
      </span>
    </p>
    <template v-if="stepResultAction== 'gotoStep'">       
      <p class="control">
        <span class="select">
          <select v-model="stepNumber">
            <option v-for="option in stepList" v-bind:value="option.order">
              {{ `${option.order} (${truncateString(option.name, 10)})` }}
            </option>
          </select>
        </span>
      </p>
    </template>
  </div>
</template>

<script>

import utils from '../utils.js';

export default {
  data() {
    return {
      stepResultAction: undefined,
      stepNumber: undefined
    }
  },
  props: {
    stepResult: {
      required: true
    },
    stepList: {
      required: true
    }    
  },
  methods: {
    updateStepResultAction: function() {
      if(this.stepResultAction == 'gotoStep')
        this.$emit('step-result-action-update', { gotoStep: parseInt(this.stepNumber) });
      else
        this.$emit('step-result-action-update', this.stepResultAction);
    },
    truncateString: utils.truncateString
  },
  watch: {
    stepResult: function() {
      if(typeof this.stepResult === 'object') {
        this.stepResultAction = 'gotoStep';
        this.stepNumber = this.stepResult.gotoStep;
      } else {
        this.stepResultAction = this.stepResult;
        this.stepNumber = 1;
      }
    },
    stepResultAction: function() {
      this.updateStepResultAction();
    },
    stepNumber: function() {
      this.updateStepResultAction();
    }
  }
}
</script>
<style lang="scss" >
 #goto-step-number {
    width: 50px;
    text-align: center;
  }
</style>