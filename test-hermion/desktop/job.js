const assert = require('chai').assert;

describe('job', function() {
  it('Should show job dialog', function() {
    return this.browser
      .url('http://localhost:9000')
      .waitForVisible('=TestJob2')
      .click('=TestJob2')
      .waitForVisible('p=Job properties: TestJob2');
  });
});