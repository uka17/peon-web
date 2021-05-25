module.exports = {
  newStep: {
    "name": "",
    "enabled": true,
    "order": 1,
    "connection": null,
    "command": "",
    "retryAttempts": {
      "number": 1,
      "interval": 1
    },
    "onSucceed": "gotoNextStep",
    "onFailure": "gotoNextStep"
  }
};