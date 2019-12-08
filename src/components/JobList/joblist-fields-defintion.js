let utils = require('../utils.js');
let config = require('../config.js');

module.exports = 
[           
  {name: 'description', title: '', dataClass: '_description', callback: jobDescription},
  {name: 'name', sortField: 'name', dataClass: '_name', title: 'Name'},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: checkbox},
  {name: 'status', sortField: 'status', title: 'Status'},
  {name: 'last_run_result', sortField: 'last_run_result', dataClass: 'has-text-centered', title: 'Last run', callback: runResult},
  {name: 'last_run_on', sortField: 'last_run_on', title: 'Last run on', callback: formatDateTime},
  {name: 'next_run', sortField: 'next_run', title: 'Next run', callback: formatDateTime},
  {name: 'step_count', sortField: 'step_count', dataClass: 'has-text-centered', title: 'Steps'},
  {name: 'schedule_count', sortField: 'schedule_count', dataClass: 'has-text-centered', title: 'Schedules'},
  {name: 'created_by', sortField: 'created_by', title: 'Created by'},
  {name: 'created_on', sortField: 'created_on', title: 'Created', callback: formatDateTime},
  {name: 'modified_by', sortField: 'created_by', title: 'Modified by'},
  {name: 'modified_on', sortField: 'modified_on', title: 'Modified', callback: formatDateTime}
];

function jobDescription (v) {
  return `<span class="icon has-text-info" data-tooltip="${v}"><i class="mdi mdi-information"></i></span>`;
}

function formatDateTime (v) {
  return utils.formatDateTime(v, config.tableDateTimeFormat, 'en');
}
function runResult (v) {
  let icon, color, tooltip;
  if(v !== null) {
    icon = v ? 'mdi mdi-checkbox-marked-circle' : 'mdi mdi-close-circle';
    color = v ? 'icon has-text-success' : 'icon has-text-danger';
    tooltip = v ? 'Success' : 'Failure';
    return `<span class="${color}" data-tooltip="${tooltip}"><i class="${icon}"></i></span>`;
  }
  else
    return '';   
}

function checkbox (v) {
  let tooltip = v ? 'Enabled' : 'Disabled';
  let icon = v ? 'mdi mdi-check-box-outline' : 'mdi mdi-checkbox-blank-outline';
  let color = v ? 'icon has-text-success' : 'icon has-text-grey';
  return `<span class="${color}" data-tooltip="${tooltip}"><i class="${icon}"></i></span>`;
}