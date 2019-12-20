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
  if(typeof direction !== 'boolean')
    throw new Error('direction should be boolean');
  if(typeof index !== 'number')
    throw new Error('index should be number');   
  if(!Array.isArray(list))
    throw new Error('list should be Array');  

  if(direction) {
    if(index > 0) {
      let buf = list[index - 1].order;

      Vue.set(list[index - 1], 'order', list[index].order);
      Vue.set(list[index], 'order', buf);
      
      swapElements(list, index - 1, index);
    }
  } else {
    if(index < list.length - 1) {
      let buf = list[index + 1].order;

      Vue.set(list[index + 1], 'order', list[index].order);
      Vue.set(list[index], 'order', buf);      

      swapElements(list, index + 1, index);
    }
  }
}
/**
 * Swap elements under provided indexes in list
 * @param {Array} list List of elements
 * @param {number} firstIndex First element index
 * @param {number} secondIndex Second element index
 */
function swapElements(list, firstIndex, secondIndex) {
  if(typeof secondIndex !== 'number')
    throw new Error('secondIndex should be number');
  if(typeof firstIndex !== 'number')
    throw new Error('firstIndex should be number');   
  if(!Array.isArray(list))
    throw new Error('list should be Array');   
    
    
  let buf = JSON.parse(JSON.stringify(list[firstIndex]));
  Vue.set(list, firstIndex, JSON.parse(JSON.stringify(list[secondIndex])));
  Vue.set(list, secondIndex, buf);
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








