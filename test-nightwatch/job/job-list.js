const config = require("../config.json");
let testJob = JSON.parse(JSON.stringify(require("../test-data.json").job));


describe('Job test set', function() {

  before(function(browser) {

  });

  beforeEach(function(browser) {

  });

  this.tags = ['job-list', 'user-interface'];
  
  
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});