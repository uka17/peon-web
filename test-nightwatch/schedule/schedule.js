const dayjs = require("dayjs")
const config = require("../config.json");
const testJob = JSON.parse(JSON.stringify(require("../test-data.json").job));
testJob.name += `f${(+new Date).toString(16)}`;
const createTestJob = require('../helpers').createTestJob;


describe('schedule', function() {

  before(function(browser) {
    browser.url(config.endpoint);
    createTestJob(browser, testJob);
    browser.end();
  });

  beforeEach(function(browser) {
    browser
      .url(config.endpoint)
      .windowMaximize()
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')      
  });

  this.tags = ['schedule', 'form', 'user-interface'];

  test(`schedule. Onetime validation`, function (browser) {
    browser
      .click(`a[qa-data="${testJob.name}"]`)
      .click('a#schedules-tab')
      .click('button[qa-data="create-new-schedule"')
      //Check if warnings are in place
      .assert.cssClassPresent('input[qa-data="schedule-name"]', 'input is-danger')
      .assert.containsText('#schedule-name-error', 'must be')
      .assert.cssClassPresent('div[qa-data="schedule-onetime"]', 'custom-warning')
      .assert.containsText('#schedule-onetime-error', 'should not be empty')            
      .assert.cssClassPresent('button[qa-data="schedule-create"]', 'button is-success is-static')
      //Put values and check warnings behaviour 
      //Special value
      .setValue('input[qa-data="schedule-name"]', 'not.valid=name')
      .assert.containsText('#schedule-name-error', 'must be')
      //Correct value
      .clearValue('input[qa-data="schedule-name"]')
      .setValue('input[qa-data="schedule-name"]', testJob.schedules[0].name)
      .assert.not.containsText('#schedule-name-error', 'must be')
      .assert.not.cssClassPresent('input[qa-data="schedule-name"]', 'input is-danger')
      .setValue('div[qa-data="schedule-onetime"] input', dayjs(testJob.schedules[0].oneTime).format('YYYY-MM-DD HH:mm:ss'))
      //Date in past is disabled
      .assert.cssClassPresent(`table.mx-table td[title="${dayjs().add(-1, 'day').format('YYYY-MM-DD')}"]`, 'cell disabled')
      .assert.not.cssClassPresent(`table.mx-table td[title="${dayjs().format('YYYY-MM-DD')}"]`, 'cell disabled')
      .click('[qa-data="schedule-name"]')      
      .assert.not.cssClassPresent('div[qa-data="schedule-onetime"]', 'custom-warning')
      .assert.not.containsText('#schedule-onetime-error', 'should not be empty')   
      .assert.cssClassPresent('button[qa-data="schedule-create"]', 'button is-success')
      .click('button[qa-data="schedule-create"]')
  });   
  
  test(`schedule. Daily once and periodical validation. Endless and end schedule`, function (browser) {
    browser
      .click(`a[qa-data="${testJob.name}"]`)
      .click('a#schedules-tab')
      .click('button[qa-data="create-new-schedule"')
      //Choose schedule type
      .click(`select[qa-data="schedule-dialog-type"] option[value="daily"]`)           
      .click('input[qa-data="schedule-daily-once"]')
      //Check if warnings are in place
      //Name
      .assert.cssClassPresent('input[qa-data="schedule-name"]', 'input is-danger')
      .assert.containsText('#schedule-name-error', 'must be')    
      //Duration
      .assert.cssClassPresent('div[qa-data="schedule-dialog-start-date-time"]', 'custom-warning-inline')
      .assert.containsText('p[qa-data="schedule-start-date-time-error"', 'can not be empty')         
      //Daily
      .assert.cssClassPresent('input[qa-data="schedule-dialog-eachnday"]', 'input is-danger')
      .assert.containsText('p[qa-data="schedule-dialog-eachnday-error"', 'can not be empty')         
      //Once
      .assert.cssClassPresent('div[qa-data="schedule-daily-frequency-once"]', 'custom-warning')
      .assert.containsText('p[qa-data="schedule-daily-frequency-once-error"', 'can not be empty')
      //Create button
      .assert.cssClassPresent('button[qa-data="schedule-create"]', 'button is-success is-static')
      //Put values and check warnings behaviour 
      //Name
      .setValue('[qa-data="schedule-name"]', testJob.schedules[1].name)
      .assert.not.cssClassPresent('input[qa-data="schedule-name"]', 'input is-danger')
      .assert.not.containsText('#schedule-name-error', 'must be')    
      //Duration
      .setValue('div[qa-data="schedule-dialog-start-date-time"] input', dayjs(testJob.schedules[1].startDateTime).format('YYYY-MM-DD HH:mm:ss')) 
      .click('[qa-data="schedule-name"]')
      .assert.not.cssClassPresent('div[qa-data="schedule-dialog-start-date-time"]', 'custom-warning-inline')
      .assert.not.containsText('p[qa-data="schedule-start-date-time-error"', 'can not be empty')         
      //Daily
      .setValue('input[qa-data="schedule-dialog-eachnday"]', testJob.schedules[1].eachNDay) 
      .assert.not.cssClassPresent('input[qa-data="schedule-dialog-eachnday"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="schedule-dialog-eachnday-error"', 'can not be empty')         
      //Once
      .setValue('div[qa-data="schedule-daily-frequency-once"] input', testJob.schedules[1].dailyFrequency.occursOnceAt) 
      .click('[qa-data="schedule-name"]')
      .assert.not.cssClassPresent('div[qa-data="schedule-daily-frequency-once"]', 'custom-warning')
      .assert.not.containsText('p[qa-data="schedule-daily-frequency-once-error"', 'can not be empty')
      //Create schedule
      .assert.not.cssClassPresent('button[qa-data="schedule-create"]', 'button is-success is-static')     
      .click('button[qa-data="schedule-create"]')      
      //Save job
      .click('button[qa-data="job-save"]')   
      //Check if changes were applied
      .click(`a[qa-data="${testJob.name}"]`)
      .click('a#schedules-tab')
      .click(`a[qa-data="${testJob.schedules[1].name}"]`)
      //Check all entered values
      .assert.valueContains('input[qa-data="schedule-name"]', testJob.schedules[1].name)
      .assert.valueContains('div[qa-data="schedule-dialog-start-date-time"] input', dayjs(testJob.schedules[1].startDateTime).format('YYYY-MM-DD HH:mm:ss'))
      .assert.valueContains('input[qa-data="schedule-dialog-eachnday"]', testJob.schedules[1].eachNDay) 
      .assert.valueContains('div[qa-data="schedule-daily-frequency-once"] input', testJob.schedules[1].dailyFrequency.occursOnceAt) 
      //No warnings
      .assert.not.cssClassPresent('input[qa-data="schedule-name"]', 'input is-danger')
      .assert.not.containsText('#schedule-name-error', 'must be')    
      .assert.not.cssClassPresent('div[qa-data="schedule-dialog-start-date-time"]', 'custom-warning-inline')
      .assert.not.containsText('p[qa-data="schedule-start-date-time-error"', 'can not be empty')   
      .assert.not.cssClassPresent('input[qa-data="schedule-dialog-eachnday"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="schedule-dialog-eachnday-error"', 'can not be empty')     
      .assert.not.cssClassPresent('div[qa-data="schedule-daily-frequency-once"]', 'custom-warning')
      .assert.not.containsText('p[qa-data="schedule-daily-frequency-once-error"', 'can not be empty')          
      .assert.not.cssClassPresent('button[qa-data="schedule-save"]', 'button is-success is-static') 
      //Change to schedule with end
      .click('input[qa-data="schedule-dialog-endless"]')      
      //Warning appeared
      .assert.cssClassPresent('button[qa-data="schedule-save"]', 'button is-static')       
      .assert.cssClassPresent('div[qa-data="schedule-dialog-end-date-time"]', 'custom-warning-inline')
      .assert.containsText('p[qa-data="schedule-end-date-time-error"', 'can not be empty')
      .setValue('div[qa-data="schedule-dialog-end-date-time"] input', dayjs(testJob.schedules[1].endDateTime).format('YYYY-MM-DD HH:mm:ss')) 
      .click('[qa-data="schedule-name"]')
      //Warning removed
      .assert.not.cssClassPresent('div[qa-data="schedule-dialog-end-date-time"]', 'custom-warning-inline')
      .assert.not.containsText('p[qa-data="schedule-end-date-time-error"', 'can not be empty')      
      .assert.cssClassPresent('button[qa-data="schedule-save"]', 'button is-link') 
      .click('button[qa-data="schedule-save"]')
      .click(`a[qa-data="${testJob.schedules[1].name}"]`)
      //Change to daily periodical schedule 
      .click('input[qa-data="schedule-daily-periodical"]')
      .assert.cssClassPresent('div[qa-data="schedule-daily-frequency-start"]', 'custom-warning-inline')     
      .assert.containsText('p[qa-data="schedule-occurs-every-start-error"', 'can not be empty')      
      .assert.cssClassPresent('div[qa-data="schedule-daily-frequency-end"]', 'custom-warning-inline')           
      .assert.containsText('p[qa-data="schedule-occurs-every-end-error"', 'can not be empty')
      .assert.cssClassPresent('input[qa-data="schedule-daily-frequency-interval"]', 'input is-danger')
      .assert.containsText('p[qa-data="schedule-every-error"', 'can not be empty')
      .assert.cssClassPresent('button[qa-data="schedule-save"]', 'button is-static')
      //Put data for daily periodical
      .setValue('div[qa-data="schedule-daily-frequency-start"] input', testJob.schedules[2].dailyFrequency.start) 
      .click('[qa-data="schedule-name"]')
      .setValue('div[qa-data="schedule-daily-frequency-end"] input', testJob.schedules[2].dailyFrequency.end) 
      .click('[qa-data="schedule-name"]')
      .setValue('input[qa-data="schedule-daily-frequency-interval"]', testJob.schedules[2].dailyFrequency.occursEvery.intervalValue) 
      //Warning removed
      .assert.not.cssClassPresent('div[qa-data="schedule-daily-frequency-start"]', 'custom-warning-inline')     
      .assert.not.containsText('p[qa-data="schedule-occurs-every-start-error"', 'can not be empty')      
      .assert.not.cssClassPresent('div[qa-data="schedule-daily-frequency-end"]', 'custom-warning-inline')           
      .assert.not.containsText('p[qa-data="schedule-occurs-every-end-error"', 'can not be empty')
      .assert.not.cssClassPresent('input[qa-data="schedule-daily-frequency-interval"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="schedule-every-error"', 'can not be empty')     
      .assert.cssClassPresent('button[qa-data="schedule-save"]', 'button is-link') 
      //Save schedule
      .click('button[qa-data="schedule-save"]')
  });   

  test(`schedule. Duration limitations: startDate, endDate, recurrence starting and till`, function (browser) {

  });

  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});