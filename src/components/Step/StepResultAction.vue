<template>
  <div class="columns">
    <div class="column is-one-third">
      <div class="field has-addons">
        <p class="control">
          <span class="select">
            <select v-model="stepResultAction">
              <option value="gotoNextStep">Go to next step</option>
              <option value="quitWithSuccess">Quit with success</option>
              <option value="quitWithFailure">Quit with failure</option>
              <option value="gotoStep">Go to step</option>
            </select>
          </span>
        </p>
        <template v-if="stepResultAction== 'gotoStep'">       
          <p class="control">
            <input class="input" v-model.number="stepNumber" type="text" style="text-align:center;">   
          </p>
        </template>
      </div>
    </div>
    <div class="column"></div>
  </div> 
</template>

<script>

export default {
  data() {
    return {
      stepResultAction: undefined,
      stepNumber: undefined
    }
  },
  props: {
    onStepResult: {
      required: true
    }
  },
  methods: {
    updateStepResultAction: function() {
      if(this.stepResultAction == 'gotoStep')
        this.$emit('step-result-action-update', { gotoStep: this.stepNumber });
      else
        this.$emit('step-result-action-update', this.stepResultAction);
    }
  },
  watch: {
    onStepResult: function() {
      if(typeof this.onStepResult === 'object') {
        this.stepResultAction = 'gotoStep';
        this.stepNumber = this.onStepResult.gotoStep;
      } else {
        this.stepResultAction = this.onStepResult;
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