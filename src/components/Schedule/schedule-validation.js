module.exports = (language = "en") => {
  return {
    onetime: {
      name: scheduleNameConstraint(language),
      oneTime: {
        presence: {
          message: messages.schedule.oneTime[language],
          allowEmpty: false,
        },
      },
    },
    daily: {
      name: scheduleNameConstraint(language),
      eachNDay: {
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 999,
          message: messages.schedule.notEmptyNumber[language],
        },
      },
    },
    weekly: {
      name: scheduleNameConstraint(language),
      eachNWeek: {
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 999,
          message: messages.schedule.notEmptyNumber[language],
        },
      },
      dayOfWeek: {
        length: {
          minimum: 1,
          message: messages.schedule.notEmptyWeekList[language],
        },
      },
    },
    monthly: {
      name: scheduleNameConstraint(language),
      day: {
        presence: true,
        format: {
          pattern: /((3[01]|[12][0-9]|[1-9]),)*(3[01]|[12][0-9]|[1-9])/,
          message: messages.schedule.dayList[language],
        },
      },
      month: {
        length: {
          minimum: 1,
          message: messages.schedule.notEmptyMonthList[language],
        },
      },
    },
    occursOnceAt: {
      occursOnceAt: timeVaidation(language),
    },
    every: {
      start: timeVaidation(language),
      end: timeVaidation(language),
    },
    intervalValue: {
      intervalValue: {
        numericality: {
          onlyInteger: true,
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 999,
          message: messages.schedule.notEmptyNumber[language],
        },
      },
    },
    startEndDateTime: {
      startDateTime: startDateTime(language),
      endDateTime: endDateTime(language),
    },
  };
};

function scheduleNameConstraint(language) {
  return {
    presence: true,
    format: {
      pattern: /[\w_\-,\s]{1,100}/,
      message: messages.schedule.name[language],
    },
  };
}

function startDateTime(language) {
  return {
    presence: {
      message: messages.schedule.startDateTime[language],
      allowEmpty: false,
    },
  };
}

function endDateTime(language) {
  return {
    presence: {
      message: messages.schedule.endDateTime[language],
      allowEmpty: false,
    },
  };
}

function timeVaidation(language) {
  return {
    presence: true,
    format: {
      pattern: /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/,
      message: messages.schedule.time[language],
    },
  };
}

const messages = {
  schedule: {
    name: {
      en: "^Schedule name must be a latin alphanumeric string (including spaces and symbols -_,), not longer than 100 chars",
      ru: "^Имя расписания должно быть латинской буквенно-цифровой строкой (включая пробелы и символы -_,), длиной не более 100 символов",
    },
    oneTime: {
      en: "^Schedule date and time should not be empty",
      ru: "^Дата и время расписания не могут быть пустыми",
    },
    startDateTime: {
      en: "^Schedule start date and time can not be empty",
      ru: "^Время начала действия расписания не может быть пустым",
    },
    endDateTime: {
      en: "^Schedule end date and time can not be empty",
      ru: "^Время окончания действия расписания не может быть пустым",
    },
    time: {
      en: "^Time can not be empty and should have HH:MM:SS format",
      ru: "^Время не может быть пустым и должно иметь формат HH:MM:SS",
    },
    notEmptyNumber: {
      en: "^Field value should be a number and can not be empty",
      ru: "^Значение поля должно быть числом и не может быть пустым",
    },
    notEmptyWeekList: {
      en: "^You should choose at least 1 day of week",
      ru: "^Необходимо выбрать хотя бы 1 день недели",
    },
    notEmptyMonthList: {
      en: "^You should choose at least 1 month",
      ru: "^Необходимо выбрать хотя бы 1 месяц",
    },
    dayList: {
      en: "^Month days enumeration should be a comma separated list (e.g. 1,13,29)",
      ru: "^Перечисление дней месяца должно быть списком через запятую (например, 1,13,29)",
    },
  },
};
