<template>
  <div class="modal" v-bind:class="{ 'is-active': stepModalIsActive }" v-on:keyup.esc="stepModalClose()">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Step properties: {{step.name}}</p>
        <button class="delete" aria-label="close" @click="stepModalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input v-model="step.name" class="input" type="text" placeholder="Step name">
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="step.enabled"> Enabled
            </label>
          </div>
        </div>
        <div class="field">
          <label class="label">Connection</label>
          <div class="control">
            <div class="select">
              <select>
                <option>Connection 1</option>
                <option>Connection 2</option>
              </select>
            </div>
          </div>
        </div>           
        <div class="field">
          <label class="label">Command</label>
          <div class="control">
            <textarea class="textarea" placeholder="Job description" v-model="step.command" id="command-code"></textarea>
          </div>
        </div>
        <label class="label">Retry</label>
        <div class="columns">
          <div class="column is-two-fifths">
            <div class="field has-addons">
              <p class="control">
                <input class="input" v-model="retryAttempts.number" type="text">
              </p>
              <p class="control">
                <a class="button is-static">
                  per each
                </a>
              </p>
              <p class="control">
                <input class="input" v-model="retryAttempts.interval" type="text"> 
              </p>
              <p class="control">
                <a class="button is-static">
                  minute(s)          
                </a>
              </p>
            </div>        
          </div>
          <div class="column"></div>
        </div>
        <div class="field">
          <label class="label">On succeed</label>
          <div class="control">
            <step-result-action v-on:step-result-action-update="stepOnSucceedActionUpdate($event)" v-bind:onStepResult="step.onSucceed"></step-result-action>
          </div>
        </div>     
        <div class="field">
          <label class="label">On failure</label>
          <div class="control">
            <step-result-action v-on:step-result-action-update="stepOnFailureActionUpdate($event)" v-bind:onStepResult="step.onFailure"></step-result-action>
          </div>
        </div>              
      </section>
      <footer class="modal-card-foot buttons is-right">
          <button class="button is-link" @click="stepModalClose">Save changes</button>
          <button @click="stepModalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import StepResultAction from './StepResultAction.vue'
import CodeMirror from '../../../node_modules/codemirror/lib/codemirror'
import CodeMirrorMode from '../../../node_modules/codemirror/mode/sql/sql'


export default {
  data() {
    return {

    }
  },
  props: {
    step: {
      type: Object,
      required: true
    }
  },
  updated: function() {
    var editor = CodeMirror.fromTextArea(document.getElementById('command-code'), {
      lineNumbers: true,
      theme: "elegant"
    });
  },
  methods: {
    stepModalClose: function() {
      this.$emit('step-modal-close');
    },
    stepOnSucceedActionUpdate: function(v) {
      this.step.onSucceed = v;
    },
    stepOnFailureActionUpdate: function(v) {
      this.step.onFailure = v;
    }
  },
  computed: {
    stepModalIsActive: function() {
      return this.step.name !== undefined;
    },
    retryAttempts: function() {
      return this.step.retryAttempts !== undefined ? this.step.retryAttempts : {};
    } 
  },
  components: {
    'step-result-action': StepResultAction
  }
}
</script>

<style lang="scss" >
  @import '../../../node_modules/codemirror/lib/codemirror.css';
  @import '../../../node_modules/codemirror/theme/elegant.css';
  .CodeMirror {
    height: 100px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    font-size: 10pt;
  }
  .CodeMirror:hover {
    border: 1px solid #b5b5b5;    
  }
</style>