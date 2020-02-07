let formatDateTime = require('../utils.js').formatDateTime;

function scheduleSumary(schedule) {
  let result = '';
	
  if(schedule.hasOwnProperty('oneTime')) {
    result = `Once at ${formatDateTime(schedule.oneTime)}`;
  }
	
  if(schedule.hasOwnProperty('eachNDay')) {
    result = `Each ${schedule.eachNDay} day(s), ${getDailyFrequency(schedule.dailyFrequency)}, ${getStartEnd(schedule)}`;
  }
	
  if(schedule.hasOwnProperty('eachNWeek')) {
    result = `Each ${schedule.eachNWeek} week(s), ${getWeekDays(schedule.dayOfWeek)}, ${getDailyFrequency(schedule.dailyFrequency)}, ${getStartEnd(schedule)}`;
  }
	
  if(schedule.hasOwnProperty('month')) {
    result = `In ${getMonths(schedule.month)}, each ${getMonthDays(schedule.day)} day(s), ${getDailyFrequency(schedule.dailyFrequency)}, ${getStartEnd(schedule)}`;
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

function getWeekDays(weekDays) {
  let weekDayList = {
    "sun": "Sunday", 
    "mon": "Monday", 
    "tue": "Tuesday", 
    "wed": "Wednesday", 
    "thu": "Thursday", 
    "fri": "Friday", 
    "sat": "Saturday"
  };
	
  return weekDays.reduce((acc, cur, ind, arr) => {
    return ind === arr.length - 1 ? `${acc} and ${weekDayList[cur]}` : `${acc} ${weekDayList[cur]},`;
  }, 'on');
}
function getMonths(months) {
  let monthList = {
    "jan": "January", 
    "feb": "February", 
    "mar": "March", 
    "apr": "April", 
    "may": "May", 
    "jun": "June", 
    "jul": "July", 
    "aug": "August", 
    "sep": "September", 
    "oct": "October", 
    "nov": "November", 
    "dec": "December"
  };
	
  return months.reduce((acc, cur) => `${acc}, ${monthList[cur]}`, '');
}

function getMonthDays(monthDays) {
  return monthDays.reduce((acc, cur) => `${acc}, ${cur}`, '');
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