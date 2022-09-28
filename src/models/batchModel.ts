import { Schema, model, Types } from "mongoose";

interface Batch {
  products: Array<{ product: Types.ObjectId; count: number }>;
  action: string;
  user: Types.ObjectId;
}

const batchSchema = new Schema<Batch>({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      count: { type: Number, required: true },
      _id: false,
    },
  ],
  action: {
    type: String,
    enum: ["ADD", "DISPATCH", "DELETE"],
    message: "{VALUE} is not supported",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const BatchSchema = model<Batch>("Batch", batchSchema);

export default BatchSchema;
