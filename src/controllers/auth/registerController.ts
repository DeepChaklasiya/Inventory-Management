import { executeInsertQuery, getInsertQuery } from "./../../db/queries";
import { RES_STATUS, TABLES } from "./../../constants/index";
import { Response } from "express";
import {
  TypedRequestBody,
  RegisterRequestInterface,
} from "./../../interfaces/typedInterface";
import User from "./../../models/userModel";
import bcrypt from "bcrypt";
import logger from "../../logger";
import App from "../../app";
const log = logger(__filename);

async function registerController(
  req: TypedRequestBody<RegisterRequestInterface>,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  const { userName, password, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    const userDetails = {
      name: userName,
      password: hashedPassword,
      phoneNumber: phoneNumber,
    };
    const result = await executeInsertQuery(TABLES.USER, userDetails);

    // const user: User = await new User(userDetails).save();
    log.info(`SUCCESSFUL_REGISTER_USER: ${userName}`);
    return res.status(RES_STATUS.CREATED).json({
      message: `New user ${userName} created!`,
      result,
    });
  } catch (error) {
    log.error({
      logMessage: "ERROR_REGISTER_USER",
      errorMessage: error.message,
    });
    return res.status(RES_STATUS.BAD_GATEWAY).json({ message: error.message });
  }
}

export { registerController };
