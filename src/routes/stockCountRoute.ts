import { Router } from "express";
import { getStocksCount } from "../controllers/stockCountContoller";

const stockCountRouter: Router = Router();

// Access: All
stockCountRouter.route("/").get(getStocksCount);

export default stockCountRouter;
