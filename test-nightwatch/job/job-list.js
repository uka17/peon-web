const config = require("../config.json");
let testJob = JSON.parse(JSON.stringify(require("../test-data.json").job));


describe('Job test set', function() {

  before(function(browser) {

  });

  beforeEach(function(browser) {

  });

  this.tags = ['job-list', 'user-interface'];

  test('Creating job is being reflected in job list', function (browser) {
    testJob.name += `f${(+new Date).toString(16)}`;
    browser
      .url(config.endpoint)
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
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
      //create job
      .click('button[qa-data="step-create"]')
      .click('button[qa-data="job-create"]')
      //check if job is exists in job list
      .waitForElementVisible(`a[qa-data="${testJob.name}"]`)
      .end();
  });


  test.only('Closing Job modal with Close button or Cancel button after opening New modal reloads page to proper content', function (browser) {
    testJob.name += `f${(+new Date).toString(16)}`;
    browser
      .url(config.endpoint)
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .click('button[qa-data="modal-close"]')
      //check if Close reloads to proper state
      .assert.elementPresent('a[qa-data="job-list-create"]')
      .assert.elementPresent('div[qa-data="job-list-filter"]')
      .assert.elementPresent('table[qa-data="job-list-table"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      .assert.elementPresent('div[qa-data="job-list-pagination-info"]')
      .end();
  });  

  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});