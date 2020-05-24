let formatDateTime = require('../utils.js').helpers.formatDateTime;
let reference = require('./week-month-reference')['en'];

function scheduleSumary(schedule) {
  let result = '';
	
  if(Object.prototype.hasOwnProperty.call(schedule, 'oneTime')) {
    result = `Once at ${formatDateTime(schedule.oneTime)}`;
  }
	
  if(Object.prototype.hasOwnProperty.call(schedule, 'eachNDay')) {
    result = `Each ${schedule.eachNDay} day(s), ${getDailyFrequency(schedule.dailyFrequency)}, ${getStartEnd(schedule)}`;
  }
	
  if(Object.prototype.hasOwnProperty.call(schedule, 'eachNWeek')) {
    result = `Each ${schedule.eachNWeek} week(s) on ${getWeekDays(schedule.dayOfWeek)}, ${getDailyFrequency(schedule.dailyFrequency)}, ${getStartEnd(schedule)}`;
  }
	
  if(Object.prototype.hasOwnProperty.call(schedule, 'month')) {
    result = `In ${getMonths(schedule.month)} each ${getMonthDays(schedule.day)} day, ${getDailyFrequency(schedule.dailyFrequency)}, ${getStartEnd(schedule)}`;
  }

  return result;
}

function getDailyFrequency(dailyFrequency) {
  if(dailyFrequency.hasOwnProperty('occursOnceAt')) {
    return `at ${dailyFrequency.occursOnceAt}`;
  } else {
    let dailyEnd = dailyFrequency.end === undefined ? '23:59:59' : dailyFrequency.end;
    return `every ${dailyFrequency.occursEvery.intervalValue} ${dailyFrequency.occursEvery.intervalType}(s) between ${dailyFrequency.start} and ${dailyEnd}`;
  }
}

function listReducer(acc, cur, ind, arr) {
  //x, y, z and a
  let result = `${acc}${cur}`;
  if(arr.length > 2 && ind < arr.length - 2)
    result = `${result}, `;
  if(ind === arr.length - 2)
    result = `${result} and `;

  return result;
}

function getWeekDays(weekDays) {

  let choosenWeekDays = weekDays.map((val) => reference.weekDayList[val]);
	
  return choosenWeekDays.reduce(listReducer, '');
}

function getMonths(months) {
	
  let choosenMonths = months.map((val) => reference.monthList[val]);
  return choosenMonths.reduce(listReducer, '');
}

function getMonthDays(monthDays) {
  return monthDays.reduce(listReducer, '');
}

function getStartEnd(schedule) {
  let result = '';
	
  if(schedule.hasOwnProperty('startDateTime')) {
    result = `starting ${formatDateTime(schedule.startDateTime)}`; 
  }
  if(schedule.hasOwnProperty('endDateTime')) {
    result = `${result} and till ${formatDateTime(schedule.endDateTime)}`; 
  }
	
  return result;
}

module.exports = scheduleSumary;