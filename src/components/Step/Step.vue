<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Step properties: {{step.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input v-model="step.name" class="input" type="text" v-bind:class="{ 'is-danger': stepFieldIsValid('name') !== '' }" placeholder="Step name">
          </div>
          <p id="step-dialog-name-error" class="help is-danger">{{ stepFieldIsValid('name') }}</p>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="step.enabled"> Enabled
            </label>
          </div>
        </div>
        <div class="field">
          <label class="label">Connection*</label>
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
          <label class="label">Command*</label>
          <div class="control">
            <textarea class="textarea" placeholder="Job description" v-bind:class="{ 'is-danger': stepFieldIsValid('command') !== '' }" v-model="step.command" id="command-code"></textarea>
          </div>
          <p id="step-dialog-command-error" class="help is-danger">{{ stepFieldIsValid('command') }}</p>
        </div>
        <label class="label">Retry</label>        
        <div class="columns">
          <div class="column">            
            <div class="field has-addons">
              <p class="control">
                <input class="input" v-model.number="retryAttempts.number" type="text">
              </p>
              <p class="control">
                <a class="button is-static">
                  per each
                </a>
              </p>
              <p class="control">
                <input class="input" v-model.number="retryAttempts.interval" type="text"> 
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
            <step-result-action v-on:step-result-action-update="onSucceedActionUpdate($event)" v-bind:onStepResult="step.onSucceed"></step-result-action>
          </div>
        </div>     
        <div class="field">
          <label class="label">On failure</label>
          <div class="control">
            <step-result-action v-on:step-result-action-update="onFailureActionUpdate($event)" v-bind:onStepResult="step.onFailure"></step-result-action>
          </div>
        </div>              
      </section>
      <footer class="modal-card-foot buttons is-right">
          <button v-if="!isNew" class="button is-link" @click="saveChanges" v-bind:class="{ 'is-static': !formIsValid }" title="Save step changes">Save changes</button>
          <button v-if="isNew" class="button is-success" @click="createStep" v-bind:class="{ 'is-static': !formIsValid }" title="Create step">Create step</button>
          <button @click="modalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import StepResultAction from './StepResultAction.vue'
import CodeMirror from '../../../node_modules/codemirror/lib/codemirror'
import CodeMirrorMode from '../../../node_modules/codemirror/mode/sql/sql'

import validate from 'validate.js';
import constraints from './step-validation.js';


export default {
  data() {
    return {
      step: {},
      highlighter: null,
      isNew: null
    }
  },
  methods: {
    modalShow(step, isNew = false) {
      this.$set(this, 'isNew', isNew);
      this.$set(this, 'step', step);
      //Have no idea how it works, but CodeMirror needs a tiny delay before init =(
      setTimeout(() => {
        if(this.highlighter === null) {
          this.highlighter = CodeMirror.fromTextArea(document.getElementById('command-code'), {
            lineNumbers: true,
            theme: "elegant"
          });
          this.highlighter.on('keyup', function(instance, event) {
            //Codemirror is not reactive element unfortunately
            console.log(instance);
            this.step.command = this.highlighter.getValue();     
          });
        };   
      }, 1)  
    },
    saveChanges: function() {
      this.$emit('step-modal-save', this.step);       
      this.modalClose();
    },
    createStep() {
      this.$emit('step-modal-new', this.step);       
      this.modalClose();
    },
    modalClose: function() {
      this.$set(this, 'step', {});
      this.highlighter.toTextArea();
      this.highlighter = null;
    },
    onSucceedActionUpdate: function(v) {
      this.step.onSucceed = v;
    },
    onFailureActionUpdate: function(v) {
      this.step.onFailure = v;
    },
    stepFieldIsValid(field) {
      const result = validate(this.step, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    }    
  },
  computed: {
    modalIsActive: function() {
      return this.step.name !== undefined;
    },
    retryAttempts: function() {
      return this.step.retryAttempts !== undefined ? this.step.retryAttempts : {};
    },
    formIsValid() {
      return (validate(this.step, constraints('en')) === undefined)
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