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
    }            
  }
};