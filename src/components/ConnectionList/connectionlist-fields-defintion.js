let utils = require('../utils.js');

module.exports = 
[           
  {name: '__slot:job-name', title: 'Name', sortField: 'name'},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: utils.helpers.checkbox},
  {name: 'summary', title: 'Summary'},  
  {name: 'type', sortField: 'type', title: 'Type'},
  {name: 'created_by', sortField: 'created_by', dataClass: 'default-cursor', title: 'Created by'},
  {name: 'created_on', sortField: 'created_on', dataClass: 'default-cursor', title: 'Created', callback: utils.helpers.formatDateTime},
  {name: 'modified_by', sortField: 'created_by', dataClass: 'default-cursor', title: 'Modified by'},
  {name: 'modified_on', sortField: 'modified_on', dataClass: 'default-cursor', title: 'Modified', callback: utils.helpers.formatDateTime}  
];