import { Router } from "express";
import { PersonController } from "../controllers/Person/Person.controller";
import {
  assertRequiredLoginFieldsAreNotEmpty, emailValidation,
  firstnameValidation,
  lastnameValidation, newPasswordValidation, oldPasswordValidation,
  passwordValidation, postsValidation, rolesValidation
} from "../middlewares/validations/entriesFields";
import { handleFieldsValidation } from "../middlewares/validations/handler";
import { AdminController } from "../controllers/Person/Admin.controller";
import { userHasRoles } from "../middlewares/validations/user/Roles";
import { EmployeeController } from "../controllers/Person/Employee.controller";
import { expressjwt } from "express-jwt";
import { DEFAULT_TOKEN_KEY, TOKEN_ENCRYPT_ALGO } from "../utils/constants";

const personRouter = Router();

personRouter
  .post(
    "/login",
    assertRequiredLoginFieldsAreNotEmpty,
    handleFieldsValidation,
    PersonController.login
  )
  .post(
    "/config/administrator",
    firstnameValidation,
    lastnameValidation,
    passwordValidation,
    emailValidation,
    handleFieldsValidation,
    AdminController.createAdmin
  )
  .get(
    "/:id",
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    }),
    PersonController.getById
  )
  .put(
    "/update-password",
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    }),
    oldPasswordValidation,
    newPasswordValidation,
    handleFieldsValidation,
    userHasRoles(["ADMIN", "HUMAN_RESOURCE", "EMPLOYEE"], false),
    PersonController.updatePassword
  )
  .route("")
  .post(
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    }),
    firstnameValidation,
    lastnameValidation,
    emailValidation,
    passwordValidation,
    rolesValidation,
    postsValidation,
    handleFieldsValidation,
    userHasRoles(["ADMIN", "HUMAN_RESOURCE"], false),
    EmployeeController.create
  )
  .get(
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    }),
    userHasRoles(["ADMIN", "HUMAN_RESOURCE"], false),
    PersonController.getAll
  );


export { personRouter };