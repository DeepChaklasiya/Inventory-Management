import { ROLES } from "./../constants/index";
import { Router } from "express";
import { requiredPermissions } from "../middlewares/userAuthorizationMiddleware";
import { verifyToken } from "../middlewares/userAuthorizationMiddleware";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";

const productRouter: Router = Router();

productRouter
  .route("/")
  .get(getProducts)
  .post(verifyToken, requiredPermissions([ROLES.ADMIN]), createProduct);

productRouter
  .route("/:productId")
  .get(verifyToken, requiredPermissions([ROLES.ADMIN]), getProduct)
  .patch(verifyToken, requiredPermissions([ROLES.ADMIN]), updateProduct)
  .delete(verifyToken, requiredPermissions([ROLES.ADMIN]), deleteProduct);

export default productRouter;
