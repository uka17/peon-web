/* eslint-disable no-undef */
//schedule summary unit tests
var chai  = require('chai');
chai.use(require('chai-datetime'));
let assert  = chai.assert;
const summary = require('../../src/components/Schedule/schedule-summary.js');
let testData = require('../test_data');
let formatDateTime = require('../../src/components/utils.js').formatDateTime;

describe.only('schedule-summary', function() {
  it('1.1 oneTime', (done) => {
    assert.equal(summary(testData.schedules.oneTime), `Once at ${formatDateTime(testData.schedules.oneTime.oneTime)}`);
    done();
  });
  
  it('1.2 daily', (done) => {
    assert.equal(summary(testData.schedules.daily), `Each ${testData.schedules.daily.eachNDay} day(s), at ${testData.schedules.daily.dailyFrequency.occursOnceAt}, starting ${formatDateTime(testData.schedules.daily.startDateTime)} and till ${formatDateTime(testData.schedules.daily.endDateTime)}`);
    done();
  });
  
  it('1.3 weekly', (done) => {
    assert.equal(summary(testData.schedules.weekly), '-');
    done();
  });

  it('1.4 monthly', (done) => {
    assert.equal(summary(testData.schedules.monthly), '-');
    done();
  });

});