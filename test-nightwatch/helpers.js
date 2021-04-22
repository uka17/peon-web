module.exports = {
  '@disabled': true,
  createTestJob: function createTestJob(browser, testJob) {
    browser  
      //create new job for all tests where job is needed
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')      
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      .waitForElementVisible('#job-general')
      .setValue('#job-dialog-name', testJob.name)
      .setValue('#job-dialog-description', testJob.description)
      .click('a#steps-tab') 
      .click('button[qa-data="create-new-step"')
      .setValue('[qa-data="step-name"]', testJob.steps[0].name)
      .click('.CodeMirror-code')
      .keys(["script"]) 
      .click('button[qa-data="step-create"]')
      .click('button[qa-data="job-create"]')
    }
}