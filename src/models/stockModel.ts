import { Schema, model, Types } from "mongoose";

interface Stock {
  product: Types.ObjectId;
  count: number;
  lastUpdatedBy: Types.ObjectId;
}

const StockSchema = new Schema<Stock>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  count: {
    type: Number,
    min: 0,
    validate: {
      validator: function (v: number) {
        if (Number.isInteger(v) && v >= 0) return true;
        return false;
      },
      message: "{VALUE} is not an positive integer value",
    },
  },
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Stock = model<Stock>("Stock", StockSchema);

export default Stock;
