import { initEnv } from "../../configEnv";
import { Router } from "express";
import { expressjwt } from "express-jwt";
import { DEFAULT_TOKEN_KEY, TOKEN_ENCRYPT_ALGO } from "../utils/constants";
import { userHasRoles } from "../middlewares/validations/user/Roles";
import { nameValidation } from "../middlewares/validations/entriesFields";
import { handleFieldsValidation } from "../middlewares/validations/handler";
import { HolidayTypeController } from "../controllers/HolidayType/HolidayType.controller";

initEnv();
const holidayTypeRouter = Router();

holidayTypeRouter
  .use(
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    })
  )
  .route("")
  .post(
    userHasRoles(["ADMIN", "HUMAN_RESOURCE"], false),
    nameValidation,
    handleFieldsValidation,
    HolidayTypeController.create
  ).get(
    userHasRoles(["ADMIN", "HUMAN_RESOURCE", "EMPLOYEE"], false),
    HolidayTypeController.getAll
  );

export { holidayTypeRouter };