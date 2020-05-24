const dayjs = require('dayjs');
console.log(dayjs().format('YYYY-M-D'));
module.exports = {
  'create job with 2 steps and find it in job list' : function (browser) {
    const jobName = `f${(+new Date).toString(16)}`;
    const step1 = `Step1 for job ${jobName}`;
    const step2 = `Step2 for job ${jobName}`;
    const schedule1 = `Schedule1 for job ${jobName}`;    
    //changed parameters
    const jobNameChanged = `f${(+new Date).toString(16)}`;    
    const step1Changed = `Step1 for job ${jobName} changed`;
    const step2Changed = `Step2 for job ${jobName} changed`;
    const schedule1Changed = `Schedule1 for job ${jobName} changed`;        
    browser
      .url('http://localhost:9000/')
      //open new job dialog
      .waitForElementVisible('a[href="#/jobs"]')
      .click('a[href="#/jobs"]')
      .waitForElementVisible('a[href="#/jobs/create"]')
      .click('a[href="#/jobs/create"]')
      //create=====================
      .waitForElementVisible('#job-general')
      .setValue('#job-dialog-name', jobName)
      .setValue('#job-dialog-description', `Description for job ${jobName}`)
      //switch to 'step' tab
      .click('#steps-tab')
      //create step1
      .click('button[title="Create new step"')
      .waitForElementVisible('#step-dialog-name')
      .setValue('#step-dialog-name', step1)
      .click('.CodeMirror-code')      
      .keys("SELECT 1") 
      .keys(browser.Keys.NULL)
      .assert.cssClassPresent('#step-dialog-create', 'button is-success')
      .click('button[title="Create step"')
      //create step2
      .click('button[title="Create new step"')
      .waitForElementVisible('#step-dialog-name')
      .setValue('#step-dialog-name', step2)
      .click('.CodeMirror-code')      
      .keys("SELECT 2") 
      .keys(browser.Keys.NULL)
      .assert.cssClassPresent('#step-dialog-create', 'button is-success')
      .click('button[title="Create step"')      
      //check both steps are presented
      .useXpath()
      .assert.elementPresent(`//*[text()[contains(.,'${step1}')]]`)
      .assert.elementPresent(`//*[text()[contains(.,'${step2}')]]`)
      .useCss()
      .click('#schedules-tab')
      //add weekly schedule
      .click('button[title="Create new schedule"')
      .setValue('input[placeholder="Schedule name"', schedule1)
      .setValue('#schedule-dialog-type', 'weekly')
      .click('#schedule-duaration-start input')  
      .pause(50)
      .click(`td[data-id="${dayjs().format('YYYY-M-D')}"]`)  
      .click('input[placeholder="Schedule name"')  
      .setValue('#schedule-eachnweek', 2)      
      .click('#monday')
      .click('#friday')
      .setValue('#schedule-occurs-once-at', '12:12:30')            
      .assert.cssClassPresent('button[title="Create schedule"]', 'button is-success')
      .click('button[title="Create schedule"]')
      .useXpath()
      .assert.elementPresent(`//*[text()[contains(.,'${schedule1}')]]`)    
      .assert.elementPresent(`//*[text()[contains(.,'Monday')]]`)
      .assert.elementPresent(`//*[text()[contains(.,'Friday')]]`)
      .useCss()  
      //create job
      .click('#button-job-create')
      //check if job exists in table
      .assert.elementPresent(`span[data-tooltip*="${jobName}"]`)
      //try to filter
      .setValue('#filter-text', jobName)
      .click('#filter-apply')
      //check if job exists in table
      .assert.elementPresent(`span[data-tooltip*="${jobName}"]`)      
      //reset filter and check again
      .click('#filter-reset')
      .assert.elementPresent(`span[data-tooltip*="${jobName}"]`)
      //edit job===================================================================================
      .useXpath()
      .click(`//*[text()[contains(.,'${jobName}')]]`)    
      .useCss()  
      .waitForElementVisible('#job-general')
      .setValue('#job-dialog-name', jobNameChanged)
      //switch to 'step' tab
      .click('#steps-tab')
      //change step1
      .useXpath()
      .click(`//*[text()[contains(.,'${step1}')]]`)
      .useCss()  
      .waitForElementVisible('#step-dialog-name')
      .clearValue('#step-dialog-name')
      .setValue('#step-dialog-name', step1Changed)
      .click('.CodeMirror-code')            
      .keys("SELECT 11") 
      .keys(browser.Keys.NULL)
      .assert.cssClassPresent('#step-dialog-save', 'button is-link')
      .click('#step-dialog-save')
      //change step2
      .useXpath()      
      .click(`//*[text()[contains(.,'${step2}')]]`)
      .useCss()
      .waitForElementVisible('#step-dialog-name')
      .setValue('#step-dialog-name', step2Changed)
      .click('.CodeMirror-code')      
      .keys("SELECT 22") 
      .keys(browser.Keys.NULL)
      .assert.cssClassPresent('#step-dialog-save', 'button is-link')
      .click('#step-dialog-save')    
      //check both steps are presented as changed
      .useXpath()
      .assert.elementPresent(`//*[text()[contains(.,'${step1Changed}')]]`)
      .assert.elementPresent(`//*[text()[contains(.,'${step2Changed}')]]`)
      .useCss()
      .click('#schedules-tab')
      //change days in weekly schedule
      .useXpath()  
      .click(`//*[text()[contains(.,'${schedule1}')]]`)    
      .useCss()
      .setValue('input[placeholder="Schedule name"', schedule1Changed)
      .click('#monday')
      .click('#friday')
      .click('#wednesday')             
      .assert.cssClassPresent('#schedule-dialog-save', 'button is-link')
      .click('#schedule-dialog-save')
      .useXpath()
      .assert.elementPresent(`//*[text()[contains(.,'${schedule1Changed}')]]`)    
      .assert.elementPresent(`//*[text()[contains(.,'Wednesday')]]`)
      .useCss()  
      //save changed job
      .assert.cssClassPresent('#button-job-save-changes', 'button is-link')
      .click('#button-job-save-changes')
      //check if job exists in table
      .assert.elementPresent(`span[data-tooltip*="${jobNameChanged}"]`)  
      .end();
  }
};