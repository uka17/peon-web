const validate = require('validate.js')

module.exports.fieldIsValid = function(field, source, constraints) {
  const result = validate(source, constraints);
  console.log({ constraints, result, source })
  if(result && result.hasOwnProperty(field))
    return result[field][0];
  else
    return '';
}