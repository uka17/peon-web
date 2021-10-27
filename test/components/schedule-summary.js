/* eslint-disable no-undef */
//schedule summary unit tests
var chai  = require('chai');
chai.use(require('chai-datetime'));
let assert  = chai.assert;
const summary = require('../../src/components/Schedule/schedule-summary.js');
let testData = require('../test_data');
let formatDateTime = require('../../src/components/utils.js').helpers.formatDateTime;

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
    assert.equal(summary(testData.schedules.weekly), 'Each 1 week(s) on Monday, Wednesday and Friday, at 11:30:00, starting 2019-01-01 04:00:00');
    done();
  });

  it('1.4 monthly', (done) => {
    assert.equal(summary(testData.schedules.monthly), 'In December and July each 10, 15, 21, 29, 30 and 31 day, every 90 minute(s) between 09:00:00 and 23:59:59, starting 2018-12-31 04:00:00 and till 2001-12-31 04:00:00');
    done();
  });

  it('1.5 monthly2', (done) => {
    assert.equal(summary(testData.schedules.monthly2), 'In December each 10 day, every 1 hour(s) between 09:00:00 and 23:59:59, starting 2018-12-31 04:00:00 and till 2001-12-31 04:00:00');
    done();
  });

});