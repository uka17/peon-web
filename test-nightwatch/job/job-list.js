const config = require("../config.json");
const testJobTemplate = JSON.parse(JSON.stringify(require("../data/jobs.json").job));
const createTestJob = require('../helpers').createTestJob;

describe('job-list', function() {

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

  this.tags = ['job', 'list', 'user-interface'];

  test('job-list. All components of job list page are visible and has proper state and style', function (browser) {
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
  test('job-list. Line click activates Delete controls and changes line style', function (browser) {
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
  test('job-list. Filter control works properly', function (browser) {
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
  
  test(`job-list. 
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

  test(`job-list. Pagination works properly, changes control style, shown records and statistics of records counter`, function (browser) {
    let testJob = JSON.parse(JSON.stringify(testJobTemplate));
    testJob.name += `f${(+new Date).toString(16)}`;
    //create unique test job
    createTestJob(browser, testJob);       
    browser
      //check if pagination is in place
      .assert.elementPresent('div[qa-data="job-list-pagination-info"]')
      .assert.elementPresent('div[qa-data="job-list-pagination"]')
      //check if job is visible
      .assert.elementPresent(`a[qa-data="${testJob.name}"]`)
      //go to next page
      .click('div[qa-data="job-list-pagination"] a[class="btn-nav button"] i[class="mdi mdi-skip-next"]')
      //check if info was changed and job is not visible
      .assert.not.elementPresent(`a[qa-data="${testJob.name}"]`)      
      .expect.element('div[qa-data="job-list-pagination-info"]').text.to.contain('Displaying 11');
    browser      
      //go back
      .click('div[qa-data="job-list-pagination"] a[class="btn-nav button"] i[class="mdi mdi-skip-previous"]')
      //check if info was changed and job is not visible
      .assert.elementPresent(`a[qa-data="${testJob.name}"]`)
      .expect.element('div[qa-data="job-list-pagination-info"]').text.to.contain('Displaying 1')
  });  
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});