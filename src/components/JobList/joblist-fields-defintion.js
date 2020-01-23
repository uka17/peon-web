let utils = require('../utils.js');

module.exports = 
[           
  {name: 'description', title: '', dataClass: '_description', callback: utils.helpers.info},
  {name: '__slot:job-name', title: 'Name', sortField: 'name'},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: utils.helpers.checkbox},
  {name: 'status', sortField: 'status', title: 'Status'},
  {name: 'last_run_result', sortField: 'last_run_result', dataClass: 'has-text-centered', title: 'Last run', callback: utils.helpers.runResult},
  {name: 'last_run_on', sortField: 'last_run_on', title: 'Last run on', callback: utils.helpers.formatDateTime},
  {name: 'next_run', sortField: 'next_run', title: 'Next run', callback: utils.helpers.formatDateTime},
  {name: 'step_count', sortField: 'step_count', dataClass: 'has-text-right', title: 'Steps'},
  {name: 'schedule_count', sortField: 'schedule_count', dataClass: 'has-text-right', title: 'Schedules'},
  {name: 'created_by', sortField: 'created_by', title: 'Created by'},
  {name: 'created_on', sortField: 'created_on', title: 'Created', callback: utils.helpers.formatDateTime},
  {name: 'modified_by', sortField: 'created_by', title: 'Modified by'},
  {name: 'modified_on', sortField: 'modified_on', title: 'Modified', callback: utils.helpers.formatDateTime}
];