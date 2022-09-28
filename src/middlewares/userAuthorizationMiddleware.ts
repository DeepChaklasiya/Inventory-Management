import { executeSelectQuery } from './../db/queries';
import { ROLES, TABLES } from "./../constants/index";
import { NextFunction, Response } from "express";
import { X_ACCESS_TOKEN } from "../constants";
import {
  TypedRequest,
  RegisterRequestInterface,
  TypedRequestBody,
} from "./../interfaces/typedInterface";
import logger from "../logger";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

const log = logger(__filename);
const verifyToken = (
  req: TypedRequest<any, any>,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers[X_ACCESS_TOKEN];
  if (!token) {
    return res.status(403).send({ message: "User is not loggedin!" });
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, decoded: { userId: any }) => {
      if (err) {
        return res
          .status(401)
          .send({ message: "User is unauthorized!", error: err });
      }
      req.userId = decoded.userId;
      next();
    }
  );
};

const requiredPermissions: Function =
  (permissions: Array<ROLES>): Function =>
  async (
    req: TypedRequest<any, RegisterRequestInterface>,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.userId;
    try {
      // const user: User = await User.findById(userId);
    const result = await executeSelectQuery(
      TABLES.USER,
      ["name, role"],
      { id: userId }
    );
    const user = result[0];
      const roleFound = permissions.find(
        (role) => ROLES[role].toString() === user.role
      );
      if (!roleFound) {
        return res.status(403).send({
          message: `${user.name} does not have required permissions`,
        });
      }
      next();
    } catch (error) {
      log.error(`UNCAUGHT_ERROR ${error}`);
      return res.status(400).send({
        message: `Uncaught error`,
        error,
      });
    }
  };

export { verifyToken, requiredPermissions };
