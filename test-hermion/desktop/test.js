const assert = require('chai').assert;

describe('hermione-hw', function() {
  it('should find work-area', function() {
    return this.browser
      .url('http://localhost:9000')
      .waitForVisible('=TestJob2')
      .click('=TestJob2')
      .waitForVisible('p=Job properties: TestJob2');
  });
});