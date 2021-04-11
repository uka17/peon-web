<template>
  <div id="job-general">
    <div class="field">
      <label class="label">Name*</label>
      <div class="control">
        <input v-model="job.name" id="job-dialog-name" class="input" v-bind:class="{ 'is-danger': jobFieldIsValid('name') !== '' }" type="text" placeholder="Job name">
      </div>
      <p id="job-dialog-name-error" class="help is-danger">{{ jobFieldIsValid('name') }}</p>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input qa-data="job-enabled" type="checkbox" v-model="job.enabled"> Enabled
        </label>
      </div>
    </div>    
    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" id="job-dialog-description" placeholder="Job description"  v-model="job.description"></textarea>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Last run</label>
          <div class="control">
            <div v-if="jobRecord.lastRunResult != null">
              <span v-if="jobRecord.lastRunResult" class="tag is-success"> 
                {{ formatDateTime(jobRecord.lastRunOn) }}&nbsp;<i class="mdi mdi-checkbox-marked-circle"></i>
              </span>
              <span v-else class="tag is-danger">
                {{ formatDateTime(jobRecord.lastRunOn) }}&nbsp;<i class="mdi mdi-close-circle"></i>
              </span>            
            </div>
            <div v-else>
              <span class="tag is-warning"> 
                Not yet executed&nbsp;<i class="mdi mdi-help-circle-outline"></i>
              </span>
            </div>
          </div>
        </div>      
      </div>
      <div class="column">      
        <div class="field">
          <label class="label">Next run</label>
          <div class="control">
              {{ formatDateTime(jobRecord.nextRun) }}
          </div>
        </div>         
      </div>        
      <div class="column">
        <div class="field">
          <label class="label">Created by <span class="tag">{{jobRecord.createdBy}}</span></label>
          <div class="control">
            <span class="is-small">{{ formatDateTime(jobRecord.createdOn) }} </span>
          </div>
        </div>      
      </div>
      <div class="column">      
        <div class="field">
          <label class="label">Modified by <span class="tag">{{jobRecord.modifiedBy}}</span></label>
          <div class="control">
            <span>{{ formatDateTime(jobRecord.modifiedOn) }} </span>
          </div>
        </div>       
      </div>        
    </div>          
  </div>
</template>

<script>
import utils from '../utils'
import config from '../config'
import validate from 'validate.js';
import constraints from './job-validation.js';

export default {
  data() {
    return {

    }
  },
  props: {
    jobRecord: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDateTime(dateTime) {
      return utils.helpers.formatDateTime(dateTime);
    },
    jobFieldIsValid(field) {
      const result = validate(this.job, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    }     
  },
  computed: {
    job: function() {
      return this.jobRecord.job !== undefined ? this.jobRecord.job : {};
    } 
  },
  components: {

  }
}
</script>