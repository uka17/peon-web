let utils = require('../utils.js');

module.exports = 
[ 
  //name should be unique
  {name: '__slot:schedule-name', title: 'Name', sortField: 'name'},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: utils.helpers.checkbox},
  {name: '__slot:schedule-summary', title: 'Summary'},
];
