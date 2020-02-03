module.exports = (language = 'en') => {
  return {
    name: {
      presence: true,
      format: {
        pattern: /[\w_\-,\s]{1,100}/,
        message: messages.step.name[language]
      }
    },
    command: {
      presence: {
        message: messages.step.command[language],
        allowEmpty: false
      }
    },
    "retryAttempts.number": {
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 10,
        message: messages.step.retryAttempts.number[language]
      }
    },
    "retryAttempts.interval": {
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        message: messages.step.retryAttempts.interval[language]
      }
    }        
  };
};

const messages = {
  step: {
    name: {
      en: "^Step name must be a latin alphanumeric string (including spaces and symbols -_,), not longer than 100 chars",
      ru: "^Имя шага должно быть латинской буквенно-цифровой строкой (включая пробелы и символы -_,), длиной не более 100 символов"
    },
    command: {
      en: "^Field can not be empty",
      ru: "^Поле не может быть пустым"
    },
    retryAttempts: {
      number: {
        en: "^Retry attempts number must be greater than or equal to zero and less than 11",
        ru: "^Число повторных попыток должно быть больше и равно нулю и меньше 11"
      },
      interval: {
        en: "^Retry attempt interval must be greater than 0",
        ru: "^Интервал между попытками должен быть больше 0"
      }
    }            
  }
};