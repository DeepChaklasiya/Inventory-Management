import { Router } from "express";
import { verifyToken } from "../middlewares/userAuthorizationMiddleware";
import { BATCH_ACTION } from "../constants";
import { createBatch } from "../controllers/batchController";

const batchRouter: Router = Router();

// Access: All
batchRouter.route("/").get();

// Access: All
batchRouter
  .route("/add")
  .post(verifyToken, createBatch(BATCH_ACTION[BATCH_ACTION.ADD]));

// Access: Admin
batchRouter
  .route("/dispatch")
  .post(verifyToken, createBatch(BATCH_ACTION[BATCH_ACTION.DISPATCH]));

export default batchRouter;
