module.exports = {
  'create job with 2 steps and find it in job list' : function (browser) {
    const jobName = `f${(+new Date).toString(16)}`;
    browser
      .url('http://localhost:9000/')
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .assert.containsText('#job-dialog-name-error', 'must')
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')
      .assert.cssClassPresent('#button-job-cancel', 'button')
      .setValue('#job-dialog-name', jobName)
      .setValue('#job-dialog-description', `Description for job ${jobName}`)
      .assert.cssClassPresent('#button-job-create', 'button is-success')
      //switch to 'step' tab
      .click('#steps-tab')
      .assert.visible('button[title="Create new step"')
      .assert.attributeContains('button[title="Move step up"', 'disabled', 'true')
      .assert.attributeContains('button[title="Move step down"', 'disabled', 'true')
      .assert.attributeContains('button[title="Delete selected step"', 'disabled', 'true')
      .assert.visible('.vuetable-empty-result')
      .click('button[title="Create new step"')
      .assert.visible('button[title="Create step"')
      .end();
  }
};