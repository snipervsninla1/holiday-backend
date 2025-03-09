import { checkSchema } from "express-validator";
import dayjs from "dayjs";
import {
  COMMONS_ERRORS_CODES,
  EMPLOYEE_ERRORS_CODES, HOLIDAY_REQUEST_ERRORS_CODES, POST_ERRORS_CODES,
  ROLE_ERRORS_CODES,
  SERVICE_ERRORS_CODES
} from "../../entities/types";

const emailSchema = {
  email: {
    exists: {
      errorMessage: EMPLOYEE_ERRORS_CODES.EMAIL_REQUIRED
    },
    isEmail: {
      bail: true,
      errorMessage: EMPLOYEE_ERRORS_CODES.EMAIL_FORMAT,
      options: {
        allow_utf8_local_part: true,
        require_tld: true,
        ignore_max_length: true
      }
    },
    normalizeEmail: {
      options: {
        gmail_remove_subaddress: false,
        gmail_lowercase: true,
        gmail_remove_dots: false,
        gmail_convert_googlemaildotcom: true,
        outlookdotcom_lowercase: true,
        outlookdotcom_remove_subaddress: true,
        yahoo_lowercase: true,
        icloud_lowercase: true,
        icloud_remove_subaddress: true
      }
    }
  }
};
const emailValidation = checkSchema(emailSchema);

const passwordValidators = {
  exists: {
    errorMessage: EMPLOYEE_ERRORS_CODES.PASSWORD_REQUIRED
  },
  trim: true,
  isLength: {
    errorMessage: EMPLOYEE_ERRORS_CODES.PASSWORD_NUMBER_OF_CHARACTERS,
    options: {
      min: 6,
      max: 10
    }
  },
  matches: {
    errorMessage:
    EMPLOYEE_ERRORS_CODES.PASSWORD_FORMAT,
    options: new RegExp(
      "(^[\\w.-@]{8,10})",
      "g"
    )
  }
};
const passwordValidation = checkSchema({
  password: passwordValidators
});

const oldPasswordValidation = checkSchema({
  oldPassword: passwordValidators
});

const newPasswordValidation = checkSchema({
  newPassword: passwordValidators
});

const firstnameValidation = checkSchema({
  firstname: {
    exists: {
      errorMessage: EMPLOYEE_ERRORS_CODES.FIRSTNAME_REQUIRED
    },
    trim: true,
    isLength: {
      errorMessage: EMPLOYEE_ERRORS_CODES.FIRSTNAME_NUMBER_OF_CHARACTERS,
      options: { min: 2 }
    }
  }
});

const lastnameValidation = checkSchema({
  lastName: {
    exists: {
      errorMessage: EMPLOYEE_ERRORS_CODES.LASTNAME_REQUIRED
    },
    trim: true,
    isLength: {
      errorMessage: EMPLOYEE_ERRORS_CODES.LASTNAME_NUMBER_OF_CHARACTERS,
      options: { min: 2 }
    }
  }
});

const assertRequiredLoginFieldsAreNotEmpty = checkSchema({
  ...emailSchema,
  password: {
    exists: {
      errorMessage: EMPLOYEE_ERRORS_CODES.PASSWORD_REQUIRED
    },
    trim: true
  }
});

const nameSchema = {
  name: {
    notEmpty: {
      options: {
        ignore_whitespace: true
      },
      errorMessage: COMMONS_ERRORS_CODES.NAME_REQUIRED
    },
    exists: {
      errorMessage: COMMONS_ERRORS_CODES.NAME_REQUIRED
    },
    trim: true,
    isLength: {
      errorMessage: COMMONS_ERRORS_CODES.NAME_NUMBER_OF_CHARACTERS,
      options: { min: 2 }
    }
  }
};

const nameValidation = checkSchema(nameSchema);

const descriptionValidation = checkSchema({
  description: {
    exists: {
      errorMessage: COMMONS_ERRORS_CODES.DESCRIPTION_REQUIRED
    },
    notEmpty: {
      options: {
        ignore_whitespace: false
      },
      errorMessage: COMMONS_ERRORS_CODES.NAME_REQUIRED
    },
    trim: true,
    isLength: {
      errorMessage: COMMONS_ERRORS_CODES.DESCRIPTION_NUMBER_OF_CHARACTERS,
      options: { min: 10 }
    }
  }
});

const assertPostCreation = checkSchema({
  ...nameSchema,
  service: {
    notEmpty: {
      options: {
        ignore_whitespace: false
      },
      errorMessage: SERVICE_ERRORS_CODES.REQUIRED
    },
    exists: {
      errorMessage: SERVICE_ERRORS_CODES.MALFORMED
    }
  },
  "service.id": {
    exists: {
      errorMessage: "The id field is empty"
    }
  }
});

const rolesValidation = checkSchema({
  roles: {
    notEmpty: {
      errorMessage: ROLE_ERRORS_CODES.REQUIRED,
      options: {
        ignore_whitespace: true
      }
    },
    isArray: {
      options: {
        min: 1
      },
      errorMessage: ROLE_ERRORS_CODES.AN_ARRAY
    }
  }
});

const postsValidation = checkSchema({
  posts: {
    notEmpty: {
      errorMessage: POST_ERRORS_CODES.REQUIRED,
      options: {
        ignore_whitespace: true
      }
    },
    isArray: {
      options: {
        min: 1
      },
      errorMessage: POST_ERRORS_CODES.AN_ARRAY
    }
  }
});

const assertHolidayRequestCreation = checkSchema({
  type: {
    notEmpty: {
      options: {
        ignore_whitespace: false
      },
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.HOLIDAY_TYPE_REQUIRED
    },
    exists: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.HOLIDAY_TYPE_REQUIRED
    }
  },
  "type.id": {
    exists: {
      errorMessage: "The id field is empty"
    }
  },
  startingDate: {
    notEmpty: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.STARTING_DATE_REQUIRED
    },
    exists: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.STARTING_DATE_REQUIRED
    },
    trim: true,
    isDate: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.STARTING_DATE_MUST_BE_DATE,
      options: {
        strictMode: true,
        format: "YYYY-MM-DD"
      }
    },
    custom: {
      errorMessage:
      HOLIDAY_REQUEST_ERRORS_CODES.STARTING_DATE_MUST_HIGHER_THAN_ACTUAL,
      options: (value) => dayjs().isBefore(value)
    }
  },
  endingDate: {
    notEmpty: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.ENDING_DATE_REQUIRED
    },
    exists: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.ENDING_DATE_REQUIRED
    },
    trim: true,
    isDate: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.ENDING_DATE_MUST_BE_DATE,
      options: {
        strictMode: true,
        format: "YYYY-MM-DD"
      }
    },
    custom: {
      errorMessage:
      HOLIDAY_REQUEST_ERRORS_CODES.ENDING_DATE_MUST_HIGHER_THAN_STARTING_DATE,
      options: (value, { req: { body } }) =>
        dayjs(value).isAfter(body.startingDate)
    }
  },
  returningDate: {
    notEmpty: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.RETURNING_DATE_REQUIRED
    },
    exists: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.RETURNING_DATE_REQUIRED
    },
    trim: true,
    isDate: {
      errorMessage: HOLIDAY_REQUEST_ERRORS_CODES.RETURNING_DATE_MUST_BE_DATE,
      options: {
        strictMode: true,
        format: "YYYY-MM-DD"
      }
    },
    custom: {
      errorMessage:
      HOLIDAY_REQUEST_ERRORS_CODES.RETURNING_DATE_MUST_HIGHER_THAN_ENDING_DATE,
      options: (value, { req: { body } }) =>
        dayjs(value).isAfter(body.endingDate)

    }
  }
});

export {
  passwordValidation,
  emailValidation,
  firstnameValidation,
  lastnameValidation,
  nameValidation,
  descriptionValidation,
  rolesValidation,
  postsValidation,
  oldPasswordValidation,
  newPasswordValidation
};

export {
  assertRequiredLoginFieldsAreNotEmpty,
  assertPostCreation,
  assertHolidayRequestCreation
};