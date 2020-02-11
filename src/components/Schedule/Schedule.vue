<template>
  <div class="modal" v-bind:class="{ 'is-active': modalIsActive }" v-on:keyup.esc="modalClose()">
    <div class="modal-background"></div>
    <div class="modal-card" id="schedule-modal-content">
      <header class="modal-card-head">
        <p class="modal-card-title">Schedule properties: {{schedule.name}}</p>
        <button class="delete" aria-label="close" @click="modalClose"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Name*</label>
              <div class="control">
                <input v-model="schedule.name" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }" placeholder="Schedule name">
              </div>
              <p id="schedule-name-error" class="help is-danger">{{ fieldIsValid('name') }}</p>
            </div>  
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Schedule type*</label>
              <div class="control">
                <div class="select">
                  <select v-model="scheduleType">
                    <option value="onetime">One time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>     
            </div>
          </div>            
        </div>  
        <!-- Onetime --> 
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'onetime' }">
          <label class="label">Date and time*</label>
          <div class="control">
            <input id="schedule-onetime" v-model="schedule.oneTime" class="input" type="text" v-bind:class="{ 'is-danger': fieldIsValid('oneTime') !== '' }" placeholder="Execution date and time">
          </div>
          <p id="schedule-onetime-error" class="help is-danger">{{ fieldIsValid('oneTime') }}</p>
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
              <input id="schedule-duaration-start" v-model="schedule.startDate" class="input" type="text">
            </p>
            <p v-if="!endless" class="control">
              <a class="button is-static">
                End date
              </a>           
            </p>  
            <p v-if="!endless" class="control">
              <input id="schedule-duaration-end" v-model="schedule.endDate" class="input" type="text">
            </p>
          </div> 
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
          <br>
          <label class="label">Daily*</label>
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
                Each
              </a>           
            </p>              
            <p class="control">
              <input id="schedule-eachndays" v-model="schedule.eachNDays" class="input" type="text">
            </p>
            <p class="control">
              <a class="button is-static">
                days
              </a>           
            </p>  
          </div>
        </div>
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'weekly' }">
          <br>
          <label class="label">Week day*</label>
          <div class="control">
            <div class="buttons has-addons">                
              <button v-for="(value, index) in reference.weekDayList" class="button"
                v-bind:key="index" 
                v-bind:class="{ 'is-info': weekDyaIsToggled(index) }" 
                @click="toggleWeekDay(index)">
                  {{ value.substring(0, 3) }}
              </button>
            </div>
          </div>
        </div>
        <div class="field" v-bind:class="{ 'is-hidden': scheduleType !== 'monthly' }">
          <br>
          <label class="label">Month*</label>
          <div class="control">
            <div class="buttons has-addons">                
              <button v-for="(value, index) in reference.monthList" class="button"
                v-bind:key="index" 
                v-bind:class="{ 'is-info': monthIsToggled(index) }" 
                @click="toggleMonth(index)">
                  {{ value.substring(0, 3) }}
              </button>
            </div>
          </div>
        </div>
        <!-- Schedule types END--> 
        <!-- Daily frequency --> 
        <div v-bind:class="{ 'is-hidden': scheduleType === 'onetime' }">
          <br>
          <label class="label">Daily frequency*</label>
          <div class="field">            
            <div class="control">
              <label class="radio">
                <input type="radio" name="once" v-bind:value="true" v-model="every">
                Once
              </label>
              <label class="radio">
                <input type="radio" name="every" v-bind:value="false" v-model="every">
                Periodicaly
              </label>
            </div>
          </div>
          <div class="field" v-bind:class="{ 'is-hidden': !every}">
            <label class="label">Time*</label>
            <div class="control">
              <input id="schedule-occursonce" v-model="schedule.occursOnceAt" class="input" type="text" placeholder="Execute at">
            </div>
          </div>   
          <div v-bind:class="{ 'is-hidden': every}">
            <label class="label">Periodicity*</label>
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  Every
                </a>           
              </p>
              <p class="control">
                <input id="schedule-interval-value" v-model="schedule.dailyFrequency.occursEvery.intervalValue" class="input" type="text">
              </p>                  
              <p class="control">
                <span class="select">
                  <select v-model="schedule.dailyFrequency.occursEvery.intervalType">
                    <option v-bind:value="`minute`">Minute(s)</option>
                    <option v-bind:value="`hour`">Hour(s)</option>
                  </select>
                </span>
              </p>
            </div>
          </div>  
        </div>        
        <!-- Daily frequency END-->                                          
      </section>      
      <footer class="modal-card-foot buttons is-right">
          <button v-if="!isNew" class="button is-link" @click="save" v-bind:class="{ 'is-static': !formIsValid }" title="Save schedule changes">Save changes</button>
          <button v-if="isNew" class="button is-success" @click="create" v-bind:class="{ 'is-static': !formIsValid }" title="Create schedule">Create schedule</button>
          <button @click="modalClose" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>

import validate from 'validate.js';
import constraints from './schedule-validation.js';
import scheduleTemplate from './schedule-template.js';
import utils from '../utils.js';
import weekMonthReference from './week-month-reference.js';


export default {
  data() {
    return {
      modalIsActive: false,
      schedule: scheduleTemplate.newSchedule,
      isNew: undefined,
      scheduleType: 'onetime',
      endless: true,
      every: false,
      reference: weekMonthReference['en']
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
        }      
        if(Object.prototype.hasOwnProperty.call(schedule, 'endDateTime')) {
          this.$set(this, 'endless', false);      
        }      
        if(Object.prototype.hasOwnProperty.call(schedule, 'dailyFrequency')) {
          if(Object.prototype.hasOwnProperty.call(schedule.dailyFrequency, 'occursEvery')) {
            this.$set(this, 'every', true);
          }      
        }
      }
    },
    save: function() {
      this.$emit('schedule-modal-save', this.schedule);       
      this.modalClose();
    },
    create() {
      this.$emit('schedule-modal-new', this.schedule);       
      this.modalClose();
    },
    modalClose: function() {
      this.$set(this, 'modalIsActive', false);
    },
    fieldIsValid(field) {
      const result = validate(this.schedule, constraints('en'));
      if(result && result.hasOwnProperty(field))
        return result[field][0];
      else
        return '';
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
    }    
  },
  computed: {
    formIsValid() {
      return (validate(this.schedule, constraints('en')) === undefined)
    }
  },
  components: {

  }
}
</script>

<style lang="scss" >
  #schedule-modal-content {
    width: 750px;
    height: 700px;    
  }
  [class*="is-info"] {
    border: 1px solid #fff !important 
  }
  #schedule-onetime, #schedule-duaration-start, #schedule-duaration-end {
    width: 165px !important 
  }
  #schedule-occursonce {
    width: 95px
  }
  #schedule-interval-value, #schedule-eachndays {
    width: 60px
  }
</style>