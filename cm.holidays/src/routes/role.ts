import { initEnv } from "../../configEnv";
import { Router } from "express";
import { expressjwt } from "express-jwt";
import { DEFAULT_TOKEN_KEY, TOKEN_ENCRYPT_ALGO } from "../utils/constants";
import { userHasRoles } from "../middlewares/validations/user/Roles";
import { RoleController } from "../controllers/Role/Role.controller";

initEnv();
const roleRouter = Router();

roleRouter
  .use( 
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    }))
  .route("")
  .get(
    userHasRoles(["ADMIN", "HUMAN_RESOURCE"], false),
    RoleController.getAll
  );

export { roleRouter };