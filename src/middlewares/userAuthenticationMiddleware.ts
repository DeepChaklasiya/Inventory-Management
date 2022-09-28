import { RowDataPacket } from "mysql2";
import {
  executeSelectQuery,
  executeUpdateQuery,
  getSelectQuery,
} from "./../db/queries";
import { ROLES, TABLES } from "./../constants/index";
import { NextFunction, Response } from "express";
import { isEmptyObject, validateIndianPhoneNumber } from "../utils";
import {
  TypedRequestBody,
  RegisterRequestInterface,
  TypedRequest,
  LoginRequestInterface,
} from "./../interfaces/typedInterface";
import logger from "../logger";
import User from "../models/userModel";
import App from "../app";
const log = logger(__filename);

const registration = (
  req: TypedRequestBody<RegisterRequestInterface>,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  const { userName, password, phoneNumber } = req.body;
  if (
    !userName ||
    !password ||
    !phoneNumber ||
    !validateIndianPhoneNumber(phoneNumber)
  ) {
    log.info(`INVALID_REGISTRATION_REQUEST: %s`, req.body);
    return res.status(400).json({
      message: "Please send valid User name, Password, and Phone number",
    });
  }
  next();
};

const login = (
  req: TypedRequestBody<LoginRequestInterface>,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    log.info(`INVALID_LOGIN_REQUEST: %s`, req.body);
    return res.status(400).json({
      message: "Please send valid User name and Password",
    });
  }
  next();
};

const patchUser = (
  req: TypedRequest<any, any>,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  const data = req.body;
  const filteredData: {
    [key: string]: any;
  } = {};
  if (data.hasOwnProperty("password")) {
    return res.status(400).json({
      message: "Cannot update password, please use forgot or update password",
    });
  }

  if (data.hasOwnProperty("userName")) {
    filteredData.name = req.body.userName;
  }

  if (data.hasOwnProperty("phoneNumber")) {
    if (validateIndianPhoneNumber(req.body.phoneNumber) === false) {
      return res.status(400).json({
        message: "Please provide valid phone number",
      });
    }
    filteredData.phoneNumber = req.body.phoneNumber;
  }

  if (data.hasOwnProperty("role")) {
    if (ROLES.hasOwnProperty(req.body.role)) {
      filteredData.role = req.body.role;
    } else {
      return res.status(400).json({
        message: "Please provide valid user role",
      });
    }
  }
  if (isEmptyObject(filteredData)) {
    return res.status(400).json({
      message: "Please provide non empty data",
    });
  }
  req.body = filteredData;
  next();
};

const checkDuplicateUser = async (
  req: TypedRequestBody<RegisterRequestInterface>,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
  const { userName, phoneNumber } = req.body;
  // const duplicateUser = await User.find({
  //   $or: [{ userName: userName }, { phoneNumber: phoneNumber }],
  // }).count();

  const result = await executeSelectQuery(TABLES.USER, ["COUNT(*) as count"], {
    or: { name: userName, phoneNumber: phoneNumber },
  });

  const { count } = result[0];

  if (count > 0) {
    log.info("DUPLICATE_USER_REGISTER_REQUEST_FOUND");
    return res.status(409).json({
      message:
        "Username or Phone number already exist. Provide different username and phonenumber",
    });
  }
  next();
};

const validateRequestData = {
  registration,
  login,
  patchUser,
};

export { validateRequestData, checkDuplicateUser };
