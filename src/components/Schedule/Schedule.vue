<template>
  <div
    class="modal"
    v-bind:class="{ 'is-active': modalIsActive }"
    v-on:keyup.esc="modalClose()"
  >
    <div class="modal-background"></div>
    <div id="schedule-modal-content" class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Schedule: {{ schedule.name }}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input
              v-model="schedule.name"
              qa-data="schedule-name"
              class="input"
              type="text"
              v-bind:class="{
                'is-danger':
                  fieldIsValid(
                    'name',
                    schedule,
                    constraints('en')[this.scheduleType]
                  ) !== '',
              }"
              placeholder="Schedule name"
            />
          </div>
          <p
            id="schedule-name-error"
            qa-data="schedule-name-error"
            class="help is-danger"
          >
            {{
              fieldIsValid(
                "name",
                schedule,
                constraints("en")[this.scheduleType]
              )
            }}
          </p>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                qa-data="schedule-enabled"
                v-model="schedule.enabled"
                id="schedule-dialog-enabled"
              />
              Enabled
            </label>
          </div>
        </div>
        <div class="field">
          <label class="label">Schedule type*</label>
          <div class="control">
            <div class="select">
              <select
                v-model="scheduleType"
                id="schedule-dialog-type"
                qa-data="schedule-dialog-type"
              >
                <option value="onetime">One time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
        <!-- Onetime -->
        <div
          class="field"
          v-bind:class="{ 'is-hidden': scheduleType !== 'onetime' }"
        >
          <schedule-one-time
            v-on:schedule-one-time-update="scheduleOneTimeUpdate($event.value)"
            v-bind:one-time="schedule.oneTime"
          >
          </schedule-one-time>
        </div>
        <!-- Onetime END -->
        <!-- Duration -->
        <div
          class="field"
          v-bind:class="{ 'is-hidden': scheduleType === 'onetime' }"
        >
          <schedule-duration
            v-on:schedule-duration-start-update="
              scheduleDurationStartUpdate($event.value)
            "
            v-on:schedule-duration-end-update="
              scheduleDurationEndUpdate($event.value)
            "
            v-on:schedule-endless-update="scheduleEndlessUpdate($event.value)"
            v-bind:start-date-time="schedule.startDateTime"
            v-bind:end-date-time="schedule.endDateTime"
            v-bind:endless="endless"
          >
          </schedule-duration>
        </div>
        <!-- Duration END-->
        <!-- Daily -->
        <div
          class="field"
          v-bind:class="{ 'is-hidden': scheduleType !== 'daily' }"
        >
          <schedule-daily
            v-bind:each-n-day="this.schedule.eachNDay"
            v-on:schedule-each-n-day-update="
              scheduleEachNDayUpdate($event.value)
            "
          >
          </schedule-daily>
        </div>
        <!-- Daily END-->
        <!-- Weekly -->
        <div
          class="field"
          v-bind:class="{ 'is-hidden': scheduleType !== 'weekly' }"
        >
          <schedule-weekly
            v-bind:each-n-week="schedule.eachNWeek"
            v-bind:day-of-week="schedule.dayOfWeek"
            v-on:schedule-each-n-week-update="
              scheduleEachNWeekUpdate($event.value)
            "
            v-on:schedule-day-of-week-update="
              scheduleDayOfWeekUpdate($event.value)
            "
          >
          </schedule-weekly>
        </div>
        <!-- Weekly END -->
        <!-- Monthly -->
        <div
          class="field"
          v-bind:class="{ 'is-hidden': scheduleType !== 'monthly' }"
        >
          <schedule-monthly
            v-bind:day="schedule.day"
            v-bind:month="schedule.month"
            v-on:schedule-month-update="scheduleMonthUpdate($event.value)"
            v-on:schedule-month-day-update="
              scheduleMonthDayUpdate($event.value)
            "
          >
          </schedule-monthly>
        </div>
        <!-- Monthly END-->
        <!-- Daily frequency -->
        <div v-bind:class="{ 'is-hidden': scheduleType === 'onetime' }">
          <schedule-daily-frequency
            v-bind:daily-frequency="schedule.dailyFrequency"
            v-bind:every="every"
            v-on:schedule-daily-frequency-update="
              scheduleDailyFrequencyUpdate($event.value)
            "
            v-on:schedule-daily-frequency-every-update="
              scheduleDailyFrequencyEveryUpdate($event.value)
            "
          >
          </schedule-daily-frequency>
        </div>
        <!-- Daily frequency END-->
      </section>
      <footer class="modal-card-foot buttons is-right">
        <button
          v-if="!isNew"
          id="schedule-dialog-save"
          qa-data="schedule-save"
          class="button is-link"
          @click="save"
          v-bind:class="{ 'is-static': !formIsValid() }"
          title="Save schedule changes"
        >
          Save changes
        </button>
        <button
          v-if="isNew"
          id="schedule-dialog-create"
          qa-data="schedule-create"
          class="button is-success"
          @click="create"
          v-bind:class="{ 'is-static': !formIsValid() }"
          title="Create schedule"
        >
          Create schedule
        </button>
        <button @click="modalClose" qa-data="schedule-cancel" class="button">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import validate from "validate.js";
import constraints from "./schedule-validation.js";
import scheduleTemplate from "./schedule-template.js";
import utils from "../utils.js";
import config from "../config.js";
import { fieldIsValid } from "../common/common-helpers.js";

import ScheduleOneTime from "./ScheduleOneTime.vue";
import ScheduleDuration from "./ScheduleDuration.vue";
import ScheduleDaily from "./ScheduleDaily.vue";
import ScheduleWeekly from "./ScheduleWeekly.vue";
import ScheduleDailyFrequency from "./ScheduleDailyFrequency.vue";
import ScheduleMonthly from "./ScheduleMonthly.vue";

import dayjs from "dayjs";

export default {
  data() {
    return {
      modalIsActive: false,
      schedule: scheduleTemplate.newSchedule,
      isNew: undefined,
      scheduleType: "onetime",
      endless: true,
      every: true,
      config: config,
      constraints,
      fieldIsValid,
    };
  },
  methods: {
    modalShow(schedule, isNew = false) {
      this.$set(this, "isNew", isNew);
      //assign main properties
      let template = JSON.parse(JSON.stringify(scheduleTemplate.newSchedule));
      this.$set(this, "schedule", Object.assign(template, schedule));
      //assign nested one
      let templateDailyFrequency = JSON.parse(
        JSON.stringify(scheduleTemplate.newSchedule.dailyFrequency)
      );
      this.$set(
        this.schedule,
        "dailyFrequency",
        Object.assign(templateDailyFrequency, schedule.dailyFrequency)
      );
      this.$set(this, "modalIsActive", true);

      if (isNew) {
        this.$set(this, "scheduleType", "onetime");
      } else {
        if (Object.prototype.hasOwnProperty.call(schedule, "oneTime")) {
          this.$set(this, "scheduleType", "onetime");
        }
        if (Object.prototype.hasOwnProperty.call(schedule, "eachNDay")) {
          this.$set(this, "scheduleType", "daily");
        }
        if (Object.prototype.hasOwnProperty.call(schedule, "eachNWeek")) {
          this.$set(this, "scheduleType", "weekly");
        }
        if (Object.prototype.hasOwnProperty.call(schedule, "month")) {
          this.$set(this, "scheduleType", "monthly");
          this.$set(this.schedule, "day", this.schedule.day.join(","));
        }

        this.$set(
          this,
          "endless",
          !Object.prototype.hasOwnProperty.call(schedule, "endDateTime")
        );

        if (Object.prototype.hasOwnProperty.call(schedule, "dailyFrequency")) {
          this.$set(
            this,
            "every",
            Object.prototype.hasOwnProperty.call(
              schedule.dailyFrequency,
              "occursEvery"
            )
          );
        }
      }
    },
    compileSchedule() {
      let result;

      switch (this.scheduleType) {
        case "onetime":
          result = { oneTime: this.schedule.oneTime };
          break;

        case "daily":
          result = { eachNDay: this.schedule.eachNDay };
          break;

        case "weekly":
          result = {
            eachNWeek: this.schedule.eachNWeek,
            dayOfWeek: this.schedule.dayOfWeek,
          };
          break;

        case "monthly":
          result = {
            month: this.schedule.month,
            day: utils.stringToNumberArray(this.schedule.day),
          };
          break;

        default:
          break;
      }

      result.name = this.schedule.name;
      result.id = this.schedule.id;
      result.enabled = this.schedule.enabled;

      if (this.scheduleType !== "onetime") {
        result.startDateTime = this.schedule.startDateTime;
        if (this.schedule.endDateTime !== "") {
          result.endDateTime = this.schedule.endDateTime;
        }

        result.dailyFrequency = {};
        if (this.every) {
          result.dailyFrequency.start = this.schedule.dailyFrequency.start;
          result.dailyFrequency.end = this.schedule.dailyFrequency.end;
          result.dailyFrequency.occursEvery =
            this.schedule.dailyFrequency.occursEvery;
        } else {
          result.dailyFrequency.occursOnceAt =
            this.schedule.dailyFrequency.occursOnceAt;
        }
      }

      return result;
    },
    save: function () {
      this.$emit("schedule-modal-save", this.compileSchedule());
      this.modalClose();
    },
    create() {
      this.$emit("schedule-modal-new", this.compileSchedule());
      this.modalClose();
    },
    modalClose: function () {
      this.$set(this, "modalIsActive", false);
    },
    formIsValid() {
      let result =
        validate(this.schedule, constraints("en")[this.scheduleType]) ===
        undefined;
      if (this.scheduleType !== "onetime") {
        if (this.every) {
          result =
            result &&
            validate(
              this.schedule.dailyFrequency.occursEvery,
              constraints("en")["intervalValue"]
            ) === undefined &&
            validate(
              this.schedule.dailyFrequency,
              constraints("en")["every"]
            ) === undefined;
        } else {
          result =
            result &&
            validate(
              this.schedule.dailyFrequency,
              constraints("en")["occursOnceAt"]
            ) === undefined;
        }
        if (!this.endless) {
          result =
            result &&
            validate(this.schedule, constraints("en")["startEndDateTime"]) ===
              undefined;
        }
      }
      return result;
    },
    scheduleOneTimeUpdate(value) {
      this.schedule.oneTime = dayjs(value).isValid()
        ? dayjs(value).toISOString()
        : "";
    },
    scheduleDurationStartUpdate(value) {
      this.schedule.startDateTime = dayjs(value).isValid()
        ? dayjs(value).toISOString()
        : "";
    },
    scheduleDurationEndUpdate(value) {
      this.schedule.endDateTime = dayjs(value).isValid()
        ? dayjs(value).toISOString()
        : "";
    },
    scheduleEndlessUpdate(value) {
      this.endless = value;
    },
    scheduleEachNDayUpdate(value) {
      this.schedule.eachNDay = value;
    },
    scheduleEachNWeekUpdate(value) {
      this.schedule.eachNWeek = value;
    },
    scheduleDayOfWeekUpdate(value) {
      this.schedule.dayOfWeek = value;
    },
    scheduleDailyFrequencyUpdate(value) {
      this.schedule.dailyFrequency = value;
    },
    scheduleMonthUpdate(value) {
      this.schedule.month = value;
    },
    scheduleMonthDayUpdate(value) {
      this.schedule.day = value;
    },
    scheduleDailyFrequencyEveryUpdate(value) {
      this.every = value;
    },
  },
  computed: {},
  components: {
    "schedule-one-time": ScheduleOneTime,
    "schedule-duration": ScheduleDuration,
    "schedule-daily": ScheduleDaily,
    "schedule-weekly": ScheduleWeekly,
    "schedule-daily-frequency": ScheduleDailyFrequency,
    "schedule-monthly": ScheduleMonthly,
  },
};
</script>

<style lang="scss">
#schedule-modal-content {
  width: 800px;
  height: 850px;
}
[class*="is-info"] {
  border: 1px solid #fff !important;
}
#schedule-onetime,
#schedule-duaration-start,
#schedule-duaration-end {
  width: 190px !important;
}
#schedule-occurs-once-at,
#schedule-occurs-every-start,
#schedule-occurs-every-end {
  width: 95px;
}
#schedule-interval-value,
#schedule-eachnday,
#schedule-eachnweek {
  width: 60px;
}
.input {
  vertical-align: inherit !important;
}
.vdpOuterWrap.vdpFloating {
  z-index: 1000;
}
input[class*="is-danger"] {
  z-index: 999;
}
#schedule-eachnday,
#schedule-eachnweek,
#schedule-interval-value {
  width: 50px;
  text-align: center;
}
</style>
