const config = require("../config.json");
const connections = JSON.parse(JSON.stringify(require("../data/connections.json")));
const createTestConnection = require('../helpers').createTestConnection;

describe('connection-list', function() {

  before(function(browser) {
    browser.url(config.endpoint);
    createTestConnection(browser, connections[0]);
    browser.end();
  });

  beforeEach(function(browser) {
    browser
      .url(config.endpoint)
      .windowMaximize()
      .waitForElementVisible('a[href="#/connections"]')
      .click('a[href="#/connections"]')
      .waitForElementVisible('a[href="#/connections/create"]')      
  });

  this.tags = ['connection', 'list', 'user-interface'];

  test('connection-list. All components of connection list page are visible and has proper state and style', function (browser) {
    browser
      .assert.elementPresent('a[qa-data="connection-list-create"]')
      .assert.elementPresent('div[qa-data="connection-list-filter"]')
      .assert.elementPresent('a[qa-data="connection-list-filter-do"]')
      .assert.elementPresent('input[qa-data="connection-list-filter-text"]')
      .assert.elementPresent('a[qa-data="connection-list-filter-reset"]')
      .assert.elementPresent('table[qa-data="connection-list-table"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]')
  }); 
   
  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});