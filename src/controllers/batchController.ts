import { BATCH_ACTION } from "./../constants/index";
import { Response } from "express";
import Batch from "../models/batchModel";
import { TypedRequest, TypedResponse } from "../interfaces/typedInterface";
import logger from "../logger";
import Product from "../models/productModel";
import User from "../models/userModel";
const log = logger(__filename);
import App from "../app";
import { stockCountEventEmitter } from "./stockCountContoller";
import mongoose from "mongoose";

const validateDataBatch = async (data: {
  products: any[];
  user: string;
}): Promise<boolean> => {
  const getUser = await User.findById(data.user);
  if (!getUser) return false;
  return data.products.reduce(
    async (result: boolean, product: { productId: string; count: number }) => {
      const getProduct = await Product.findById(product.productId);
      if (!getProduct) return false;
      if (product.count <= 0) return false;
      return result;
    },
    true
  );
};
const createBatch =
  (action: string) => async (req: TypedRequest<any, any>, res: Response) => {
    const batch = req.body;
    batch.user = req.userId;
    batch.action = action;
    log.info("Batch: %s", batch);
    try {
      const validData: boolean = await validateDataBatch(batch);

      if (validData === false) {
        return res.status(400).send({ message: "Invalid request data" });
      }
    } catch (error) {
      return res.status(400).send({
        message: "Error in request data, please send valide data",
        error,
      });
    }
    try {
      const updatedStocks = stockCountEventEmitter.emit(batch.action, batch);
      const createdBatch = await Batch.create(batch);

      return res.status(200).send({ createdBatch, action, updatedStocks });
    } catch (error) {
      return res
        .status(400)
        .send({ message: "Error in creating batch", error });
    }
  };

export { createBatch };
