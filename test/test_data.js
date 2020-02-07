module.exports.listWithOrder = [
  {
    name: 'a',
    order: 2
  },
  {
    name: 'b',
    order: 1
  },  
  {
    name: 'c',
    order: 9
  },    
  {
    name: 'd',
    order: 9
  },
  {
    name: 'e',
    order: 3
  }   
];

module.exports.schedules = {
  "oneTime": { "oneTime": "2019-01-01T01:00:00.000Z" },
  "daily": { 
    "startDateTime": "2020-01-31T20:54:23.071Z",
    "endDateTime": "2021-01-31T20:54:23.071Z",
    "eachNDay": 2,
    "dailyFrequency": { "occursOnceAt": "11:11:11"}
  },
  "weekly": {
    "startDateTime": "2019-01-01T01:00:00.000Z",
    "eachNWeek": 1,
    "dayOfWeek": ['mon', 'wed', 'fri'],
    "dailyFrequency": { "occursOnceAt": "11:30:00"}
  },
  "monthly": { 
    "startDateTime": "2018-12-31T01:00:00.000Z",
    "endDateTime": "2001-12-31T01:00:00.000Z",
    "month": ["dec", "jul"],
    "day": [10, 15, 21, 29, 30, 31],
    "dailyFrequency": { 
      "start": "09:00:00", 
      "occursEvery": {
        "intervalValue": 90, 
        "intervalType": "minute"
      }
    }
  },
  "monthly2": { 
    "startDateTime": "2018-12-31T01:00:00.000Z",
    "endDateTime": "2001-12-31T01:00:00.000Z",
    "month": ["dec"],
    "day": [10],
    "dailyFrequency": { 
      "start": "09:00:00", 
      "occursEvery": {
        "intervalValue": 1, 
        "intervalType": "hour"
      }
    }
  }  
};
