<template>
  <div class="modal" v-bind:class="{ 'is-active': jobModalIsActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{job.name}}</p>
        <button class="delete" aria-label="close" @click="jobModalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input v-model="job.name" class="input" type="text" placeholder="Job name">
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
          <button class="button is-success" @click="jobModalClose">Save changes</button>
          <button @click="jobModalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
module.exports = {
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
    jobModalClose: function() {
      console.log(this.jobRecord);
      this.$emit('job-modal-close');
    }
  },
  computed: {
    jobModalIsActive: function() {
      return this.jobRecord.job !== undefined;
    },
    job: function() {
      return this.jobRecord.job !== undefined ? this.jobRecord.job : {};
    }
  },
  components: {

  }
}
</script>