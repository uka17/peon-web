const config = require("../config.json");
const nanoid = require("nanoid");
const testJobTemplate = JSON.parse(JSON.stringify(require("../data/jobs.json").job));
const testConnections = JSON.parse(JSON.stringify(require("../data/connections.json")));
const createTestJob = require('../helpers').createTestJob;
const createTestConnection= require('../helpers').createTestConnection;


describe('step', function() {

  before(function(browser) {
    browser.url(config.endpoint);
    createTestJob(browser, testJobTemplate);
    createTestConnection(browser, testConnections[1]);
    createTestConnection(browser, testConnections[2]);
    browser.end();
  });

  beforeEach(function(browser) {
    browser
      .url(config.endpoint)
      .windowMaximize()
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]');      
  });

  this.tags = ['step', 'from', 'user-interface'];

  test.only(`step. 
    Step creation modal form controls have correct state before and after putting any data 
    Cancel controls works properly and doesn't create any step 
    Step creation acts properly: closes form and creates step with proper data
    Opening existing step shows proper modal window (correct data, correct control state) 
    Changing data and clicking Close doesn't changes step 
    `, function (browser) {
    browser
      .click(`a[qa-data="${testJobTemplate.name}"]`)
      .click('a#steps-tab'); 
    //Step creation modal form controls have correct state before and after putting any data 
    browser
      .click('button[qa-data="create-new-step"')
      .assert.cssClassPresent('input[qa-data="step-name"]', 'input is-danger')
      .assert.cssClassPresent('div[qa-data="step-dialog-connection"] div.field div', 'connection-warning')      
      .assert.containsText('#step-dialog-name-error', 'must be')
      .assert.containsText('#step-dialog-command-error', "not be empty")
      .assert.containsText('p#step-dialog-connection-error', 'valid connection')
      .assert.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
    //Add data and check once again
      .setValue('[qa-data="step-name"]', testJobTemplate.steps[0].name)
      .click('div[qa-data="step-dialog-connection"] input')
      .keys([testConnections[1].name.substring(0, 2)]) 
      .waitForElementVisible('div.dropdown-content a.dropdown-item')
      .click('div.dropdown-content a.dropdown-item')
      .click('.CodeMirror-code')
      .keys(["scriptooo"]) 
      .assert.not.cssClassPresent('input[qa-data="step-name"]', 'input is-danger')  
      .assert.not.containsText('#step-dialog-name-error', "must be")   
      .assert.not.containsText('#step-dialog-command-error', "must be")
      .assert.not.elementPresent('p#step-dialog-connection-error')
      .assert.not.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
      .assert.not.cssClassPresent('div[qa-data="step-dialog-connection"] div.field div', 'connection-warning')    
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
      .click('div[qa-data="step-dialog-connection"] input')
      .keys([testConnections[1].name.substring(0, 2)]) 
      .click('div.dropdown-content a.dropdown-item')      
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
    //Only choosing proper connection will activate save/new button    
      .assert.not.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
      .click('div[qa-data="step-dialog-connection"] input')
      .keys(['zzz']) 
      .assert.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
      .setValue('div[qa-data="step-dialog-connection"] input', ['\u0008', '\u0008', '\u0008'])  
      .keys([testConnections[1].name.substring(0, 2)])
      .assert.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
      .click('div.dropdown-content a.dropdown-item')
      .assert.not.cssClassPresent('button[qa-data="step-create"]', 'button is-success is-static')
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
      .assert.valueContains('div[qa-data="step-dialog-connection"] input', testConnections[1].name)    
    //Changing data and clicking Close or Cancel doesn't changes step (Close and Cancel uses one event))
      .setValue('input[qa-data="step-name"]', '-changed')  
      .setValue('input[qa-data="step-retry-interval"]', ['\u0008', '\u0008', '\u0008'])          
      .setValue('input[qa-data="step-retry-number"]', ['\u0008', '\u0008', '\u0008'])    
      .setValue('input[qa-data="step-retry-interval"]', 1)          
      .setValue('input[qa-data="step-retry-number"]', 1)    
      .clearValue('div[qa-data="step-dialog-connection"] input')
      .click('div[qa-data="step-dialog-connection"] input')
      //TODO - check reactivity in connection input
      //as clearValue do not triggers dropdown, we need to type 1 char to start drop down suggestion
      .keys('z') 
      .keys([testConnections[2].name.substring(0, 3)]) 
      .click('div.dropdown-content a.dropdown-item')      
      .click(`div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onFailure}"]`)      
      .click(`div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"] option[value="${testJobTemplate.steps[1].onSucceed}"]`)         
      .click('button[qa-data="step-modal-close')
      .click(`a[qa-data="${testJobTemplate.steps[1].name}"]`)
      .assert.valueContains('input[qa-data="step-name"]', testJobTemplate.steps[1].name)
      .assert.valueContains('input[qa-data="step-retry-number"]', testJobTemplate.steps[1].retryAttempts.number)
      .assert.valueContains('input[qa-data="step-retry-interval"]', testJobTemplate.steps[1].retryAttempts.interval)      
      .assert.valueContains('div[qa-data="step-result-action-succeed"] select[qa-data="step-result-action"]', testJobTemplate.steps[1].onSucceed)      
      .assert.valueContains('div[qa-data="step-result-action-failure"] select[qa-data="step-result-action"]', testJobTemplate.steps[1].onFailure)   
      .assert.valueContains('div[qa-data="step-dialog-connection"] input', testConnections[1].name);              
  });   
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});