const dayjs = require("dayjs")
const config = require("../config.json");
let testJobTemplate = JSON.parse(JSON.stringify(require("../data/jobs.json").job));
testJobTemplate.name += `f${(+new Date).toString(16)}`;
const createTestJob = require('../helpers').createTestJob;


describe('step-list', function() {

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

  this.tags = ['step', 'list', 'user-interface'];

  test.only(`step-list. 
    Step list controls have correct state before and after any step was added
    Create 3 steps
    Click 1st - Move step and delete controls has correct state and step
    Click last - Move step controls has correct state
    Click 2nd - Move step controls has correct state
    Check movement of first, last and middle steps (if steps were moved)
    Delete step works properly (step is deleted)
    `, function (browser) {
    //Step list controls have correct state before any step was added
    browser
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')      
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .setValue('#job-dialog-name', testJobTemplate.name)
      .setValue('#job-dialog-description', testJobTemplate.description)
      //schedules
      .click('a#schedules-tab') 
      .click('button[qa-data="create-new-schedule"')     
      .setValue('[qa-data="schedule-name"]', testJobTemplate.schedules[0].name)
      .setValue('div[qa-data="schedule-onetime"] input', dayjs(testJobTemplate.schedules[0].oneTime).format('YYYY-MM-DD HH:mm:ss'))      
      .click('[qa-data="schedule-name"]')
      .click('button[qa-data="schedule-create"]')   
      //starting work with steps      
      .click('a#steps-tab')
      //Check step initial layout
      .assert.elementPresent("#steps-tab span[class='icon has-text-danger']")
      .assert.visible('button[qa-data="create-new-step"')
      .assert.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')
      .assert.visible('table[qa-data="step-list"] .vuetable-empty-result')
      .assert.containsText('#step-list-empty-error', "Step list should contain at least 1 step")   
      .click('button[qa-data="create-new-step"')
      //Create step
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[0].name)
      .click('div[qa-data="step-dialog-connection"] input')
      .keys(["conn"]) 
      .click('div.dropdown-content a.dropdown-item')      
      .click('.CodeMirror-code')
      .keys([testJobTemplate.steps[0].command])
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-number"]', testJobTemplate.steps[0].retryAttempts.number)
      .setValue('input[qa-data="step-retry-interval"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-interval"]', testJobTemplate.steps[0].retryAttempts.interval)      
      .click(`div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[0].onSucceed}"]`)      
      .click(`div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[0].onFailure}"]`)            
      .click('button[qa-data="step-create"]')
      //Check if step appeared in table
      .assert.not.elementPresent('table[qa-data="step-list"].vuetable-empty-result')
      .assert.not.elementPresent('#step-list-empty-error')         
      .expect.elements('table[qa-data="step-list"] tbody tr').count.to.equal(1); 
      //Create 2 more steps
    browser
    //2nd
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[1].name)
      .click('div[qa-data="step-dialog-connection"] input')
      .keys(["conn"]) 
      .click('div.dropdown-content a.dropdown-item')      
      .click('.CodeMirror-code')
      .keys([testJobTemplate.steps[1].command])
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-number"]', testJobTemplate.steps[1].retryAttempts.number)
      .setValue('input[qa-data="step-retry-interval"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-interval"]', testJobTemplate.steps[1].retryAttempts.interval)      
      .click(`div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onSucceed}"]`)      
      .click(`div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onFailure}"]`)            
      .click('button[qa-data="step-create"]')
    //3rd
      .click('button[qa-data="create-new-step"')   
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[2].name)
      .click('div[qa-data="step-dialog-connection"] input')
      .keys(["conn"]) 
      .click('div.dropdown-content a.dropdown-item')      
      .click('.CodeMirror-code')
      .keys([testJobTemplate.steps[2].command])
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-number"]', testJobTemplate.steps[2].retryAttempts.number)
      .setValue('input[qa-data="step-retry-interval"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-interval"]', testJobTemplate.steps[2].retryAttempts.interval)      
      .click(`div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[2].onSucceed}"]`)      
      .click(`div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[2].onFailure}"]`)            
      .click('button[qa-data="step-create"]') 
    //Click 1st - Move step and delete controls has correct state and step
      .click(`span[qa-data="${testJobTemplate.steps[0].order}"]`)
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')
    //Click last - Move step and delete controls has correct state and step
      .click(`span[qa-data="${testJobTemplate.steps[2].order}"]`)
      .assert.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')
    //Click 2nd - Move step and delete controls has correct state and step
      .click(`span[qa-data="${testJobTemplate.steps[1].order}"]`)
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')        
    //Check (steps are being moved, controls changes their states) movement of second...
      .click(`span[qa-data="${testJobTemplate.steps[1].order}"]`)  
      .click('button[qa-data="move-down-selected-step"]')
      .assert.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')    
    //...last... 
      .click(`span[qa-data="${testJobTemplate.steps[2].order}"]`)  
      .click('button[qa-data="move-up-selected-step"]')
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')  
    //...first steps...
      .click(`span[qa-data="${testJobTemplate.steps[0].order}"]`)  
      .click('button[qa-data="move-down-selected-step"]')
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true') 
    //...move first to last and back to its position
      .click(`span[qa-data="${testJobTemplate.steps[0].order}"]`)  
      .click('button[qa-data="move-down-selected-step"]')
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')         
      .click('button[qa-data="move-down-selected-step"]')
      .assert.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')
      .click('button[qa-data="move-up-selected-step"]')
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')  
      .click('button[qa-data="move-up-selected-step"]')
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')                             
    //Delete step works properly (controls were changed, step is deleted)                      
      .click(`span[qa-data="${testJobTemplate.steps[1].order}"]`)  
      .assert.not.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.not.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')        
      .click('button[qa-data="delete-selected-step"]')
      .assert.attributeContains('button[qa-data="move-down-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="move-up-selected-step"]', 'disabled', 'true')
      .assert.attributeContains('button[qa-data="delete-selected-step"]', 'disabled', 'true')
      .click('button[qa-data="job-create"]')
    //Check if step was deleted
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .click('a#steps-tab')
      .expect.elements('table[qa-data="step-list"] tbody tr').count.to.equal(2); 

  });   
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});