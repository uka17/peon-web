module.exports = (language = 'en') => {
  return {
    name: {
      presence: true,
      format: {
        pattern: /[\w_\-,\s]{1,100}/,
        message: messages.connection.name[language]
      }
    },
    host: {
      presence: {
        message: messages.connection.host[language],
        allowEmpty: false
      },
    },
    database: {
      presence: {
        message: messages.connection.database[language],
        allowEmpty: false
      },
    },    
    port: {
      presence: true,
	  numericality: {
	    onlyInteger: true,
	    greaterThan: 0,
        lessThan: 65536,
        noString: true,
        message: messages.connection.port[language]
	  }
    }		
  };
};

const messages = {
  connection: {
    name: {
      en: "^Connection name must be a latin alphanumeric string (including spaces and symbols -_,), not longer than 100 chars",
      ru: "^Имя подключения должно быть латинской буквенно-цифровой строкой (включая пробелы и символы -_,), длиной не более 100 символов"
    },
    host: {
      en: "^Host field can not be empty",
      ru: "^Укажите адрес"
    },
    database: {
      en: "^Database field can not be empty",
      ru: "^Укажите имя базы данных"
    },    
    port: {
      en: "^Port should be a number between 0 and 65535",
      ru: "^Порт должен быть числом от 0 до 65535"
    }     	
  }
};