let config = require('./config.js');
let Vue = require('vue/dist/vue.js');

/**
 * Converts `date-time` into appropriate format
 * @param {string} value `string` representation of `date-time`. E.g. `2019-05-26T12:55:20.042693`
 * @param {object} options Format of output for `date-time` value
 * @param {string} locale Locale of `date-time`. E.g. `en`
 */
function formatDateTime(value, options, locale) {  
  let dateTime = new Date(value);
  return value === null ? '' : dateTime.toLocaleString(locale, options);  
}

/**
 * Moves element under index and changes it' order accordingly to provided direction
 * @param {Array} list Object list to be edited
 * @param {number} index Index of element which should be moved
 * @param {boolean} direction Direction of move `true` - up, `false` - down
 */
function moveListElement(list, index, direction) {  
  let i = index - 1;
  console.log(list, i);  
  //Element at the begining or at the end of the list
  if(list.length == i - 1 || i == 0)
    return;
  if(!direction) {
    let buf = list[i + 1];
    Vue.set(list, i + 1, list[i]);
    Vue.set(list, i, buf);

    Vue.set(list[i + 1], 'order', list[i].order);
    Vue.set(list[i], 'order', list[i + 1].order);
  } else {
    let buf = list[i - 1];
    Vue.set(list, i - 1, list[i]);
    Vue.set(list, i, buf);

    Vue.set(list[i - 1], 'order', list[i].order);
    Vue.set(list[i], 'order', list[i - 1].order);
  }
  console.log(list);
}

module.exports.moveListElement = moveListElement;

module.exports.helpers = {
  checkbox: function (v) {
    let tooltip = v ? 'Enabled' : 'Disabled';
    let icon = v ? 'mdi mdi-check-box-outline' : 'mdi mdi-checkbox-blank-outline';
    return `<span title="${tooltip}"><i class="${icon}"></i></span>`;
  },
  runResult: function (v) {
    let icon, color, tooltip;
    if(v !== null) {
      icon = v ? 'mdi mdi-checkbox-marked-circle' : 'mdi mdi-close-circle';
      color = v ? 'icon has-text-success' : 'icon has-text-danger';
      tooltip = v ? 'Success' : 'Failure';
      return `<span class="${color}" title="${tooltip}"><i class="${icon}"></i></span>`;
    }
    else
      return '';   
  },
  info: function (v) {
    return `<span class="icon has-text-info" data-tooltip="${v}"><i class="mdi mdi-information"></i></span>`;
  },
  link: function (v) {
    return `<a>${v}</a>`;
  },
  formatDateTime: function (v) {
    return formatDateTime(v, config.tableDateTimeFormat, 'en');
  },
  retryAttempts: function (v) {
    if(v.interval) {
      return `${v.number} per each ${v.interval} minute(s)`;
    } else 
      return 'No retry';
  },
  onStepResult: function (v) {
    if(typeof v == 'object') {
      return `Go to step ${v.gotoStep}`;
    }
    else {
      switch (v) {
      case 'gotoNextStep':
        return 'Go to next step';
      case 'quitWithSuccess':
        return 'Quit with success';
      case 'quitWithFailure':
        return 'Quit with failure';
      default:
        return '';
      }
    }
  }
};








