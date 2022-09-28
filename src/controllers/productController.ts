import { Response } from "express";
import { TypedRequest, TypedResponse } from "../interfaces/typedInterface";
import Product from "../models/productModel";
const getProducts = async (req: TypedRequest<any, any>, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).send({ products });
  } catch (error) {
    res.status(400).send({ message: "Error in getting products data", error });
  }
};

const createProduct = async (req: TypedRequest<any, any>, res: Response) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({ message: "Invalide product name" });
  }
  try {
    const productData: Product = {
      name: req.body.name,
      price: req.body?.price,
    };
    const product = await new Product(productData).save();
    res.status(200).send({ message: "Product create successfully", product });
  } catch (error) {
    res.status(400).send({ message: "Error in creating products data", error });
  }
};

const getProduct = async (req: TypedRequest<any, any>, res: Response) => {
  const productId: string = req.params.productId;

  try {
    const product: Product = await Product.findById(productId);
    res.status(200).send({ product });
  } catch (error) {
    res.status(400).send({ message: "Error in getting product", error });
  }
};

const updateProduct = async (req: TypedRequest<any, any>, res: Response) => {
  const productId: string = req.params.productId;
  const productData: Product = req.body;
  try {
    await Product.findByIdAndUpdate(productId, productData);
    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error in updating product", error });
  }
};

const deleteProduct = async (req: TypedRequest<any, any>, res: Response) => {
  const productId: string = req.params.productId;

  try {
    await Product.findByIdAndDelete(productId);
    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error in deleting product", error });
  }
};

export { getProducts, createProduct, updateProduct, deleteProduct, getProduct };
