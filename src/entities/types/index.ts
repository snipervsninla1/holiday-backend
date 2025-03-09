import { components } from "./DTO";

//EmployeeController
type EmployeeForCreation = components["schemas"]["EmployeeDTOForCreation"];
type EmployeeForLogin = components["schemas"]["EmployeeDTOForLogin"];
type EmployeeForUpdate = components["schemas"]["EmployeeDTOForUpdate"];
type EmployeeType = components["schemas"]["EmployeeDTO"];
type EmployeeToken = components["schemas"]["EmployeeTokenDTO"];
type EmployeeUpdatePassword = components["schemas"]["EmployeeDTOForUpdatePassword"];

interface EmployeeDTOForCreation extends EmployeeForCreation {}
interface EmployeeTokenDTO extends EmployeeToken {}
interface EmployeeDTO extends EmployeeType {}
interface EmployeeDTOForLogin extends EmployeeForLogin {}
interface EmployeeDTOForUpdate extends EmployeeForUpdate {}
interface EmployeeDTOForUpdatePassword extends EmployeeUpdatePassword {}

//Holiday Request
type HolidayRequestType = components["schemas"]["HolidayRequestDTO"];

type HolidayTypeDTO = components["schemas"]["HolidayTypeDTO"];

interface HolidayRequestDTO extends HolidayRequestType {}

//Service
type ServiceType = components["schemas"]["ServiceDTO"];
interface ServiceDTO extends ServiceType {}

// POST
type PostType = components["schemas"]["PostDTO"];
interface PostDTO extends PostType {}

// ROLE
type Role = components["schemas"]["RoleDTO"];
interface RoleDTO extends Role {}
enum USER_ROLE {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE",
    HUMAN_RESOURCE = "HUMAN_RESOURCE"
}

enum HolidayStatusDTO {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

// Setting
type Setting = components["schemas"]["SettingDTO"];
interface SettingDTO extends Setting {}

// Errors
enum COMMONS_ERRORS_CODES {
  BAD_REQUEST = "HOLIDAY-4000",
  NOT_FOUND = "HOLIDAY-4004",
  CONFLICTS = "HOLIDAY-4009",
  NAME_REQUIRED = "HOLIDAY-3009",
  NAME_NUMBER_OF_CHARACTERS = "HOLIDAY-3010",
  DESCRIPTION_REQUIRED = "HOLIDAY-3011",
  DESCRIPTION_NUMBER_OF_CHARACTERS = "HOLIDAY-3012",
  ALREADY_IN_THAT_STATE = "HOLIDAY-3029",
  FAILED_OPERATION = "HOLIDAY-5001",
  UNPROCESSABLE_OPERATION = "HOLIDAY-4022",
  PASSWORD_ARE_SAME = "HOLIDAY-3041",
  WRONG_PASSWORD = "HOLIDAY-3042"
}

enum EMPLOYEE_ERRORS_CODES {
  FIRSTNAME_REQUIRED = "HOLIDAY-3000",
  FIRSTNAME_NUMBER_OF_CHARACTERS = "HOLIDAY-3001",
  EMAIL_REQUIRED = "HOLIDAY-3002",
  EMAIL_FORMAT = "HOLIDAY-3003",
  PASSWORD_REQUIRED = "HOLIDAY-3004",
  PASSWORD_FORMAT = "HOLIDAY-3005",
  PASSWORD_NUMBER_OF_CHARACTERS = "HOLIDAY-3006",
  LASTNAME_REQUIRED = "HOLIDAY-3007",
  LASTNAME_NUMBER_OF_CHARACTERS = "HOLIDAY-3008",
  EXISTED_EMAIL = "HOLIDAY-3035",
  EXISTED_LASTNAME = "HOLIDAY-3034",
  UNAUTHORIZED = "HOLIDAY-4001"
}

enum ROLE_ERRORS_CODES {
  NOT_FOUND = "HOLIDAY-3033",
  REQUIRED = "HOLIDAY-3013",
  AN_ARRAY = "HOLIDAY-3014",
}

enum SERVICE_ERRORS_CODES {
  REQUIRED = "HOLIDAY-3015",
  MALFORMED = "HOLIDAY-3016",
  NOT_FOUND = "HOLIDAY-3030",
  NOT_ACTIVE = "HOLIDAY-3032",
  ANOTHER_EXIST_WITH_SAME_NAME = "HOLIDAY-3043",
  IS_ACTIVE = "HOLIDAY-3044"
}

enum POST_ERRORS_CODES {
  REQUIRED = "HOLIDAY-3017",
  AN_ARRAY = "HOLIDAY-3018",
  NOT_FOUND = "HOLIDAY-3031",
  NOT_ACTIVE = "HOLIDAY-3036"
}

enum HOLIDAY_TYPE_ERRORS_CODES {
  NOT_FOUND = "HOLIDAY-3037",
  ALREADY_EXIST = "HOLIDAY-3040"
}

enum HOLIDAY_REQUEST_ERRORS_CODES {
  HOLIDAY_TYPE_REQUIRED = "HOLIDAY-3019",
  STARTING_DATE_REQUIRED = "HOLIDAY-3020",
  ENDING_DATE_REQUIRED = "HOLIDAY-3023",
  RETURNING_DATE_REQUIRED = "HOLIDAY-3026",
  STARTING_DATE_MUST_BE_DATE = "HOLIDAY-3021",
  ENDING_DATE_MUST_BE_DATE = "HOLIDAY-3024",
  RETURNING_DATE_MUST_BE_DATE = "HOLIDAY-3027",
  STARTING_DATE_MUST_HIGHER_THAN_ACTUAL = "HOLIDAY-3022",
  ENDING_DATE_MUST_HIGHER_THAN_STARTING_DATE = "HOLIDAY-3025",
  RETURNING_DATE_MUST_HIGHER_THAN_ENDING_DATE = "HOLIDAY-3028",
  STARTING_DATE_ALREADY_EXIST = "HOLIDAY-3038",
  NOT_FOUND = "HOLIDAY-3039"
}

// EXPORTS TYPE
export { 
  EmployeeDTOForCreation,
  EmployeeTokenDTO,
  EmployeeDTO,
  EmployeeDTOForLogin,
  EmployeeDTOForUpdate,
  HolidayRequestDTO,
  ServiceDTO,
  PostDTO,
  RoleDTO,
  SettingDTO,
  HolidayTypeDTO,
  EmployeeDTOForUpdatePassword
};

// EXPORT ENUM
export { USER_ROLE, HolidayStatusDTO };

//export errors
export {
  EMPLOYEE_ERRORS_CODES,
  ROLE_ERRORS_CODES,
  COMMONS_ERRORS_CODES,
  SERVICE_ERRORS_CODES,
  POST_ERRORS_CODES,
  HOLIDAY_REQUEST_ERRORS_CODES,
  HOLIDAY_TYPE_ERRORS_CODES
};
