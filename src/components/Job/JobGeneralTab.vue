<template>
  <div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input v-model="job.name" class="input" type="text" placeholder="Job name">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" v-model="job.enabled"> Enabled
        </label>
      </div>
    </div>    
    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" placeholder="Job description"  v-model="job.description"></textarea>
      </div>
    </div>  
    <div class="field">
      <label class="label">Created</label>
      <div class="control">
        <span class="is-small">{{ formatDateTime(jobRecord.createdOn) }} </span><span class="tag">{{jobRecord.createdBy}}</span>
      </div>
    </div>      
    <div class="field">
      <label class="label">Modified</label>
      <div class="control">
        <span>{{ formatDateTime(jobRecord.modifiedOn) }} </span><span class="tag">{{jobRecord.modifiedBy}}</span>
      </div>
    </div>          
  </div>
</template>

<script>
import utils from '../utils'
import config from '../config'

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
    formatDateTime: function(dateTime) {
      return utils.formatDateTime(dateTime, config.tableDateTimeFormat, 'en');
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