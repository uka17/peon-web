const dayjs = require("dayjs")
const config = require('../src/components/config.js');

function formatDateTime(val) {
  let dateTime = Date.parse(val);
  return !isNaN(dateTime) ? dayjs(dateTime).format(config.dateTimeFormatSec) : '';
}

module.exports = {
  '@disabled': true,
  createTestJob: function createTestJob(browser, testJob) {
    browser  
      //create new job for all tests where job is needed
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')      
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      //fill in job general
      .waitForElementVisible('#job-general')
      .setValue('#job-dialog-name', testJob.name)
      .setValue('#job-dialog-description', testJob.description)
      //add step
      .click('a#steps-tab') 
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJob.steps[0].name)
      .click('.CodeMirror-code')
      .keys(["script"]) 
      .click('button[qa-data="step-create"]')
      //add schedule
      .click('a#schedules-tab') 
      .click('button[qa-data="create-new-schedule"')
      .setValue('[qa-data="schedule-name"]', testJob.schedules[0].name)
      .setValue('div#schedule-onetime input', formatDateTime(testJob.schedules[0].oneTime))      
      //.click('button[qa-data="schedule-create"]')
      .pause()
      //save job
      .click('button[qa-data="job-create"]')
    }
}