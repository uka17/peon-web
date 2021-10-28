const dayjs = require("dayjs");
const nanoid = require("nanoid");

module.exports = {
  "@disabled": true,
  createTestJob: function createTestJob(browser, testJob) {
    browser
      //create new job for all tests where job is needed
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      //fill in job general
      .waitForElementVisible("#job-general")
      .setValue("#job-dialog-name", testJob.name)
      .setValue("#job-dialog-description", testJob.description)
      //add step
      .click("a#steps-tab")
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJob.steps[0].name)
      .click('div[qa-data="step-dialog-connection"] input')
      .keys(["conn"])
      .click("div.dropdown-content a.dropdown-item")
      .click(".CodeMirror-code")
      .keys(["script"])
      .click('button[qa-data="step-create"]')
      //add schedule
      .click("a#schedules-tab")
      .click('button[qa-data="create-new-schedule"')
      .setValue('[qa-data="schedule-name"]', testJob.schedules[0].name)
      .setValue(
        'div[qa-data="schedule-onetime"] input',
        dayjs(testJob.schedules[0].oneTime).format("YYYY-MM-DD HH:mm:ss")
      )
      .click('[qa-data="schedule-name"]')
      .click('button[qa-data="schedule-create"]')
      //save job
      .click('button[qa-data="job-create"]');
  },
  createTestConnection: function createTestConnection(browser, testConnection) {
    browser
      //create new connection for all tests where connection is needed
      .waitForElementVisible('a[href="#/connections"]')
      .click('a[href="#/connections"]')
      .click('a[href="#/connections/create"]')
      //fill in connection general
      .waitForElementVisible("#connection-modal-content")
      .setValue('input[qa-data="connection-dialog-name"]', testConnection.name)
      .setValue('input[qa-data="connection-dialog-host"]', testConnection.host)
      .setValue(
        'input[qa-data="connection-dialog-database"]',
        testConnection.database
      )
      .setValue('input[qa-data="connection-dialog-port"]', [
        "\u0008",
        "\u0008",
        "\u0008",
      ])
      .setValue('input[qa-data="connection-dialog-port"]', testConnection.port)
      .setValue(
        'input[qa-data="connection-dialog-login"]',
        testConnection.login
      )
      .setValue(
        'input[qa-data="connection-dialog-password"]',
        testConnection.password
      )
      .click(
        `select[qa-data="connection-dialog-type"] option[value="${testConnection.type}"]`
      )
      //save connection
      .click('button[qa-data="connection-dialog-create"]');
  },
};
