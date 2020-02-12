<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Connection properties: {{connection.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input v-model="connection.name" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }" placeholder="Connection name">
          </div>
          <p id="connection-dialog-name-error" class="help is-danger">{{ fieldIsValid('name') }}</p>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="connection.enabled"> Enabled
            </label>
          </div>
        </div>     
        <div class="field">
          <label class="label">Host*</label>
          <div class="control">
            <input v-model="connection.host" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('host') !== '' }" placeholder="Database endpoint">
          </div>
          <p id="connection-dialog-host-error" class="help is-danger">{{ fieldIsValid('host') }}</p>
        </div>
        <div class="field">
          <label class="label">Port</label>
          <div class="control">
            <input v-model="connection.port" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('port') !== '' }" placeholder="Connection port">
          </div>
          <p id="connection-dialog-port-error" class="help is-danger">{{ fieldIsValid('port') }}</p>
        </div>
        <div class="field">
          <label class="label">Login</label>
          <div class="control">
            <input v-model="connection.login" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('login') !== '' }" placeholder="Login for database connection">
          </div>
          <p id="connection-dialog-login-error" class="help is-danger">{{ fieldIsValid('login') }}</p>
        </div>    
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input v-model="connection.password" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('password') !== '' }" placeholder="Password for database connection">
          </div>
          <p id="connection-dialog-password-error" class="help is-danger">{{ fieldIsValid('password') }}</p>
        </div>  
        <div class="field">
          <label class="label">Type*</label>
          <div class="control">
            <div class="select">
              <select v-model="connection.type">
                <option value="postgresql">PostgreSQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>
          </div>
        </div>                                                                    
      </section>
      <footer class="modal-card-foot buttons is-right">
          <button v-if="!isNew" class="button is-link" @click="save" v-bind:class="{ 'is-static': !formIsValid }" title="Save connection changes">Save changes</button>
          <button v-if="isNew" class="button is-success" @click="create" v-bind:class="{ 'is-static': !formIsValid }" title="Create connection">Create connection</button>
          <button @click="modalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import validate from 'validate.js';

import axios from 'axios';
import { EventBus } from '../utils.js';

import constraints from './connection-validation.js';
import connection_template from './connection-template.js';
import utils from '../utils.js';
import config from '../config.js';


export default {
  data() {
    return {
      connectionRecord: {},
      isNew: null,      
      apiUrl: `${config.apiUrl}/connections`
    }
  },
  async beforeMount() {
    try {      
      let dialogRecord;
      if(this.id === 'create') {
        dialogRecord = JSON.parse(JSON.stringify(connection_template.newConnection));
        this.modalShow(dialogRecord, true);
      }
      else {
        dialogRecord = await axios.get(`${this.apiUrl}/${this.id}`);
        this.modalShow(dialogRecord.data);
      }
    } catch (error) {
      EventBus.$emit('app-error', utils.parceApiError(error));
    }  
  },  
  props: ['id'],
  methods: {
    modalShow(connection, isNew = false) {
      this.$set(this, 'isNew', isNew);
      this.$set(this, 'connectionRecord', connection);     
    },
    save: function() {
      this.$emit('connection-modal-save', this.connection);       
      this.modalClose();
    },
    create() {
      this.$emit('connection-modal-new', this.connection);       
      this.modalClose();
    },
    modalClose: function() {
      try {
        this.$set(this, 'connectionRecord', {});
      }
      finally {
        this.$router.push('/connections/');
      }
    },
    fieldIsValid(field) {
      const result = validate(this.connection, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    },
    isNumber: utils.isNumber   
  },
  computed: {
    modalIsActive: function() {
      return this.connection.name !== undefined;
    },    
    connection: function() {
      return this.connectionRecord.connection !== undefined ? this.connectionRecord.connection : {};
    },
    formIsValid() {
      return (validate(this.connection, constraints('en')) === undefined)
    }
  },
  components: {

  }
}
</script>

<style lang="scss" >

</style>