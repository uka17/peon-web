const config = require(".././config.json");
let testJob = JSON.parse(JSON.stringify(require(".././test-data.json").job));

//module.exports = {

describe('Job test set', function() {

  before(function(browser) {

  });

  beforeEach(function(browser) {

  });

  this.tags = ['job', 'user-interface'];

  test('Click to New opens proper modal window', function (browser) {
    browser
      .url(config.endpoint)
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .assert.containsText('#job-dialog-name-error', 'must')
      //tabs
      .assert.elementPresent("li.is-active #general-tab")
      .assert.elementPresent("#general-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#steps-tab")
      .assert.elementPresent("#steps-tab span[class='icon has-text-danger']")
      .assert.elementPresent("#schedules-tab")
      .assert.elementPresent("#notifications-tab")
      //buttons
      .assert.elementPresent("button[qa-data='job-creation-cancel']")
      .assert.elementPresent("button[qa-data='job-create']")
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')
      .assert.cssClassPresent('#button-job-cancel', 'button')
      .assert.cssClassPresent('#button-job-create', 'button is-success')
      //text fields and controls
      .assert.cssClassPresent('#job-dialog-name', 'input is-danger')
      .assert.elementPresent("input[qa-data='job-enabled']")
  });

  test.only('Tab General and Steps change control states based on entered values', function (browser) {
    testJob.name += `f${(+new Date).toString(16)}`;
    browser
      .url(config.endpoint)
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      //check initial state (warnings are in place)
      .assert.elementPresent("#general-tab span[class='icon has-text-danger']")
      .assert.elementPresent("button[qa-data='job-create']")
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')      
      .assert.containsText('#job-dialog-name-error', 'must')
      //after entering job name warnings will be cleared
      .setValue('#job-dialog-name', testJob.name)
      .assert.not.elementPresent("#general-tab span[class='icon has-text-danger']")
      .assert.not.valueContains('#job-dialog-name-error', "must be")
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')      
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
      .setValue('[qa-data="step-name"]', testJob.steps[0].name)
      .assert.not.valueContains('#step-dialog-name-error', "must be")
      .click('.CodeMirror-code')
      .keys(['t', 'e', 's', 't']) 
      .assert.not.valueContains('#step-dialog-command-error', "can not be")
      .click('button[qa-data="step-create"]')
      //now job can be saved
      .assert.not.elementPresent("#steps-tab span[class='icon has-text-danger']")
      .assert.cssClassPresent('#button-job-create', 'button is-success')
      .end();
  });

  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});