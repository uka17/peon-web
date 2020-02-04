module.exports = {
  newJob: {
    "job": {
      "name": "",
      "enabled": true,
      "description": "",    
      "steps": [],
      "schedules": [{
        "name": "schedule1",        
        "enabled": true,
        "startDateTime": "2018-01-31T20:55:23.071Z",
        "eachNWeek": 1,
        "dayOfWeek": [
          "mon",
          "tue",
          "wed",
          "thu",
          "fri"
        ],
        "dailyFrequency": {
          "start": "06:00:00",
          "occursEvery": {
            "intervalValue": 5,
            "intervalType": "minute"
          }
        }
      }],      
    },
    "modifiedOn": null,
    "modifiedBy": "testRobot",
    "createdOn": null,
    "createdBy": "testRobot",
    "nextRun": null,
    "lastRunOn": null,
    "lastRunResult": null    
  }
};