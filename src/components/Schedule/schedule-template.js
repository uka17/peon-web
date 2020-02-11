module.exports = {
  newSchedule: {
    "name": "",        
    "enabled": true,
    "startDateTime": "2000-12-31T00:00:01.000Z",
    "endDateTime": "2100-12-31T00:00:01.000Z",
    "eachNDay": 1,
    "eachNWeek": 1,
    "dayOfWeek": ['mon'],        
    "month": ["jan"],
    "day": [1],        
    "dailyFrequency": { 
      "start": "00:00:00", 
      "end": "23:59:59", 
      "occursEvery": {
        "intervalValue": 90, 
        "intervalType": "minute"
      },
      "occursOnceAt": "00:00:01"
    }
  }
};
  