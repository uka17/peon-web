let utils = require('../utils.js');

module.exports = 
[ 
  //name should be unique
  {name: '__slot:schedule-name', title: 'Name', sortField: 'name'},
  {name: 'enabled', sortField: 'enabled', dataClass: 'has-text-centered', title: 'Enabled', callback: utils.helpers.checkbox},
  //summary will be added in vueinstance as it is connected with data
  //{name: 'summary', title: 'Summary'}
];
