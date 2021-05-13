const dayjs = require("dayjs");
const config = require("../config.json");
const testJobTemplate = JSON.parse(JSON.stringify(require("../test-data.json").job));
const createTestJob = require('../helpers').createTestJob;

const verifyJobDialogStaticUI = (browser) => {
  browser
    //tabs check
    .assert.elementPresent("li.is-active #general-tab")
    .assert.elementPresent("#steps-tab")
    .assert.elementPresent("#schedules-tab")
    .assert.elementPresent("#notifications-tab")
    //buttons check
    .assert.elementPresent("button[qa-data='job-modal-close']")
    .assert.elementPresent("button[qa-data='job-cancel']")
    .assert.cssClassPresent('#button-job-cancel', 'button')
    //text fields and controls check
    .assert.elementPresent("input[qa-data='job-dialog-name']")
    .assert.elementPresent('input[qa-data="job-dialog-enabled"]')
    .assert.elementPresent("textarea[qa-data='job-dialog-description']")
    //verify steps controls
    .click("#steps-tab")
    .assert.elementPresent("button[qa-data='move-up-selected-step']")
    .assert.elementPresent("button[qa-data='move-down-selected-step']")
    .assert.elementPresent("button[qa-data='delete-selected-step']")
    .assert.elementPresent("button[qa-data='create-new-step']")
    //verify schedule controls
    .click("#schedules-tab")
    .assert.elementPresent("button[qa-data='create-new-schedule']")
    .assert.elementPresent("button[qa-data='delete-selected-schedule']")
    .assert.elementPresent("table[qa-data='schedule-list']")
}

describe('job', function() {

  before(function(browser) {
    browser.url(config.endpoint);
    createTestJob(browser, testJobTemplate);
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

  this.tags = ['job', 'form', 'user-interface'];

  test('job. Click to New opens proper modal window', function (browser) {
    browser
      //open new job dialog
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .assert.containsText('#job-dialog-name-error', 'must')
      //tabs check
      .assert.elementPresent("li.is-active #general-tab")
      .assert.elementPresent("#general-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#steps-tab")
      .assert.elementPresent("#steps-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#schedules-tab")
      .assert.elementPresent("#schedules-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#notifications-tab")
      //buttons check
      .assert.elementPresent("button[qa-data='job-cancel']")
      .assert.elementPresent("button[qa-data='job-create']")
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')
      .assert.cssClassPresent('#button-job-cancel', 'button')
      //text fields and controls check
      .assert.cssClassPresent('#job-dialog-name', 'input is-danger')
      .assert.elementPresent("input[qa-data='job-dialog-enabled']")
  });

  test('job. Tab General, Steps and Schedules change control states based on entered values', function (browser) {
    browser      
      //open new job dialog
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      //check initial state (warnings are in place)
      .assert.elementPresent("#general-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#schedules-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#steps-tab span[class='icon has-text-danger']")
      .assert.elementPresent("button[qa-data='job-create']")
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')      
      .assert.containsText('#job-dialog-name-error', 'must')
      //after entering job name warnings will be cleared
      .setValue('#job-dialog-name', testJobTemplate.name)
      .assert.not.elementPresent("#general-tab span[class='icon has-text-danger']")
      .assert.not.valueContains('#job-dialog-name-error', "must be")
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')      
      //steps tab
      .click('a#steps-tab')
      //check initial state (warnings are in place)
      .assert.elementPresent("#steps-tab span[class='icon has-text-danger']")
      .assert.visible('button[qa-data="create-new-step"')
      .assert.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')
      .assert.visible('.vuetable-empty-result')      
      .click('button[qa-data="create-new-step"')
      //after creating step warning will be cleared
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[0].name)
      .assert.not.valueContains('#step-dialog-name-error', "must be")
      .click('.CodeMirror-code')
      .keys(["script"]) 
      .assert.not.valueContains('#step-dialog-command-error', "can not be")
      .click('button[qa-data="step-create"]')
      //steps warning was removed from tab
      .assert.not.elementPresent("#steps-tab span[class='icon has-text-danger']")
      //schedules tab
      .click('a#schedules-tab')
      //check initial state (warnings are in place)
      .assert.elementPresent("#schedules-tab span[class='icon has-text-danger']")
      .assert.visible('button[qa-data="create-new-schedule"')
      .assert.visible('table[qa-data="schedule-list"] .vuetable-empty-result')      
      .click('button[qa-data="create-new-schedule"')     
      .setValue('[qa-data="schedule-name"]', testJobTemplate.schedules[0].name)
      .setValue('div[qa-data="schedule-onetime"] input', dayjs(testJobTemplate.schedules[0].oneTime).format('YYYY-MM-DD HH:mm:ss'))      
      .click('[qa-data="schedule-name"]')
      .click('button[qa-data="schedule-create"]')       
      //schedules warning was removed from tab
      .assert.not.elementPresent("#schedules-tab span[class='icon has-text-danger']")
      //now job can be saved
      .assert.cssClassPresent('#button-job-create', 'button is-success')
  });


  test('job. Created job is being reflected in job list', function (browser) {
    let testJob = JSON.parse(JSON.stringify(testJobTemplate));
    testJob.name += `f${(+new Date).toString(16)}`;
    browser
      //open new job dialog
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      //enter values for general
      .setValue('#job-dialog-name', testJob.name)
      .assert.not.elementPresent("#general-tab span[class='icon has-text-danger']")
      .click('a#steps-tab')
      //enter values for step tab      
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJob.steps[0].name)
      .click('.CodeMirror-code')
      .keys(["script"]) 
      .click('button[qa-data="step-create"]')
      //enter values for schedule tab
      .click('a#schedules-tab') 
      .click('button[qa-data="create-new-schedule"')     
      .setValue('[qa-data="schedule-name"]', testJobTemplate.schedules[0].name)
      .setValue('div[qa-data="schedule-onetime"] input', dayjs(testJobTemplate.schedules[0].oneTime).format('YYYY-MM-DD HH:mm:ss'))      
      .click('[qa-data="schedule-name"]')
      .click('button[qa-data="schedule-create"]')      
      //create job
      .click('button[qa-data="job-create"]')
      //check if job is exists in job list
      .waitForElementVisible(`a[qa-data="${testJob.name}"]`)
  });  

  test('job. Closing Job modal with Close button or Cancel button after opening New modal reloads page to proper content', function (browser) {
    browser
      //open new job dialog      
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .click('button[qa-data="job-modal-close"]')
      //check if Close reloads to proper state
      .assert.elementPresent('a[qa-data="job-list-create"]')
      .assert.elementPresent('div[qa-data="job-list-filter"]')
      .assert.elementPresent('table[qa-data="job-list-table"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      .assert.elementPresent('div[qa-data="job-list-pagination-info"]')
      //check if Cancel reloads to proper state
      .click('a[href="#/jobs/create"]')
      .click('button[qa-data="job-cancel"]')
      .assert.elementPresent('a[qa-data="job-list-create"]')
      .assert.elementPresent('div[qa-data="job-list-filter"]')
      .assert.elementPresent('table[qa-data="job-list-table"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      .assert.elementPresent('div[qa-data="job-list-pagination-info"]')      
  });  

  test('job. Change in job attributes is being reflected in job list', function (browser) {
    let testJob = JSON.parse(JSON.stringify(testJobTemplate));
    testJob.name += `f${(+new Date).toString(16)}`;
    //create new job as Template one should stay untouched
    createTestJob(browser, testJob);
    browser
      .url(config.endpoint)
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      //check if job is exists in job list
      .waitForElementVisible(`a[qa-data="${testJob.name}"]`)
      //change job content 
      .click(`a[qa-data="${testJob.name}"]`)
      .waitForElementVisible('#job-general')
      .setValue('#job-dialog-name', '-changed')
      .setValue('#job-dialog-description', '-changed')      
      .click('input[qa-data="job-dialog-enabled"]')
      .click('button[qa-data="job-save"]')
      //check if changes are reflected in the list
      .waitForElementVisible(`a[qa-data="${testJob.name}-changed"]`)
      //check if changes are reflected in modal
      .click(`a[qa-data="${testJob.name}-changed"]`)
      .getValue('#job-dialog-name', function(result) {
        this.assert.equal(result.value, `${testJob.name}-changed`);
      })
      .getValue('#job-dialog-description', function(result) {
        this.assert.equal(result.value, `${testJob.description}-changed`);
      })
      .expect.element('input[qa-data="job-dialog-enabled"]').to.not.be.selected
  });

  test('job. Closing Job modal with close button, Save or Cancel button after opening job reloads page to proper content', function (browser) {
    browser
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .waitForElementVisible('#job-general')
      .click('button[qa-data="job-modal-close"]')
      //check if Close reloads to proper state
      .assert.elementPresent('a[qa-data="job-list-create"]')
      .assert.elementPresent('div[qa-data="job-list-filter"]')
      .assert.elementPresent('table[qa-data="job-list-table"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      .assert.elementPresent('div[qa-data="job-list-pagination-info"]')
      //check if Cancel reloads to proper state
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .click('button[qa-data="job-cancel"]')
      .assert.elementPresent('a[qa-data="job-list-create"]')
      .assert.elementPresent('div[qa-data="job-list-filter"]')
      .assert.elementPresent('table[qa-data="job-list-table"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      .assert.elementPresent('div[qa-data="job-list-pagination-info"]')      
  });  


  test('job. Open existing job, putting content inside and click Cancel or Close - job was not changed', function (browser) {
    browser
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .waitForElementVisible('#job-general')      
      //change values
      .setValue('#job-dialog-name', '-changed')
      .setValue('#job-dialog-description', '-changed')
      //steps
      .click('a#steps-tab') 
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[0].name)
      .click('.CodeMirror-code')
      .keys(["script"]) 
      .click('button[qa-data="step-create"]')      
      //schedules
      .click('a#schedules-tab') 
      .click('button[qa-data="create-new-schedule"')     
      .setValue('[qa-data="schedule-name"]', testJobTemplate.schedules[0].name)
      .setValue('div[qa-data="schedule-onetime"] input', dayjs(testJobTemplate.schedules[0].oneTime).format('YYYY-MM-DD HH:mm:ss'))      
      .click('[qa-data="schedule-name"]')
      .click('button[qa-data="schedule-create"]')             
      //click Cancel    
      .click('button[qa-data="job-cancel"]')
      //check if job was not changed
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .getValue('#job-dialog-name', function(result) {
        this.assert.equal(result.value, testJobTemplate.name);
      })
      .getValue('#job-dialog-description', function(result) {
        this.assert.equal(result.value, testJobTemplate.description);
      })
      .click('a#steps-tab')
      //tables has 1 row
      .expect.elements('table[qa-data="step-list"] tbody tr').count.to.equal(1);
    browser
      .expect.elements('table[qa-data="schedule-list"] tbody tr').count.to.equal(1);
  });  

  test('job. Job click opens proper modal window', function (browser) {
    browser
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .waitForElementVisible('#job-general')
      .assert.cssClassPresent('#button-job-save', 'button is-link');
    verifyJobDialogStaticUI(browser);    

  });  

  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});