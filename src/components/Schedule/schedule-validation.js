module.exports = (language = 'en') => {
  return {
    name: {
      presence: true,
      format: {
        pattern: /[\w_\-,\s]{1,100}/,
        message: messages.schedule.name[language]
      }
    }
  };
};

const messages = {
  schedule: {
    name: {
      en: "^Schedule name must be a latin alphanumeric string (including spaces and symbols -_,), not longer than 100 chars",
      ru: "^Имя расписания должно быть латинской буквенно-цифровой строкой (включая пробелы и символы -_,), длиной не более 100 символов"
    }          
  }
};