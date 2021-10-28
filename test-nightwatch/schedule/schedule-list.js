const dayjs = require("dayjs");
const config = require("../config.json");
const testJob = JSON.parse(JSON.stringify(require("../data/jobs.json").job));
testJob.name += `f${(+new Date()).toString(16)}`;
const createTestJob = require("../helpers").createTestJob;

describe("schedule-list", function () {
  before(function (browser) {
    browser.url(config.endpoint);
    createTestJob(browser, testJob);
    browser.end();
  });

  beforeEach(function (browser) {
    browser
      .url(config.endpoint)
      .windowMaximize()
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]');
  });

  this.tags = ["schedule", "form", "user-interface"];

  test(`schedule-list. 
    Open exisiting job
    Add new schedule
    Delete schedule
    `, function (browser) {
    browser.click(`a[qa-data="${testJob.name}"]`).click("a#schedules-tab");
    //Add one omore shcedule
    browser
      .click('button[qa-data="create-new-schedule"')
      .setValue('[qa-data="schedule-name"]', testJob.schedules[0].name)
      .setValue(
        'div[qa-data="schedule-onetime"] input',
        dayjs(testJob.schedules[0].oneTime).format("YYYY-MM-DD HH:mm:ss")
      )
      .click('[qa-data="schedule-name"]')
      .click('button[qa-data="schedule-create"]')
      //Check if there are 2 schedules
      .expect.elements('table[qa-data="schedule-list"] tbody tr')
      .count.to.equal(2);
    //Delete 1 schedule
    browser
      .click(`span[qa-data="${testJob.schedules[0].name}"]`)
      .assert.not.attributeContains(
        'button[qa-data="delete-selected-schedule"]',
        "disabled",
        "true"
      )
      .click('button[qa-data="delete-selected-schedule"]')
      .assert.attributeContains(
        'button[qa-data="delete-selected-schedule"]',
        "disabled",
        "true"
      )
      .assert.cssClassPresent("#button-job-save", "button is-link")
      .expect.elements('table[qa-data="schedule-list"] tbody tr')
      .count.to.equal(1);
    //Delete 2 schedule
    browser
      .click(`span[qa-data="${testJob.schedules[0].name}"]`)
      .assert.not.attributeContains(
        'button[qa-data="delete-selected-schedule"]',
        "disabled",
        "true"
      )
      .click('button[qa-data="delete-selected-schedule"]')
      .assert.attributeContains(
        'button[qa-data="delete-selected-schedule"]',
        "disabled",
        "true"
      )
      .assert.elementPresent(
        'table[qa-data="schedule-list"] .vuetable-empty-result'
      )
      .assert.elementPresent("#schedule-list-empty-error")
      //Job can not be saved
      .assert.cssClassPresent("#button-job-save", "button is-link is-static");
  });

  afterEach(function (browser) {
    browser.end();
  });

  after(function (browser) {});
});
