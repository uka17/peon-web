const config = require("../config.json");
const testJobTemplate = JSON.parse(JSON.stringify(require("../test-data.json").job));

function createTemplateJob(browser) {
  browser  
    //create new job for all tests where job is needed
    .url(config.endpoint)
    .waitForElementVisible('a[href="#/jobs"]')
    .click('a[href="#/jobs"]')      
    .waitForElementVisible('a[href="#/jobs"]')
    .click('a[href="#/jobs"]')
    .waitForElementVisible('a[href="#/jobs/create"]')
    .click('a[href="#/jobs/create"]')
    .waitForElementVisible('#job-general')
    .setValue('#job-dialog-name', testJobTemplate.name)
    .setValue('#job-dialog-description', testJobTemplate.description)
    .click('a#steps-tab') 
    .click('button[qa-data="create-new-step"')
    .setValue('[qa-data="step-name"]', testJobTemplate.steps[0].name)
    .click('.CodeMirror-code')
    .keys(["script"]) 
    .click('button[qa-data="step-create"]')
    .click('button[qa-data="job-create"]')
    .end()
}

describe('Job list test set', function() {

  before(function(browser) {
    createTemplateJob(browser);
  });

  beforeEach(function(browser) {

  });

  this.tags = ['job-list', 'user-interface'];
  
  
  afterEach(function(browser) {
    //browser.end();
  });

  after(function(browser) {

  });  
});