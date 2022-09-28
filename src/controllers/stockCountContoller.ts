import { BATCH_ACTION } from "./../constants/index";
import { Response } from "express";
import Stock from "../models/stockModel";
import { TypedRequest, TypedResponse } from "../interfaces/typedInterface";
import EventEmitter from "events";
import logger from "../logger";
const stockCountEventEmitter = new EventEmitter();
const log = logger(__filename);

const getStocksCount = async (
  req: TypedRequest<any, any>,
  res: Response
): Promise<TypedResponse<Stock[]>> => {
  try {
    const stocks: Stock[] = await Stock.find();
    return res.status(200).send({ stocks });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Error in getting stocks data", error });
  }
};

const updateStocksCount =
  (action: string) =>
  async (batch: {
    products: { productId: any; count: any; user: any }[];
    user: any;
  }) => {
    const updatedStocks: Array<Stock> = [];
    let options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };
    try {
      batch.products.forEach(
        async (product: { productId: any; count: any; user: any }) => {
          const updatedStock: Stock = await Stock.findOneAndUpdate(
            { _id: product.productId },
            {
              $inc: {
                count:
                  action === BATCH_ACTION[BATCH_ACTION.ADD]
                    ? product.count
                    : -1 * Math.abs(product.count),
              },
              lastUpdatedBy: batch.user,
            },
            options
          );
          updatedStocks.push(updatedStock);
        }
      );
    } catch (error) {
      throw error;
    }
    return updatedStocks;
  };

stockCountEventEmitter.on(
  BATCH_ACTION[BATCH_ACTION.ADD],
  updateStocksCount(BATCH_ACTION[BATCH_ACTION.ADD])
);
stockCountEventEmitter.on(
  BATCH_ACTION[BATCH_ACTION.DISPATCH],
  updateStocksCount(BATCH_ACTION[BATCH_ACTION.DISPATCH])
);

export { getStocksCount, stockCountEventEmitter };
