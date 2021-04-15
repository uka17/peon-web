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
    browser
      .url(config.endpoint)
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')      
  });

  this.tags = ['job-list', 'user-interface'];

  test('All components of job list page are visible and has proper state and style', function (browser) {
    browser
      .assert.elementPresent('a[qa-data="job-list-create"]')
      .assert.elementPresent('div[qa-data="job-list-filter"]')
      .assert.elementPresent('a[qa-data="job-list-filter-do"]')
      .assert.elementPresent('input[qa-data="job-list-filter-text"]')
      .assert.elementPresent('a[qa-data="job-list-filter-reset"]')
      .assert.elementPresent('table[qa-data="job-list-table"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
  }); 
  test('Line click activates Delete controls and changes line style', function (browser) {
    browser
      .getAttribute('button[qa-data="job-list-delete-modal-show"]', 'disabled', function(result) {
        this.assert.equal(result.value, 'true');
      })  

      .click(`span[qa-data="${testJobTemplate.description}"]`)

      .assert.cssClassPresent('tr[item-index="0"]', 'is-selected')
      .getAttribute('button[qa-data="job-list-delete-modal-show"]', 'disabled', function(result) {
        this.assert.equal(result.value, null);
      });
  });     
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});