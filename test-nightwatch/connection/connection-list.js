const config = require("../config.json");
const connections = JSON.parse(
  JSON.stringify(require("../data/connections.json"))
);
const createTestConnection = require("../helpers").createTestConnection;

describe("connection-list", function () {
  before(function (browser) {
    browser.url(config.endpoint);
    createTestConnection(browser, connections[1]);
    browser.end();
  });

  beforeEach(function (browser) {
    browser
      .url(config.endpoint)
      .windowMaximize()
      .waitForElementVisible('a[href="#/connections"]')
      .click('a[href="#/connections"]')
      .waitForElementVisible('a[href="#/connections/create"]');
  });

  this.tags = ["connection", "list", "user-interface"];

  test("connection-list. All components of connection list page are visible and has proper state and style", function (browser) {
    browser.assert
      .elementPresent('a[qa-data="connection-list-create"]')
      .assert.elementPresent('div[qa-data="connection-list-filter"]')
      .assert.elementPresent('a[qa-data="connection-list-filter-do"]')
      .assert.elementPresent('input[qa-data="connection-list-filter-text"]')
      .assert.elementPresent('a[qa-data="connection-list-filter-reset"]')
      .assert.elementPresent('table[qa-data="connection-list-table"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]');
  });

  test("connection-list. Line click activates Delete controls and changes line style", function (browser) {
    browser
      .getAttribute(
        'button[qa-data="connection-list-delete-modal-show"]',
        "disabled",
        function (result) {
          this.assert.equal(result.value, "true");
        }
      )

      .click(`div[qa-data="${connections[1].name}-cell"]`)

      .assert.cssClassPresent('tr[item-index="0"]', "is-selected")

      .getAttribute(
        'button[qa-data="connection-list-delete-modal-show"]',
        "disabled",
        function (result) {
          this.assert.equal(result.value, null);
        }
      );
  });

  test("connection-list. Filter control works properly", function (browser) {
    let testConnection = JSON.parse(JSON.stringify(connections[2]));
    testConnection.name += `f${(+new Date()).toString(16)}`;
    testConnection.host += `f${(+new Date()).toString(16)}`;
    testConnection.login += `f${(+new Date()).toString(16)}`;
    //create unique test connection
    createTestConnection(browser, testConnection);
    browser
      //click filter text box
      .click('input[qa-data="connection-list-filter-text"]')
      //by name
      .keys([testConnection.name])
      .click('a[qa-data="connection-list-filter-do"]')
      //connection in the table...
      .assert.elementPresent(`a[qa-data="${testConnection.name}"]`)
      //table has 1 row
      .expect.elements('table[qa-data="connection-list-table"] tbody tr')
      .count.to.equal(1);

    browser
      //clear filter
      .click('a[qa-data="connection-list-filter-reset"]')
      .getValue(
        'input[qa-data="connection-list-filter-text"]',
        function (result) {
          this.assert.equal(result.value, "");
        }
      )
      //should be more than 1 row
      .expect.elements('table[qa-data="connection-list-table"] tbody tr')
      .count.to.not.equal(1);

    browser
      .click('a[qa-data="connection-list-filter-reset"]')
      //click filter text box
      .click('input[qa-data="connection-list-filter-text"]')
      //by host
      .keys([testConnection.host])
      .click('a[qa-data="connection-list-filter-do"]')
      //connection in the table...
      .assert.elementPresent(`a[qa-data="${testConnection.name}"]`)
      //table has 1 row
      .expect.elements('table[qa-data="connection-list-table"] tbody tr')
      .count.to.equal(1);

    browser
      .click('a[qa-data="connection-list-filter-reset"]')
      //click filter text box
      .click('input[qa-data="connection-list-filter-text"]')
      //by login
      .keys([testConnection.login])
      .click('a[qa-data="connection-list-filter-do"]')
      //connection in the table...
      .assert.elementPresent(`a[qa-data="${testConnection.name}"]`)
      //table has 1 row
      .expect.elements('table[qa-data="connection-list-table"] tbody tr')
      .count.to.equal(1);
  });

  test(`connection-list. 
  - Delete button click opens proper modal window with proper set of content
  - Delete button in Delete modal has proper behavior based on entered text
  - Close button in Delete modal has proper behavior
  - After clicking Delete button in Delete modal connection is being deleted from the list properly
  `, function (browser) {
    let testConnection = JSON.parse(JSON.stringify(connections[1]));
    testConnection.name = `f${(+new Date()).toString(16)}`;
    //create unique test connection
    createTestConnection(browser, testConnection);
    //open delete modal
    browser
      .click(`div[qa-data="${testConnection.name}-cell"]`)
      .click('button[qa-data="connection-list-delete-modal-show"]')
      //aseert if from contains all elements and proper text
      .assert.elementPresent(
        'span[qa-data="connection-delete-modal-connection-name"]'
      )
      .assert.elementPresent('input[qa-data="connection-delete-modal-text"]')
      .assert.elementPresent('a[qa-data="connection-delete-modal-confirm"]')
      .assert.elementPresent('button[qa-data="connection-delete-modal-close"]')
      //check if button is disabled
      .assert.elementPresent(
        'a[qa-data="connection-delete-modal-confirm"][disabled="disabled"]'
      )
      //put name and check if button enabled
      .click('input[qa-data="connection-delete-modal-text"]')
      .keys([testConnection.name])
      .assert.not.elementPresent(
        'a[qa-data="connection-delete-modal-confirm"][disabled="disabled"]'
      )
      //close with close button
      .click('button[qa-data="connection-delete-modal-close"]')
      .assert.not.cssClassPresent(
        'div[qa-data="connection-delete-modal"]',
        "is-active"
      )
      //open again, confirm and check if connection was deleted
      .click(`div[qa-data="${testConnection.name}-cell"]`)
      .click('button[qa-data="connection-list-delete-modal-show"]')
      .click('input[qa-data="connection-delete-modal-text"]')
      .keys([testConnection.name])
      .click('a[qa-data="connection-delete-modal-confirm"]')
      .assert.not.cssClassPresent(
        'div[qa-data="connection-delete-modal"]',
        "is-active"
      )
      .assert.not.elementPresent(`a[qa-data="${testConnection.name}"]`);
  });

  test(`connection-list. Pagination works properly, changes control style, shown records and statistics of records counter`, function (browser) {
    let testConnection = JSON.parse(JSON.stringify(connections[1]));
    testConnection.name += `f${(+new Date()).toString(16)}`;
    //create 10 unique additional connections due to show pagination
    for (let index = 0; index < 10; index++) {
      let testConnection = JSON.parse(JSON.stringify(connections[1]));
      testConnection.name += `f${(+new Date()).toString(16)}-${index}`;
      createTestConnection(browser, testConnection);
    }

    //create unique test connection
    createTestConnection(browser, testConnection);
    browser//check if pagination is in place
    .assert
      .elementPresent('div[qa-data="connection-list-pagination-info"]')
      .assert.elementPresent('div[qa-data="connection-list-pagination"]')
      //check if connection is visible
      .assert.elementPresent(`a[qa-data="${testConnection.name}"]`)
      //go to next page
      .click(
        'div[qa-data="connection-list-pagination"] a[class="btn-nav button"] i[class="mdi mdi-skip-next"]'
      )
      //check if info was changed and connection is not visible
      .assert.not.elementPresent(`a[qa-data="${testConnection.name}"]`)
      .expect.element('div[qa-data="connection-list-pagination-info"]')
      .text.to.contain("Displaying 11");
    browser
      //go back
      .click(
        'div[qa-data="connection-list-pagination"] a[class="btn-nav button"] i[class="mdi mdi-skip-previous"]'
      )
      //check if info was changed and connection is not visible
      .assert.elementPresent(`a[qa-data="${testConnection.name}"]`)
      .expect.element('div[qa-data="connection-list-pagination-info"]')
      .text.to.contain("Displaying 1");
  });

  afterEach(function (browser) {
    browser.end();
  });

  after(function (browser) {});
});
