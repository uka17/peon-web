<template>
  <div>
    <b-field>
      <b-autocomplete  v-bind:class="{ 'connection-warning': this.connection == null }"
          v-model="connectionValue"
          :data="data"
          field="name"
          placeholder="Connection name"
          @select="selectConnection"
          @input="filterConnectionList"
          >
          <template #empty>No results found</template>
      </b-autocomplete>
    </b-field>
    <p id="step-dialog-connection-error" class="help is-danger" v-if="this.connection == null">{{ fieldIsValid('connection', this.connection, ConnectionConstraints) }}</p>
  </div>
</template>

<script>
import Vue from 'vue'
import { Field, Autocomplete } from 'buefy'
import axios from 'axios';
import config from '../config.js';
import constraints from './step-validation.js';
import { fieldIsValid } from '../common/common-helpers.js';

Vue.use(Field)
Vue.use(Autocomplete)

export default {
    data() {
        return {
          fieldIsValid,
          data: [],
          ConnectionConstraints: { 'connection': constraints('en')['connection'] },
          connectionValue: '',
          apiUrl: `${config.apiUrl}/connections`
        }
    },
    props: ['connection'],
    watch: {
      connection: async function() {     
        this.connectionValue = '';
        if(this.connection) {
          const result = await axios.get(`${this.apiUrl}/${this.connection}`);
          if(result.data)
            this.connectionValue = result.data.connection.name;          
        }
      }             
    },    
    methods: {
      selectConnection(option) {
        let result = option ? option.id : null;
        this.$emit('connection-update', result);

      },
      async filterConnectionList(value) {
        if(value != null && value != undefined) {
          const result = await axios.get(`${this.apiUrl}?filter=${value}&sort=name|asc&page=1&per_page=10`);
          if(result.data.data) {
            this.data = result.data.data;
            //check if current value is equal to any connection
            let connection = result.data.data.find(v => v.name == value);
            if(connection)
              this.$emit('connection-update', connection.id);
            else
              this.$emit('connection-update', null);
          }
          

        }
      }
    }
}
</script>
<style lang="scss" >
.connection-warning {
  border: 1px solid #f14668;
  margin-left: 1px;
  border-radius: 4px;   
}
</style>