<template>
  <div class="modal is-active" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card" id="job-modal-content">
      <header class="modal-card-head">
        <p v-if="jobRecord.body" class="modal-card-title">Job properties</p>
        <button
          qa-data="job-modal-close"
          class="delete"
          aria-label="close"
          @click="modalClose"
        ></button>
      </header>
      <section class="modal-card-body">
        <div class="has-text-centered" v-if="!jobRecord.body">
          Loading job data...
          <progress
            id="job-loading"
            class="progress is-small is-info"
            max="100"
          >
            10%
          </progress>
        </div>
        <div v-if="jobRecord.body">
          <div class="tabs is-boxed">
            <ul>
              <li v-bind:class="{ 'is-active': this.activeTab == 'general' }">
                <a id="general-tab" @click="tabClick('general')">
                  <span>General</span
                  ><span v-if="!generalTabIsValid" class="icon has-text-danger"
                    ><i class="mdi mdi-alert-circle-outline"></i
                  ></span>
                </a>
              </li>
              <li v-bind:class="{ 'is-active': this.activeTab == 'steps' }">
                <a id="steps-tab" @click="tabClick('steps')">
                  <span>Steps</span
                  ><span v-if="!stepListTabIsValid" class="icon has-text-danger"
                    ><i class="mdi mdi-alert-circle-outline"></i
                  ></span>
                </a>
              </li>
              <li v-bind:class="{ 'is-active': this.activeTab == 'schedules' }">
                <a id="schedules-tab" @click="tabClick('schedules')">
                  <span>Schedules</span
                  ><span
                    v-if="!scheduleListTabIsValid"
                    class="icon has-text-danger"
                    ><i class="mdi mdi-alert-circle-outline"></i
                  ></span>
                </a>
              </li>
              <li
                v-bind:class="{
                  'is-active': this.activeTab == 'notifications',
                }"
              >
                <a id="notifications-tab" @click="tabClick('notifications')">
                  <span>Notifications</span></a
                >
              </li>
            </ul>
          </div>
          <div>
            <section
              class="tab-content"
              v-bind:class="{ 'is-hidden': this.activeTab != 'general' }"
            >
              <job-general-tab v-bind:jobRecord="jobRecord"></job-general-tab>
            </section>
            <section
              class="tab-content"
              v-bind:class="{ 'is-hidden': this.activeTab != 'steps' }"
            >
              <step-list-tab
                ref="stepList"
                v-bind:stepList="stepList"
              ></step-list-tab>
            </section>
            <section
              class="tab-content"
              v-bind:class="{ 'is-hidden': this.activeTab != 'schedules' }"
            >
              <schedule-list-tab
                ref="scheduleList"
                v-bind:scheduleList="scheduleList"
              ></schedule-list-tab>
            </section>
            <section
              class="tab-content"
              v-bind:class="{ 'is-hidden': this.activeTab != 'notifications' }"
            >
              Notifications
            </section>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-right" v-if="jobRecord.body">
        <button
          v-if="!isNew"
          id="button-job-save"
          qa-data="job-save"
          class="button is-link"
          v-bind:class="{ 'is-static': !formIsValid }"
          @click="save"
        >
          Save changes
        </button>
        <button
          v-if="isNew"
          id="button-job-create"
          qa-data="job-create"
          class="button is-success"
          v-bind:class="{ 'is-static': !formIsValid }"
          @click="create"
        >
          Create job
        </button>
        <button
          @click="modalClose"
          id="button-job-cancel"
          qa-data="job-cancel"
          class="button"
        >
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import JobGeneralTab from "./JobGeneralTab.vue";
import StepList from "../StepList/StepList.vue";
import ScheduleList from "../ScheduleList/ScheduleList.vue";
import { nanoid } from "nanoid";

import config from "../config.js";
import utils from "../utils.js";
import axios from "axios";
import validate from "validate.js";
import constraints from "./job-validation.js";

import job_template from "./job-template.js";

import { EventBus } from "../utils.js";

export default {
  data() {
    return {
      jobRecord: {},
      activeTab: "general",
      isNew: null,
      apiUrl: `${config.apiUrl}/jobs`,
    };
  },
  async beforeMount() {
    try {
      let dialogRecord;
      if (this.id === "create") {
        dialogRecord = JSON.parse(JSON.stringify(job_template.newJob));
        this.modalShow(dialogRecord, true);
      } else {
        dialogRecord = await axios.get(`${this.apiUrl}/${this.id}`);
        dialogRecord.data.body.schedules.forEach((elem) => (elem.id = nanoid()));
        this.modalShow(dialogRecord.data);
      }
    } catch (error) {
      EventBus.$emit("app-error", utils.parceApiError(error));
    }
  },
  props: ["id"],
  methods: {
    modalShow(jobRecord, isNew = false) {
      this.$set(this, "isNew", isNew);
      this.$set(this, "jobRecord", jobRecord);
    },
    modalClose: function () {
      try {
        this.activeTab = "general";
        this.$refs.stepList.clickedRow = null;
        this.$set(this, "jobRecord", {});
      } finally {
        this.$router.push("/jobs/");
      }
    },
    tabClick: function (tabName) {
      this.activeTab = tabName;
    },
    async save() {
      try {
        this.jobRecord.body.schedules.forEach((elem) => delete elem.id);
        const response = await axios.patch(
          `${config.apiUrl}/jobs/${this.jobRecord.id}`,
          this.jobRecord.body
        );
        if (response.status === 200) this.modalClose();
      } catch (error) {
        EventBus.$emit("app-error", utils.parceApiError(error));
      }
    },
    async create() {
      try {
        this.jobRecord.body.schedules.forEach((elem) => delete elem.id);
        const response = await axios.post(
          `${config.apiUrl}/jobs`,
          this.jobRecord.body
        );
        if (response.status === 201) this.modalClose();
      } catch (error) {
        EventBus.$emit("app-error", utils.parceApiError(error));
      }
    },
  },
  computed: {
    modalIsActive: function () {
      return this.jobRecord.body !== undefined;
    },
    job: function () {
      return this.jobRecord.body !== undefined ? this.jobRecord.body : {};
    },
    stepList: function () {
      return this.jobRecord.body.steps !== undefined ? this.job.steps : [];
    },
    scheduleList: function () {
      return this.jobRecord.body.schedules !== undefined ? this.job.schedules : [];
    },
    formIsValid() {
      return (
        this.generalTabIsValid &&
        this.stepListTabIsValid &&
        this.scheduleListTabIsValid
      );
    },
    generalTabIsValid() {
      return validate(this.jobRecord.body, constraints("en")) === undefined;
    },
    stepListTabIsValid() {
      return this.stepList.length > 0;
    },
    scheduleListTabIsValid() {
      return this.scheduleList.length > 0;
    },
  },
  components: {
    "job-general-tab": JobGeneralTab,
    "step-list-tab": StepList,
    "schedule-list-tab": ScheduleList,
  },
};
</script>
<style lang="scss">
#job-modal-content {
  width: 860px;
  height: 650px;
}
</style>
