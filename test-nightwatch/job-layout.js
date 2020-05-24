/*
module.exports = {
  'create job for layout test' : function (browser) {
    //const jobName = `f${(+new Date).toString(16)}`;
    browser
      .url('http://localhost:9000/')
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .assert.elementPresent('#job-dialog-name')
      .assert.elementPresent('#job-dialog-description')
      .assert.elementPresent('#job-dialog-name-error')
      .assert.containsText('#job-dialog-name-error', 'must')
      .assert.cssClassPresent('#button-job-create', 'button is-success is-static')
      .assert.cssClassPresent('#button-job-cancel', 'button')
      //to be continue
      .end();
  }
};
*/