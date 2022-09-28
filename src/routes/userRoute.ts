import { ROLES } from "./../constants/index";
import { Router } from "express";
import {
  checkDuplicateUser,
  validateRequestData,
} from "../middlewares/userAuthenticationMiddleware";
import { registerController } from "../controllers/auth/registerController";
import loginController from "../controllers/auth/loginController";
import {
  requiredPermissions,
  verifyToken,
} from "../middlewares/userAuthorizationMiddleware";
import { getUserData, patchUserData } from "../controllers/auth/userController";

const userRouter: Router = Router();

userRouter.route("/").get();
userRouter
  .route("/register")
  .post(
    validateRequestData.registration,
    checkDuplicateUser,
    registerController
  );
userRouter
  .route("/:userId")
  .get(verifyToken, requiredPermissions([ROLES.ADMIN]), getUserData)
  .patch(
    verifyToken,
    requiredPermissions([ROLES.ADMIN]),
    validateRequestData.patchUser,
    patchUserData
  );
userRouter.route("/login").post(validateRequestData.login, loginController);

export default userRouter;
