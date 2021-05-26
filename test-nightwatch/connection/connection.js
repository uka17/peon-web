const dayjs = require("dayjs");
const config = require("../config.json");
const testConnection = JSON.parse(JSON.stringify(require("../data/connections.json")[1]));
const createTestConnection = require('../helpers').createTestConnection;

describe('connection', function() {

  before(function(browser) {
    browser.url(config.endpoint);
    createTestConnection(browser, testConnection);
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

  this.tags = ['connection', 'form', 'user-interface'];

  test('connection. Click to New opens proper modal window. Validation checks', function (browser) {
    browser
      //open new connection dialog
      .click('a[href="#/connections/create"]')
      //warinigs are in place
      //buttons check
      .assert.elementPresent("button[qa-data='connection-dialog-create']")
      .assert.elementPresent("button[qa-data='connection-dialog-close']")      
      .assert.cssClassPresent("button[qa-data='connection-dialog-create']", 'button is-success is-static')
      .assert.cssClassPresent("button[qa-data='connection-dialog-close']", 'button')      
      //name
      .assert.elementPresent('input[qa-data="connection-dialog-name"]')
      .assert.cssClassPresent('input[qa-data="connection-dialog-name"]', 'input is-danger')
      .assert.containsText('p[qa-data="connection-dialog-name-error"]', 'including spaces and symbols -_,), not longer than 100 chars')
      .setValue('input[qa-data="connection-dialog-name"]', testConnection.name)
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-name"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="connection-dialog-name-error"]', 'including spaces and symbols -_,), not longer than 100 chars')      
      .assert.cssClassPresent("button[qa-data='connection-dialog-create']", 'button is-success is-static')
      //enabled
      .assert.elementPresent("input[qa-data='connection-dialog-enabled']")
      //host
      .assert.elementPresent('input[qa-data="connection-dialog-host"]')
      .assert.cssClassPresent('input[qa-data="connection-dialog-host"]', 'input is-danger')
      .assert.containsText('p[qa-data="connection-dialog-host-error"]', 'can not be empty')
      .setValue('input[qa-data="connection-dialog-host"]', testConnection.host)
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-host"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="connection-dialog-host-error"]', 'can not be empty')    
      .assert.cssClassPresent("button[qa-data='connection-dialog-create']", 'button is-success is-static')    
      //database
      .assert.elementPresent('input[qa-data="connection-dialog-database"]')
      .assert.cssClassPresent('input[qa-data="connection-dialog-database"]', 'input is-danger')
      .assert.containsText('p[qa-data="connection-dialog-database-error"]', 'can not be empty')    
      .setValue('input[qa-data="connection-dialog-database"]', testConnection.database)
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-database"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="connection-dialog-database-error"]', 'can not be empty')   
      .assert.not.cssClassPresent("button[qa-data='connection-dialog-create']", 'button is-success is-static')        
      //port
      .assert.elementPresent('input[qa-data="connection-dialog-port"]')
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-port"]', 'input is-danger')
      .setValue('input[qa-data="connection-dialog-port"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="connection-dialog-port"]', testConnection.port)
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-port"]', 'input is-danger')
      .assert.not.containsText('p[qa-data="connection-dialog-port-error"]', 'can not be empty')         
      //login
      .assert.elementPresent('input[qa-data="connection-dialog-login"]')
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-login"]', 'input is-danger')      
      .setValue('input[qa-data="connection-dialog-login"]', testConnection.login)
      .assert.not.containsText('p[qa-data="connection-dialog-port-error"]', 'can not be empty')         
      //password
      .assert.elementPresent('input[qa-data="connection-dialog-password"]')
      .assert.not.cssClassPresent('input[qa-data="connection-dialog-password"]', 'input is-danger')   
      .setValue('input[qa-data="connection-dialog-login"]', testConnection.password)
      .assert.not.containsText('p[qa-data="connection-dialog-password-error"]', 'can not be empty')                
      //type
      .assert.elementPresent('select[qa-data="connection-dialog-type"]')
      //buttons check
      .assert.elementPresent("button[qa-data='connection-dialog-create']")
      .assert.elementPresent("button[qa-data='connection-dialog-close']")      
      .assert.not.cssClassPresent("button[qa-data='connection-dialog-create']", 'button is-success is-static')
      .assert.cssClassPresent("button[qa-data='connection-dialog-close']", 'button')
  });

  test('connection. Created connection is being reflected in connection list', function (browser) {
    let connection = JSON.parse(JSON.stringify(testConnection));
    connection.name += `f${(+new Date).toString(16)}`;
    browser
      //open new connection dialog
      .click('a[href="#/connections/create"]')
      .setValue('input[qa-data="connection-dialog-name"]', connection.name)   
      .setValue('input[qa-data="connection-dialog-host"]', connection.host)
      .setValue('input[qa-data="connection-dialog-database"]', connection.database)
      .setValue('input[qa-data="connection-dialog-port"]', ['\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="connection-dialog-port"]', connection.port)
      .setValue('input[qa-data="connection-dialog-login"]', connection.login)
      .setValue('input[qa-data="connection-dialog-password"]', connection.password)
      .click(`select[qa-data="connection-dialog-type"] option[value="${connection.type}"]`)      
      //create connection
      .click('button[qa-data="connection-dialog-create"]')
      //check if connection is exists connection job list
      .waitForElementVisible(`a[qa-data="${connection.name}"]`)
  });  

  test('connection. Closing Connection modal with Close button or Cancel button after opening New modal reloads page to proper content', function (browser) {
    browser
      //open new connection dialog      
      .click('a[href="#/connections/create"]')
      .click('button[qa-data="connection-modal-close"]')
      //check if Close reloads to proper state
      .assert.elementPresent('a[qa-data="connection-list-create"]')
      .assert.elementPresent('div[qa-data="connection-list-filter"]')
      .assert.elementPresent('table[qa-data="connection-list-table"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination-info"]')
      //check if Cancel reloads to proper state
      .click('a[href="#/connections/create"]')
      .click('button[qa-data="connection-dialog-close"]')
      .assert.elementPresent('a[qa-data="connection-list-create"]')
      .assert.elementPresent('div[qa-data="connection-list-filter"]')
      .assert.elementPresent('table[qa-data="connection-list-table"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination-info"]')   
  });  

  test('connection. Change in connection attributes is being reflected in connection list', function (browser) {
    let connection = JSON.parse(JSON.stringify(testConnection));
    connection.name += `f${(+new Date).toString(16)}`;
    //create new connection as Template one should stay untouched
    createTestConnection(browser, connection);
    browser
      .url(config.endpoint)
      .click('a[href="#/connections"]')
      .waitForElementVisible('a[href="#/connections/create"]')
      //check if connection is exists in connection list
      .waitForElementVisible(`a[qa-data="${connection.name}"]`)
      //change connection content 
      .click(`a[qa-data="${connection.name}"]`)
      .setValue('input[qa-data="connection-dialog-name"]', '-changed')   
      .setValue('input[qa-data="connection-dialog-host"]', '-changed')
      .setValue('input[qa-data="connection-dialog-database"]', '-changed')
      .setValue('input[qa-data="connection-dialog-port"]', ['\u0008', '\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="connection-dialog-port"]', '8080')
      .setValue('input[qa-data="connection-dialog-login"]', '-changed')
      .setValue('input[qa-data="connection-dialog-password"]', '-changed')
      .click(`select[qa-data="connection-dialog-type"] option[value="postgresql"]`)    
      .click('input[qa-data="connection-dialog-enabled"]')  
      //create connection
      .click('button[qa-data="connection-dialog-save"]')
      //check if changes are reflected in the list
      .waitForElementVisible(`a[qa-data="${connection.name}-changed"]`)
      //check if changes are reflected in modal
      .click(`a[qa-data="${connection.name}-changed"]`)
      .assert.valueContains('input[qa-data="connection-dialog-name"]', `${connection.name}-changed`)   
      .assert.valueContains('input[qa-data="connection-dialog-host"]', `${connection.host}-changed`)
      .assert.valueContains('input[qa-data="connection-dialog-database"]', `${connection.database}-changed`)
      .assert.valueContains('input[qa-data="connection-dialog-port"]', '8080')
      .assert.valueContains('input[qa-data="connection-dialog-login"]', `${connection.login}-changed`)
      .assert.valueContains('input[qa-data="connection-dialog-password"]', `${connection.password}-changed`)
      .assert.valueContains(`select[qa-data="connection-dialog-type"]`, "postgresql")          
      .expect.element('input[qa-data="connection-dialog-enabled"]').to.not.be.selected
  });

  test('connection. Closing Сonnection modal with close button, Save or Cancel button after opening job reloads page to proper content', function (browser) {
    browser
      .click(`a[qa-data="${testConnection.name}"]`)
      .click('button[qa-data="connection-modal-close"]')
      //check if Close reloads to proper state
      .assert.elementPresent('a[qa-data="connection-list-create"]')
      .assert.elementPresent('div[qa-data="connection-list-filter"]')
      .assert.elementPresent('table[qa-data="connection-list-table"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination-info"]')
      //check if Cancel reloads to proper state
      .click('a[href="#/connections/create"]')
      .click('button[qa-data="connection-dialog-close"]')
      .assert.elementPresent('a[qa-data="connection-list-create"]')
      .assert.elementPresent('div[qa-data="connection-list-filter"]')
      .assert.elementPresent('table[qa-data="connection-list-table"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination-info"]')   
  });  


  test('connection. Open existing connection, putting content inside and click Cancel or Close - connection was not changed', function (browser) {
    browser
      .click(`a[qa-data="${testConnection.name}"]`)
      .assert.cssClassPresent('button[qa-data="connection-dialog-save"', 'button is-link')
      //change values
      .setValue('input[qa-data="connection-dialog-name"]', '-changed')   
      .setValue('input[qa-data="connection-dialog-host"]', '-changed')
      .setValue('input[qa-data="connection-dialog-database"]', '-changed')
      .setValue('input[qa-data="connection-dialog-port"]', ['\u0008', '\u0008', '\u0008', '\u0008'])
      .setValue('input[qa-data="connection-dialog-port"]', '8080')
      .setValue('input[qa-data="connection-dialog-login"]', '-changed')
      .setValue('input[qa-data="connection-dialog-password"]', '-changed')
      .click(`select[qa-data="connection-dialog-type"] option[value="postgresql"]`)    
      .click('input[qa-data="connection-dialog-enabled"]')  
      //create connection
      .click('button[qa-data="connection-dialog-close"]')           
      //check if connection was not changed
      //check if changes are reflected in the list
      .waitForElementVisible(`a[qa-data="${testConnection.name}"]`)
      //check if changes are reflected in modal
      .click(`a[qa-data="${testConnection.name}"]`)
      .assert.valueContains('input[qa-data="connection-dialog-name"]', testConnection.name)   
      .assert.valueContains('input[qa-data="connection-dialog-host"]', testConnection.host)
      .assert.valueContains('input[qa-data="connection-dialog-database"]', testConnection.database)
      .assert.valueContains('input[qa-data="connection-dialog-port"]', testConnection.port)
      .assert.valueContains('input[qa-data="connection-dialog-login"]', testConnection.login)
      .assert.valueContains('input[qa-data="connection-dialog-password"]', testConnection.password)
      .assert.valueContains(`select[qa-data="connection-dialog-type"]`, testConnection.type)          
      .expect.element('input[qa-data="connection-dialog-enabled"]').to.be.selected
  });  

  afterEach(function(browser) {
    browser.end();
  });

  after(function(browser) {

  });  
});