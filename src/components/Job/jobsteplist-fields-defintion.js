let utils = require('../utils.js');

module.exports = 
[           
  {name: 'order', title: 'Order', dataClass: '_order'},
  {name: 'name', sortField: 'name', dataClass: '_name', title: 'Name', callback: utils.helpers.link},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: utils.helpers.checkbox},
  {name: 'retryAttempts', sortField: 'retry', title: 'Retry', callback: utils.helpers.retryAttempts},
  {name: 'onSucceed', sortField: 'onsuccess', title: 'On succeed', callback: utils.helpers.onStepResult},
  {name: 'onFailure', sortField: 'onfailure', title: 'On failure', callback: utils.helpers.onStepResult}
];
