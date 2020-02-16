module.exports = (language = 'en') => {
  return {
    onetime: {
      name: scheduleNameConstraint(language),    
      oneTime: {
        presence: {
          message: messages.schedule.oneTime[language],
          allowEmpty: false
        }
      }
    },
    daily: {

    }
  };
};

function scheduleNameConstraint(language) {
  return {
    presence: true,
    format: {
      pattern: /[\w_\-,\s]{1,100}/,
      message: messages.schedule.name[language]
    }
  };
}

const messages = {
  schedule: {
    name: {
      en: "^Schedule name must be a latin alphanumeric string (including spaces and symbols -_,), not longer than 100 chars",
      ru: "^Имя расписания должно быть латинской буквенно-цифровой строкой (включая пробелы и символы -_,), длиной не более 100 символов"
    },
    oneTime: {
      en: "^Schedule date and time should not be empty",
      ru: "^Дата и время расписания не могут быть пустыми"
    }                
  }
};