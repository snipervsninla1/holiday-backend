import { Router } from "express";
import { ServiceController } from "../controllers/Service/Service.controller";
import { handleFieldsValidation } from "../middlewares/validations/handler";
import { descriptionValidation, nameValidation } from "../middlewares/validations/entriesFields";
import { expressjwt } from "express-jwt";
import { DEFAULT_TOKEN_KEY, TOKEN_ENCRYPT_ALGO } from "../utils/constants";
import { initEnv } from "../../configEnv";
import { userHasRoles } from "../middlewares/validations/user/Roles";

initEnv();
const serviceRouter = Router();

serviceRouter
  .use(
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    })
  )
  .put(
    ["/:id/activate", "/:id/deactivate"],
    userHasRoles(["ADMIN"]),
    ServiceController.toggleService
  )
  .put(
    "/:id",
    nameValidation,
    descriptionValidation,
    handleFieldsValidation,
    ServiceController.edit
  )
  .route("")
  .post(
    userHasRoles(["ADMIN"]),
    nameValidation,
    descriptionValidation,
    handleFieldsValidation,
    ServiceController.createService
  )
  .get(
    userHasRoles(["ADMIN", "HUMAN_RESOURCE"], false),
    ServiceController.getAllServices
  );

export { serviceRouter };