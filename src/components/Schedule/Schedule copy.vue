<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div id="schedule-modal-content" class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Schedule: {{schedule.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input v-model="schedule.name" qa-data="schedule-name" class="input" type="text" 
              v-bind:class="{ 'is-danger': fieldIsValid('name', schedule, constraints('en')[this.scheduleType]) !== '' }" 
              placeholder="Schedule name">
          </div>
        </div>  
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="schedule.enabled" id="schedule-dialog-enabled"> Enabled
            </label>
          </div>
        </div>         
        <p id="schedule-name-error" class="help is-danger">{{ fieldIsValid('name', schedule, constraints('en')[this.scheduleType]) }}</p>
        <div class="field">
          <label class="label">Schedule type*</label>
          <div class="control">
            <div class="select">
              <select v-model="scheduleType" id="schedule-dialog-type">
                <option value="onetime">One time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>     
        </div>
        <!-- Onetime --> 
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'onetime' }">
          <label class="label">Date and time*</label>
          <div class="control"> 
            <schedule-one-time v-model="oneTime"></schedule-one-time>
            <input type="hidden" v-model="oneTime" qa-data="schedule-onetime">
            <date-time-pick                 
                id="schedule-onetime"                
                v-model="oneTime" placeholder="Execution date and time"                
                :pickTime="true"
                :inputAttributes="{readonly: false, class: `input ${ fieldIsValid('oneTime', schedule, constraints('en')['onetime']) !== '' ? 'is-danger' : ''}`}"
                :format="config.dateTimeFormatSec"
                :isDateDisabled="dateIsInPast"
                >
            </date-time-pick>
            <date-picker v-model="oneTime" type="datetime"></date-picker>   
          </div>
          <p id="schedule-onetime-error" class="help is-danger">{{ fieldIsValid('oneTime', schedule, constraints('en')['onetime']) }}</p>
        </div>  
        <!-- Onetime END --> 
        <!-- Duration --> 
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType === 'onetime' }">
          <label class="label">Duration*</label>                 
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
                Start date
              </a>           
            </p>              
            <p class="control">
              <date-time-pick 
                id="schedule-duaration-start"
                v-model="startDateTime" placeholder="Valid from"                
                :inputAttributes="{readonly: true, class: `input ${ fieldIsValid('startDateTime', schedule, constraints('en')['startEndDateTime']) !== '' ? 'is-danger' : ''}`}"
                :pickTime="true"
                :format="config.dateTimeFormatSec"
                >
              </date-time-pick>                  
            </p>
            <p v-if="!endless" class="control">
              <a class="button is-static">
                End date
              </a>           
            </p>  
            <p v-if="!endless" class="control">              
              <date-time-pick 
                id="schedule-duaration-end"
                :inputAttributes="{readonly: true, class: `input ${ fieldIsValid('endDateTime', schedule, constraints('en')['startEndDateTime']) !== '' ? 'is-danger' : ''}`}"
                v-model="endDateTime" placeholder="Valid till"                
                :pickTime="true"
                :format="config.dateTimeFormatSec"
                >
              </date-time-pick>              
            </p>
          </div> 
          <p id="schedule-start-date-time-error" class="help is-danger">{{ fieldIsValid('startDateTime', schedule, constraints('en')['startEndDateTime']) }}</p>          
          <p v-if="!this.endless" id="schedule-end-date-time-error" class="help is-danger">{{ fieldIsValid('endDateTime', schedule, constraints('en')['startEndDateTime']) }}</p>
        </div>  
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType === 'onetime' }">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="endless"> Endless schedule duration
            </label>
          </div>
        </div>                              
        <!-- Duration END--> 
        <!-- Daily --> 
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'daily' }">
          <label class="label">Daily*</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
                Each
              </a>           
            </p>              
            <p class="control">
              <input id="schedule-eachnday"  type="text"                
                v-bind:class="{ 'is-danger': fieldIsValid('eachNDay', schedule, constraints('en')['daily']) !== '' }"
                maxlength="3" @keypress="isNumber($event)" v-model.number="schedule.eachNDay" class="input">
            </p>
            <p class="control">
              <a class="button is-static">
                days
              </a>           
            </p>  
          </div>
          <p id="schedule-eachnday-error" class="help is-danger">{{ fieldIsValid('eachNDay', schedule, constraints('en')['daily']) }}</p>
        </div>
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'weekly' }">
          <label class="label">Weekly*</label>
          <div class="columns">
            <div class="column is-narrow">
              <div class="field has-addons">
                <p class="control">
                  <a class="button is-static">
                    Each
                  </a>           
                </p>              
                <p class="control">
                  <input id="schedule-eachnweek"  type="text"                
                    v-bind:class="{ 'is-danger': fieldIsValid('eachNWeek', schedule, constraints('en')['weekly']) !== '' }"
                    maxlength="3" @keypress="isNumber($event)" v-model.number="schedule.eachNWeek" class="input">
                </p>
                <p class="control">
                  <a class="button is-static">
                    weeks
                  </a>           
                </p>  
              </div>
            </div>
            <div class="column">
              <div class="field"> 
                <div class="control">
                  <div class="buttons has-addons">                
                    <button v-for="(value, index) in reference.weekDayList" class="button"
                      v-bind:key="index" 
                      v-bind:id="value.toLowerCase()" 
                      v-bind:class="{ 'is-info': weekDyaIsToggled(index), 'is-danger is-outlined': fieldIsValid('dayOfWeek', schedule, constraints('en')['weekly']) !== '' }"
                      @click="toggleWeekDay(index)">
                        {{ value.substring(0, 3) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>            
          </div>                       
          <p id="schedule-eachnweek-error" class="help is-danger">{{ fieldIsValid('eachNWeek', schedule, constraints('en')['weekly']) }}</p>                           
          <p id="schedule-weekdays-error" class="help is-danger">{{ fieldIsValid('dayOfWeek', schedule, constraints('en')['weekly']) }}</p>
        </div>
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'monthly' }">
          <div class="field">
            <label class="label">Months*</label>
            <div class="control">
              <div class="buttons has-addons">                
                <button v-for="(value, index) in reference.monthList" class="button"
                  v-bind:key="index" 
                  v-bind:id="value.toLowerCase()"
                  v-bind:class="{ 'is-info': monthIsToggled(index), 'is-danger is-outlined': fieldIsValid('month', schedule, constraints('en')['monthly']) !== ''}" 
                  @click="toggleMonth(index)">
                    {{ value.substring(0, 3) }}
                </button>
              </div>
            </div>     
            <p id="schedule-months-error" class="help is-danger">{{ fieldIsValid('month', schedule, constraints('en')['monthly']) }}</p>
          </div>         
          <div class="field">
            <label class="label">Month days*</label>
            <div class="control">
              <input v-model="schedule.day" class="input" type="text" 
                v-bind:class="{ 'is-danger': fieldIsValid('day', schedule, constraints('en')['monthly']) !== '' }" 
                placeholder="Month days comma separated list (e.g. 1,13,29)">
            </div>
            <p id="schedule-monthdays-error" class="help is-danger">{{ fieldIsValid('day', schedule, constraints('en')['monthly']) }}</p>
          </div>            
        </div>
        <!-- Schedule types END--> 
        <!-- Daily frequency --> 
        <div v-bind:class="{ 'is-hidden': scheduleType === 'onetime' }">
          <label class="label">Daily frequency*</label>
          <div class="field">            
            <div class="control">
              <label class="radio">
                <input type="radio" name="once" v-bind:value="false" v-model="every">
                Once
              </label>
              <label class="radio">
                <input type="radio" name="every" v-bind:value="true" v-model="every">
                Periodicaly
              </label>
            </div>            
          </div>
          <div class="field" v-bind:class="{ 'is-hidden': every}">
            <label class="label">Time*</label>
            <div class="control">     
              <input id="schedule-occurs-once-at" maxlength="8" type="text"
              v-bind:class="{ 'is-danger': fieldIsValid('occursOnceAt', schedule.dailyFrequency, constraints('en')['occursOnceAt']) !== '' }"
              v-model="schedule.dailyFrequency.occursOnceAt" class="input">   
            </div>
            <p id="schedule-occursonceat-error" class="help is-danger">{{ fieldIsValid('occursOnceAt', schedule.dailyFrequency, constraints('en')['occursOnceAt']) }}</p>
          </div>   
          <div v-bind:class="{ 'is-hidden': !every}">
            <label class="label">Periodicity*</label>
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  Starting
                </a>           
              </p>              
              <p class="control">
                <input id="schedule-occurs-every-start" maxlength="8" type="text"
                  v-bind:class="{ 'is-danger': fieldIsValid('start', schedule.dailyFrequency, constraints('en')['every']) !== '' }"
                  v-model="schedule.dailyFrequency.start" class="input">
              </p>
              <p class="control">
                <a class="button is-static">
                  till
                </a>           
              </p>  
              <p class="control">              
                <input id="schedule-occurs-every-end" maxlength="8" type="text"
                  v-bind:class="{ 'is-danger': fieldIsValid('end', schedule.dailyFrequency, constraints('en')['every']) !== '' }"
                  v-model="schedule.dailyFrequency.end" class="input">
              </p>
              <p class="control">
                <a class="button is-static">
                  every
                </a>           
              </p>
              <p class="control">
                <input id="schedule-interval-value" maxlength="3" @keypress="isNumber($event)" type="text"
                  v-bind:class="{ 'is-danger': fieldIsValid('intervalValue', schedule.dailyFrequency.occursEvery, constraints('en')['intervalValue']) !== '' }" 
                  v-model.number="schedule.dailyFrequency.occursEvery.intervalValue" class="input">
              </p>                  
              <p class="control">
                <span class="select">
                  <select v-model="schedule.dailyFrequency.occursEvery.intervalType">
                    <option v-bind:value="`minute`">minute(s)</option>
                    <option v-bind:value="`hour`">hour(s)</option>
                  </select>
                </span>
              </p>                    
            </div>
            <p id="schedule-occurs-every-start-error" class="help is-danger">{{ fieldIsValid('start', schedule.dailyFrequency, constraints('en')['every']) }}</p>
            <p id="schedule-occurs-every-end-error" class="help is-danger">{{ fieldIsValid('end', schedule.dailyFrequency, constraints('en')['every']) }}</p>
            <p id="schedule-every-error" class="help is-danger">{{ fieldIsValid('intervalValue', schedule.dailyFrequency.occursEvery, constraints('en')['intervalValue']) }}</p>
          </div>  
        </div>        
        <!-- Daily frequency END-->                                          
      </section>      
      <footer class="modal-card-foot buttons is-right">
          <button v-if="!isNew" id="schedule-dialog-save" qa-data="schedule-save" class="button is-link" @click="save" v-bind:class="{ 'is-static': !formIsValid() }" title="Save schedule changes">Save changes</button>
          <button v-if="isNew"  id="schedule-dialog-create" qa-data="schedule-create" class="button is-success" @click="create" v-bind:class="{ 'is-static': !formIsValid() }" title="Create schedule">Create schedule</button>
          <button @click="modalClose" qa-data="schedule-cancel" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>

import validate from 'validate.js';
import constraints from './schedule-validation.js';
import scheduleTemplate from './schedule-template.js';
import utils from '../utils.js';
import config from '../config.js';
import weekMonthReference from './week-month-reference.js';
import DatePick from 'vue-date-pick';
import DatePicker from 'vue2-datepicker';
import 'vue-date-pick/dist/vueDatePick.css';
import 'vue2-datepicker/index.css';

import OneTime from './ScheduleOneTime'

import dayjs from 'dayjs';


export default {
  data() {
    return {
      modalIsActive: false,
      schedule: scheduleTemplate.newSchedule,
      isNew: undefined,
      scheduleType: 'onetime',
      endless: true,
      every: false,
      reference: weekMonthReference['en'],
      config: config,
      constraints
    }
  },
  methods: {
    modalShow(schedule, isNew = false) {
      this.$set(this, 'isNew', isNew);      
      //assign main properties
      let template = JSON.parse(JSON.stringify(scheduleTemplate.newSchedule));            
      this.$set(this, 'schedule', Object.assign(template, schedule));      
      //assign nested one
      let templateDailyFrequency = JSON.parse(JSON.stringify(scheduleTemplate.newSchedule.dailyFrequency));            
      this.$set(this.schedule, 'dailyFrequency', Object.assign(templateDailyFrequency, schedule.dailyFrequency));      
      this.$set(this, 'modalIsActive', true);

      if(isNew) {
        this.$set(this, 'scheduleType', 'onetime');
      } else {
        if(Object.prototype.hasOwnProperty.call(schedule, 'oneTime')) {
          this.$set(this, 'scheduleType', 'onetime');
        }      
        if(Object.prototype.hasOwnProperty.call(schedule, 'eachNDay')) {
          this.$set(this, 'scheduleType', 'daily');
        }      
        if(Object.prototype.hasOwnProperty.call(schedule, 'eachNWeek')) {
          this.$set(this, 'scheduleType', 'weekly');
        }      
        if(Object.prototype.hasOwnProperty.call(schedule, 'month')) {
          this.$set(this, 'scheduleType', 'monthly');
          this.$set(this.schedule, 'day', this.schedule.day.join(','));
        }      
        
        this.$set(this, 'endless', !Object.prototype.hasOwnProperty.call(schedule, 'endDateTime'));      

        if(Object.prototype.hasOwnProperty.call(schedule, 'dailyFrequency')) {
            this.$set(this, 'every', Object.prototype.hasOwnProperty.call(schedule.dailyFrequency, 'occursEvery'));
        }
      }
    },
    compileSchedule() {
      let result;

      switch (this.scheduleType) {
        case 'onetime':
          result = { oneTime: this.schedule.oneTime };
          break;

        case 'daily':
          result = { eachNDay: this.schedule.eachNDay }; 
          break;      

        case 'weekly':
          result = {
            eachNWeek: this.schedule.eachNWeek,
            dayOfWeek: this.schedule.dayOfWeek
          }
          break;           

        case 'monthly':
          result = {       
            month: this.schedule.month,
            day: utils.stringToNumberArray(this.schedule.day)
          }
          break;           

        default:
          break;
      }

      result.name = this.schedule.name;
      result.id = this.schedule.id;
      result.enabled = this.schedule.enabled;

      if(this.scheduleType !== 'onetime') {
        result.startDateTime = this.schedule.startDateTime;
        if(this.schedule.endDateTime !== '') {
          result.endDateTime = this.schedule.endDateTime;
        }
        
        result.dailyFrequency = {};
        if(this.every) {
          result.dailyFrequency.start = this.schedule.dailyFrequency.start;
          result.dailyFrequency.end = this.schedule.dailyFrequency.end;
          result.dailyFrequency.occursEvery = this.schedule.dailyFrequency.occursEvery;
        } else {
          result.dailyFrequency.occursOnceAt = this.schedule.dailyFrequency.occursOnceAt;
        }
        
      }

      return result;
    },
    save: function() {      
      this.$emit('schedule-modal-save', this.compileSchedule());       
      this.modalClose();
    },
    create() {
      this.$emit('schedule-modal-new', this.compileSchedule());       
      this.modalClose();
    },
    modalClose: function() {
      this.$set(this, 'modalIsActive', false);
    },
    isNumber: utils.isNumber,
    toggleWeekDay(weekDay) {
      let index = this.schedule.dayOfWeek.indexOf(weekDay);
      if(index > -1) {
        this.schedule.dayOfWeek.splice(index, 1);
      } else {
        this.schedule.dayOfWeek.push(weekDay);
      }
    },
    weekDyaIsToggled(weekDay) {
      if(this.schedule.dayOfWeek) {
        return this.schedule.dayOfWeek.indexOf(weekDay) > -1
      } else {
        return false;
      }
    },
    toggleMonth(month) {
      let index = this.schedule.month.indexOf(month);
      if(index > -1) {
        this.schedule.month.splice(index, 1);
      } else {
        this.schedule.month.push(month);
      }
    },
    monthIsToggled(month) {
      if(this.schedule.month) {
        return this.schedule.month.indexOf(month) > -1
      } else {
        return false;
      }
    },
    dateIsInPast(date) {
      const currentDate = dayjs().subtract(1, 'day').valueOf();
      return date < currentDate;
    },
    getDateTime(val) {
      let dateTime = Date.parse(val);
      return !isNaN(dateTime) ? dayjs(dateTime).format(config.dateTimeFormatSec) : '';
    },
    fieldIsValid(field, source, constraints) {
      const result = validate(source, constraints);
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
    },
    formIsValid() {
      let result = validate(this.schedule, constraints('en')[this.scheduleType]) === undefined; 
      if(this.scheduleType !== 'onetime') {
        if(this.every) {
          result = result && validate(this.schedule.dailyFrequency.occursEvery, constraints('en')['intervalValue']) === undefined; 
        } else {
          result = result && validate(this.schedule.dailyFrequency, constraints('en')['occursOnceAt']) === undefined; 
        }
        if(!this.endless) {
          result = result && validate(this.schedule, constraints('en')['startEndDateTime']) === undefined; 
        }
      }
      return result;
    }        
  },
  computed: {
    oneTime: {
      get: function() {
        return this.getDateTime(this.schedule.oneTime);
      },
      set: function(val) {
        this.schedule.oneTime = val === '' ? '' : dayjs(val).toISOString();
      }
    },
    startDateTime: {
      get: function() {
        return this.getDateTime(this.schedule.startDateTime);
      },
      set: function(val) {
        this.schedule.startDateTime = val === '' ? '' : dayjs(val).toISOString();
      }
    },
    endDateTime: {
      get: function() {
        return this.getDateTime(this.schedule.endDateTime);
      },
      set: function(val) {
        this.schedule.endDateTime = val === '' ? '' : dayjs(val).toISOString();
      }
    }        
  },
  components: {
    'date-time-pick': DatePick,
    'date-picker': DatePicker,
    'schedule-one-time': OneTime
  }
}
</script>

<style lang="scss" >
  #schedule-modal-content {
    width: 800px;
    height: 850px;    
  }
  [class*="is-info"] {
    border: 1px solid #fff !important 
  }
  #schedule-onetime, #schedule-duaration-start, #schedule-duaration-end {
    width: 190px !important 
  }
  #schedule-occurs-once-at, #schedule-occurs-every-start, #schedule-occurs-every-end {
    width: 95px
  }
  #schedule-interval-value, #schedule-eachnday, #schedule-eachnweek {
    width: 60px
  }
  .input {
    vertical-align: inherit !important
  }
  .vdpOuterWrap.vdpFloating {
    z-index: 1000;
  }
  input[class*="is-danger"]  {
    z-index: 999;
  }  
  #schedule-eachnday, #schedule-eachnweek, #schedule-interval-value {
    width: 50px;
    text-align: center;
  }
</style>