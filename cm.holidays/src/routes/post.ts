import { Router } from "express";
import { handleFieldsValidation } from "../middlewares/validations/handler";
import { assertPostCreation } from "../middlewares/validations/entriesFields";
import { expressjwt } from "express-jwt";
import { DEFAULT_TOKEN_KEY, TOKEN_ENCRYPT_ALGO } from "../utils/constants";
import { initEnv } from "../../configEnv";
import { userHasRoles } from "../middlewares/validations/user/Roles";
import { PostController } from "../controllers/Service/Post.controller";

initEnv();
const postRouter = Router();

postRouter
  .use(
    expressjwt({
      secret: process.env.TOKEN_KEY ?? DEFAULT_TOKEN_KEY,
      algorithms: [TOKEN_ENCRYPT_ALGO]
    })
  )
  .get(
    "/service/:id",
    userHasRoles(["ADMIN", "HUMAN_RESOURCE"], false),
    PostController.getPostByServiceId
  )
  .put(
    ["/:id/activate", "/:id/deactivate"],
    userHasRoles(["ADMIN"]),
    PostController.togglePost
  )
  .put(
    "/:id",
    assertPostCreation,
    handleFieldsValidation,
    PostController.edit
  )
  .route("")
  .get(
    userHasRoles(["ADMIN"]),
    PostController.getAll
  )
  .post(
    userHasRoles(["ADMIN"]),
    assertPostCreation,
    handleFieldsValidation,
    PostController.create
  );

export { postRouter };