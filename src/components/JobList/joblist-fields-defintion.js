let utils = require('../utils.js');

module.exports = 
[           
  {name: 'description', title: '', dataClass: '_description', callback: utils.helpers.info},
  {name: '__slot:job-name', title: 'Name', sortField: 'name'},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: utils.helpers.checkbox},
  {name: 'status', sortField: 'status', dataClass: 'default-cursor', title: 'Status'},
  {name: 'last_run_result', sortField: 'last_run_result', dataClass: 'has-text-centered default-cursor', title: 'Last run', callback: utils.helpers.runResult},
  {name: 'last_run_on', sortField: 'last_run_on', dataClass: 'default-cursor', title: 'Last run on', callback: utils.helpers.formatDateTime},
  {name: 'next_run', sortField: 'next_run', title: 'Next run', dataClass: 'default-cursor', callback: utils.helpers.formatDateTime},
  {name: 'step_count', sortField: 'step_count', dataClass: 'has-text-right default-cursor', title: 'Steps'},
  {name: 'schedule_count', sortField: 'schedule_count', dataClass: 'has-text-right default-cursor', title: 'Schedules'},
  {name: 'created_by', sortField: 'created_by', dataClass: 'default-cursor', title: 'Created by'},
  {name: 'created_on', sortField: 'created_on', dataClass: 'default-cursor', title: 'Created', callback: utils.helpers.formatDateTime},
  {name: 'modified_by', sortField: 'created_by', dataClass: 'default-cursor', title: 'Modified by'},
  {name: 'modified_on', sortField: 'modified_on', dataClass: 'default-cursor', title: 'Modified', callback: utils.helpers.formatDateTime}
];