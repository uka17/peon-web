const validate = require('validate.js')

/**
 * 
 * @param {string} field Name of field to validat
 * @param {Object} source Object to check {field: value}
 * @param {Object} constraints Object describes verification rules {field: { rule1: value1, rule2: value2... }}
 * @returns {string} '' in case if everything is Ok, otherwise - string message with verifcation error
 */
module.exports.fieldIsValid = function(field, source, constraints) {
  const result = validate(source, constraints);
  if(result && result.hasOwnProperty(field))
    return result[field][0];
  else
    return '';
}