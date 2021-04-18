const config = require("../config.json");
const testJobTemplate = JSON.parse(JSON.stringify(require("../test-data.json").job));

function createTestJob(browser, testJob) {
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

describe('Job list test set', function() {

  before(function(browser) {
    browser.url(config.endpoint);
    createTestJob(browser, testJobTemplate);
    browser.end();
  });

  beforeEach(function(browser) {
    browser
      .url(config.endpoint)
      .windowMaximize()
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
  test('Filter control works properly', function (browser) {
    let testJob = JSON.parse(JSON.stringify(testJobTemplate));
    testJob.name += `f${(+new Date).toString(16)}`;
    testJob.description += `f${(+new Date).toString(16)}`;
    //create unique test job
    createTestJob(browser, testJob);          
    browser
      //click filter text box
      .click('input[qa-data="job-list-filter-text"]')
      //by name
      .keys([testJob.name])
      .click('a[qa-data="job-list-filter-do"]')
      //job in the table...
      .assert.elementPresent(`a[qa-data="${testJob.name}"]`)
      //table has 1 row
      .expect.elements('table[qa-data="job-list-table"] tbody tr').count.to.equal(1);

    browser
      //clear filter
      .click('a[qa-data="job-list-filter-reset"]')
      .getValue('input[qa-data="job-list-filter-text"]', function(result) {
        this.assert.equal(result.value, '');
      })
      //should be more than 1 row
      .expect.elements('table[qa-data="job-list-table"] tbody tr').count.to.not.equal(1);
      
    browser
      //click filter text box
      .click('input[qa-data="job-list-filter-text"]')
      //by description
      .keys([testJob.description])
      .click('a[qa-data="job-list-filter-do"]')
      //job in the table...
      .assert.elementPresent(`a[qa-data="${testJob.name}"]`)
      //table has 1 row
      .expect.elements('table[qa-data="job-list-table"] tbody tr').count.to.equal(1);
  });   
  
  test.only(`
    - Delete button click opens proper modal window with proper set of content
    - Delete button in Delete modal has proper behavior based on entered text
    - Close button in Delete modal has proper behavior
    - After clicking Delete button in Delete modal job is being deleted from the list properly
    `, function (browser) {
      let testJob = JSON.parse(JSON.stringify(testJobTemplate));
      testJob.name += `f${(+new Date).toString(16)}`;
      //create unique test job
      createTestJob(browser, testJob);   
      //open delete modal
      browser
        .click(`span[qa-data="${testJob.description}"]`)
        .click('button[qa-data="job-list-delete-modal-show"]')
        //aseert if from contains all elements and proper text
        .assert.elementPresent('span[qa-data="job-delete-modal-job-name"]')
        .assert.elementPresent('input[qa-data="job-delete-modal-text"]')
        .assert.elementPresent('a[qa-data="job-delete-modal-confirm"]')
        .assert.elementPresent('button[qa-data="job-delete-modal-close"]')
        //check if button is disabled
        .assert.elementPresent('a[qa-data="job-delete-modal-confirm"][disabled="disabled"]')
        //put name and check if button enabled
        .click('input[qa-data="job-delete-modal-text"]')
        .keys([testJob.name])
        .assert.not.elementPresent('a[qa-data="job-delete-modal-confirm"][disabled="disabled"]')
        //close with close button
        .click('button[qa-data="job-delete-modal-close"]')
        .assert.not.cssClassPresent('div[qa-data="job-delete-modal"]', 'is-active')
        //open again, confirm and check if job was deleted
        .click(`span[qa-data="${testJob.description}"]`)
        .click('button[qa-data="job-list-delete-modal-show"]')
        .click('input[qa-data="job-delete-modal-text"]')
        .keys([testJob.name])
        .click('a[qa-data="job-delete-modal-confirm"]')
        .assert.not.cssClassPresent('div[qa-data="job-delete-modal"]', 'is-active')
        .assert.not.elementPresent(`a[qa-data="${testJob.name}"]`)
  });
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});