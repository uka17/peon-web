<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Step properties: {{step.name}}</p>
        <button class="delete" qa-data="step-modal-close" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input qa-data="step-name" v-model="step.name" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }" placeholder="Step name">
          </div>
          <p id="step-dialog-name-error" class="help is-danger">{{ fieldIsValid('name') }}</p>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input qa-data="step-enabled" type="checkbox" v-model="step.enabled"> Enabled
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
            <textarea qa-data="step-command" class="textarea" placeholder="Job description" v-bind:class="{ 'is-danger': fieldIsValid('command') !== '' }" v-model="step.command" id="command-code"></textarea>
          </div>
          <p id="step-dialog-command-error" class="help is-danger">{{ fieldIsValid('command') }}</p>
        </div>
        <label class="label">Retry</label>                 
          <div class="field has-addons">
            <p class="control">
              <input 
                qa-data="step-retry-number"
                id="retry-number" class="input" maxlength="2" @keypress="isNumber($event)" type="text"
                v-model.number="retryAttempts.number" 
                v-bind:class="{ 'is-danger': fieldIsValid('retryAttempts.number') !== '' }" >
            </p>
            <p class="control">
              <a class="button is-static" v-if="retryAttempts.number !== 0">
                per each
              </a>
              <a class="button is-static" v-if="retryAttempts.number === 0">
                retries
              </a>                
            </p>
            <p class="control" v-if="retryAttempts.number !== 0">
              <input 
                qa-data="step-retry-interval"
                id="retry-interval" class="input" maxlength="3" @keypress="isNumber($event)" type="text"
                v-model.number="retryAttempts.interval"                   
                v-bind:class="{ 'is-danger': fieldIsValid('retryAttempts.interval') !== '' }"
              > 
            </p>
            <p class="control" v-if="retryAttempts.number !== 0">
              <a class="button is-static">
                minute(s)          
              </a>
            </p>
          </div>        
          <p id="step-dialog-retry-number-error" class="help is-danger">{{ fieldIsValid('retryAttempts.number') }}</p>
          <p id="step-dialog-retry-interval-error" class="help is-danger">{{ fieldIsValid('retryAttempts.interval') }}</p>                            
        <div class="field">
          <label class="label">On succeed</label>
          <div qa-data="step-result-action-succeed" class="control">
            <step-result-action 
              v-on:step-result-action-update="onSucceedActionUpdate($event)"               
              v-bind:stepList="stepList"
              v-bind:stepResult="step.onSucceed">
            </step-result-action>
          </div>
        </div>     
        <div class="field">
          <label class="label">On failure</label>
          <div qa-data="step-result-action-failure" class="control">
            <step-result-action 
              v-on:step-result-action-update="onFailureActionUpdate($event)" 
              v-bind:stepList="stepList"
              v-bind:stepResult="step.onFailure">
            </step-result-action>
          </div>
        </div>              
      </section>
      <footer class="modal-card-foot buttons is-right">
          <button qa-data="step-save" v-if="!isNew" class="button is-link" @click="save" v-bind:class="{ 'is-static': !formIsValid }" title="Save step changes">Save changes</button>
          <button qa-data="step-create" v-if="isNew" class="button is-success" @click="create" v-bind:class="{ 'is-static': !formIsValid }" title="Create step">Create step</button>
          <button qa-data="step-cancel" @click="modalClose" class="button">Cancel</button>
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
import utils from '../utils.js';


export default {
  data() {
    return {
      step: {},
      highlighter: null,
      isNew: null,
      stepList: []
    }
  },
  methods: {
    modalShow(step, stepList, isNew = false) {
      this.$set(this, 'isNew', isNew);
      this.$set(this, 'step', step);
      this.$set(this, 'stepList', stepList);
      //Have no idea how it works, but CodeMirror needs a tiny delay before init =(
      setTimeout(() => {
        if(this.highlighter === null) {
          this.highlighter = CodeMirror.fromTextArea(document.getElementById('command-code'), {
            lineNumbers: true,
            theme: "elegant"
          });
          let step = this.step;
          this.highlighter.on('keyup', function(instance, event) {
            //Codemirror is not reactive element unfortunately
            step.command = instance.getValue();
          });
        };   
      }, 1)  
    },
    save: function() {
      this.$emit('step-modal-save', this.step);       
      this.modalClose();
    },
    create() {
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
    fieldIsValid(field) {
      const result = validate(this.step, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    },
    isNumber: utils.isNumber   
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
  #retry-number, #retry-interval {
    width: 50px;
    text-align: center;
  }
</style>