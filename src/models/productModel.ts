import { Schema, model } from "mongoose";

interface Product {
  name: string;
  price: number;
}

const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
});

const Product = model<Product>("Product", productSchema);

export default Product;
