let utils = require("../utils.js");

module.exports = [
  {
    name: "order",
    title: "Order",
    dataClass: "has-text-right default-cursor",
    callback: utils.helpers.order,
  },
  { name: "__slot:step-name", title: "Name", sortField: "name" },
  {
    name: "enabled",
    sortField: "enabled",
    dataClass: "has-text-centered default-cursor",
    title: "Enabled",
    callback: utils.helpers.checkbox,
  },
  {
    name: "retryAttempts",
    sortField: "retry",
    dataClass: "default-cursor",
    title: "Retry",
    callback: utils.helpers.retryAttempts,
  },
  {
    name: "onSucceed",
    sortField: "onsuccess",
    dataClass: "default-cursor",
    title: "On succeed",
    callback: utils.helpers.onStepResult,
  },
  {
    name: "onFailure",
    sortField: "onfailure",
    dataClass: "default-cursor",
    title: "On failure",
    callback: utils.helpers.onStepResult,
  },
];
