const config = require("../config.json");
const testJobTemplate = JSON.parse(JSON.stringify(require("../test-data.json").job));
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

  this.tags = ['step-list', 'user-interface'];

  test.only(`step-list. 
    Step list controls have correct state before any step was added     
    Step creation modal form controls have correct state before and after putting any data 
    Cancel controls works properly and doesn't create any step 
    Step creation acts properly: closes form and creates step with proper data
    Opening existing step shows proper modal window (correct data, correct control state) 
    Changing data and clicking Close doesn't changes step 
    `, function (browser) {
    //Step list controls have correct state before any step was added
    browser
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .click('a#steps-tab') 
      .assert.elementPresent('button[qa-data="move-up-selected-step"]')
      .assert.elementPresent('button[qa-data="move-down-selected-step"]')
      .assert.elementPresent('button[qa-data="create-new-step"]')
      .assert.elementPresent('button[qa-data="delete-selected-step"]')
      .assert.elementPresent('button[qa-data="delete-selected-step"]')
      .expect.elements('table[qa-data="step-list"] tbody tr').count.to.equal(1);
    //Step creation modal form controls have correct state before and after putting any data 
    browser
      .click('button[qa-data="create-new-step"')
      .assert.cssClassPresent('input[qa-data="step-name"]', 'input is-danger')  
      .assert.containsText('#step-dialog-name-error', 'must be')
      .assert.containsText('#step-dialog-command-error', "not be empty")
      .assert.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
    //Add data and check once again
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[0].name)
      .click('.CodeMirror-code')
      .keys(["script"]) 
      .assert.not.cssClassPresent('input[qa-data="step-name"]', 'input is-danger')  
      .assert.not.containsText('#step-dialog-name-error', "must be")   
      .assert.not.containsText('#step-dialog-command-error', "must be")
      .assert.not.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
    //Check Name for proper input
      .setValue('[qa-data="step-name"]', "=")
      .assert.cssClassPresent('input[qa-data="step-name"]', 'input is-danger')  
      .assert.containsText('#step-dialog-name-error', 'must be')
      .assert.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
    //Cancel controls works properly and doesn't create any step
      .click('button[qa-data="step-cancel"]')
      .expect.elements('table[qa-data="step-list"] tbody tr').count.to.equal(1);
    browser
    //Step creation acts properly: closes form and creates step with proper data
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[1].name)
      .click('.CodeMirror-code')
      .keys([testJobTemplate.steps[1].command])
    //Validation              
    //Here and further browser.clearValue doesn't work properly, thus using this trick
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .assert.containsText('#step-dialog-retry-number-error', 'must be greater')
      .setValue('input[qa-data="step-retry-number"]', testJobTemplate.steps[1].retryAttempts.number)
    //Interval not visible if attempts is zero
      .assert.elementPresent('a[qa-data="per-each-label"]')
      .assert.elementPresent('p[qa-data="minutes-label"]')
      .assert.elementPresent('input[qa-data="step-retry-interval"]')
      .assert.not.elementPresent('a[qa-data="retries-label"]')
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-number"]', 0)      
      .assert.not.elementPresent('a[qa-data="per-each-label"]')
      .assert.not.elementPresent('p[qa-data="minutes-label"]')
      .assert.not.elementPresent('input[qa-data="step-retry-interval"]')
      .assert.elementPresent('a[qa-data="retries-label"]')
      .assert.not.elementPresent('input[qa-data="step-retry-interval"]')      
    //"Per each = 12" test
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-number"]', 12)
      .assert.containsText('#step-dialog-retry-number-error', 'to zero and less than 11')            
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="step-retry-number"]', testJobTemplate.steps[1].retryAttempts.number) 
    //Validation
      .setValue('input[qa-data="step-retry-interval"]', ['\u0008', '\u0008', '\u0008'])      
      .assert.containsText('#step-dialog-retry-interval-error', 'attempt interval must be greater than 0')    
    //Put value back      
      .setValue('input[qa-data="step-retry-interval"]', testJobTemplate.steps[1].retryAttempts.interval)      
    //Next controls
      .click(`div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onSucceed}"]`)      
      .click(`div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onFailure}"]`)      
      .click('button[qa-data="step-create"]')
      .assert.elementPresent(`a[qa-data="${testJobTemplate.steps[1].name}"]`)
      .expect.elements('table[qa-data="step-list"] tbody tr').count.to.equal(2);   
    //Opening existing step shows proper modal window (correct data, correct control state)    
    browser
      .click(`a[qa-data="${testJobTemplate.steps[1].name}"]`)
      .assert.valueContains('input[qa-data="step-name"]', testJobTemplate.steps[1].name)
      .assert.valueContains('input[qa-data="step-retry-number"]', testJobTemplate.steps[1].retryAttempts.number)
      .assert.valueContains('input[qa-data="step-retry-interval"]', testJobTemplate.steps[1].retryAttempts.interval)      
      .assert.valueContains('div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"]', testJobTemplate.steps[1].onSucceed)      
      .assert.valueContains('div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"]', testJobTemplate.steps[1].onFailure)          
    //Changing data and clicking Close or Cancel doesn't changes step (Close and Cancel uses one event))
      .setValue('input[qa-data="step-name"]', '-changed')  
      .setValue('input[qa-data="step-retry-interval"]', ['\u0008', '\u0008', '\u0008'])          
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])    
      .setValue('input[qa-data="step-retry-interval"]', 1)          
      .setValue('input[qa-data="step-retry-number"]', 1)    
      .click(`div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onFailure}"]`)      
      .click(`div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onSucceed}"]`)         
      .click('button[qa-data="step-modal-close')
      .click(`a[qa-data="${testJobTemplate.steps[1].name}"]`)
      .assert.valueContains('input[qa-data="step-name"]', testJobTemplate.steps[1].name)
      .assert.valueContains('input[qa-data="step-retry-number"]', testJobTemplate.steps[1].retryAttempts.number)
      .assert.valueContains('input[qa-data="step-retry-interval"]', testJobTemplate.steps[1].retryAttempts.interval)      
      .assert.valueContains('div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"]', testJobTemplate.steps[1].onSucceed)      
      .assert.valueContains('div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"]', testJobTemplate.steps[1].onFailure)       
  });   
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});