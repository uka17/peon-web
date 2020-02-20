let config = require('./config.js');
let Vue = require('vue/dist/vue.js');
module.exports.EventBus = new Vue();

/**
 * Allows to put only numeric values into input field
 * @param {event} event Key press event
 */
function isNumber(event) {
  let keyCode = (event.keyCode ? event.keyCode : event.which);
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { 
    event.preventDefault();
  }
}
module.exports.isNumber = isNumber;
/**
 * Checks if provided value is a valid 24H time
 * @param {string} value Time value
 * @returns {Boolean} `true` in case if `value` is a vlid 24H time in format HH:MM:SS, `false` in other case
 */  
function is24HTime(value) {
  return /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/.test(value);
}
module.exports.is24HTime = is24HTime;

/**
 * Replace string with truncated in case if length is more than `len` and adds at the end
 * @param {string} val String which should be truncated
 * @param {number} len Maximal length. All characters after will be cut and replaced with ...
 * @returns {string} Truncated string
 */
function truncateString(val, len) {
  if(typeof val !== 'string')
    throw new TypeError('val should be a string');
  if(typeof len !== 'number' || isNaN(parseInt(len)))
    throw new TypeError('len should be a number');     
  if(val.length > len)
    return `${val.substr(0, len)}...`;
  else
    return val;
}
module.exports.truncateString = truncateString;

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
module.exports.formatDateTime = formatDateTime;

/**
 * Moves element under index and changes it' order accordingly to provided direction
 * @param {Array} list Object list to be edited
 * @param {number} index Index of element which should be moved
 * @param {boolean} direction Direction of move `true` - up, `false` - down
 */
function moveListElement(list, index, direction) {  
  if(typeof direction !== 'boolean')
    throw new TypeError('direction should be boolean');
  if(typeof index !== 'number' || isNaN(parseInt(index)))
    throw new TypeError('index should be a number');   
  if(!Array.isArray(list))
    throw new TypeError('list should be an Array');  

  if(direction) {
    if(index > 0) {     
      swapElements(list, index - 1, index);
      reorderElements(list);
    }
  } else {
    if(index < list.length - 1) {
      swapElements(list, index + 1, index);
      reorderElements(list);
    }
  }
}
module.exports.moveListElement = moveListElement;

/**
 * Changes `order` value of each element in `list` accordingly their native order in list
 * @param {Array} list List of elements which should be reordered 
 */
function reorderElements(list) {
  if(!Array.isArray(list))
    throw new TypeError('list should be an Array');

  for (let index = 0; index < list.length; index++) {
    list[index].order = index + 1;    
  }
}
module.exports.reorderElements = reorderElements;

/**
 * Swap elements under provided indexes in list
 * @param {Array} list List of elements
 * @param {number} firstIndex First element index
 * @param {number} secondIndex Second element index
 */
function swapElements(list, firstIndex, secondIndex) {
  if(typeof secondIndex !== 'number' || isNaN(parseInt(secondIndex)))
    throw new TypeError('secondIndex should be a number');
  if(typeof firstIndex !== 'number' || isNaN(parseInt(firstIndex)))
    throw new TypeError('firstIndex should be a number');   
  if(!Array.isArray(list))
    throw new TypeError('list should be an Array');   
    
    
  let buf = JSON.parse(JSON.stringify(list[firstIndex]));
  Vue.set(list, firstIndex, JSON.parse(JSON.stringify(list[secondIndex])));
  Vue.set(list, secondIndex, buf);
}
module.exports.swapElements = swapElements;

/**
 * Parces `errorObject` to string representation
 * @param {object} errorObject Error object
 * @returns {string} String representation of API error
 */
function parceApiError(errorObject) {
  let errorMessage = errorObject;  
  if(errorObject.response.data !== undefined) {
    if(errorObject.response.data.logId !== undefined)
      errorMessage = `${errorObject.response.data.error} LogId: ${errorObject.response.data.logId}`;
    else
      errorMessage = errorObject.response.data;
  }
  
  return errorMessage;
}
module.exports.parceApiError = parceApiError;


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
  info: /*istanbul ignore next*/ function (v) {
    return `<span data-tooltip="${v}"><i class="mdi mdi-information-outline"></i></span>`;
  },
  link: /*istanbul ignore next*/ function (v) {
    return `<a>${v}</a>`;
  },
  formatDateTime: /*istanbul ignore next*/ function (v) {
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
      /*istanbul ignore next*/
      default:
        return '';
      }
    }
  }
};








