import { RES_STATUS, TABLES } from "./../../constants/index";
import { executeSelectQuery } from "./../../db/queries";
import { TypedRequestBody } from "./../../interfaces/typedInterface";
import { Response } from "express";
import User from "../../models/userModel";
import {
  LoginRequestInterface,
  TypedRequest,
} from "../../interfaces/typedInterface";
import logger from "../../logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const log = logger(__filename);

async function loginController(
  req: TypedRequestBody<LoginRequestInterface>,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  const { userName, password } = req.body;

  // const user: User = await User.findOne({ userName: userName });
  try {
    const result = await executeSelectQuery(TABLES.USER, ["id, password"], {
      name: userName,
    });
    const user = result[0] as { id: number; password: string };
    if (!user) {
      return res.status(RES_STATUS.UNATHORIZED).send({
        accessToken: null,
        message: "No user found with given username",
      });
    }
    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(RES_STATUS.UNATHORIZED).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET
    );

    log.info("SUCCESSFUL_LOGIN_USER: ", userName);
    return res.status(RES_STATUS.OK).send({
      message: `${userName} successfully logged in`,
      accessToken: token,
    });
  } catch (error) {
    log.error("ERROR_LOGIN_USER", error.message);
    return res.status(RES_STATUS.BAD_GATEWAY).json({ message: error.message });
  }
}

export default loginController;
