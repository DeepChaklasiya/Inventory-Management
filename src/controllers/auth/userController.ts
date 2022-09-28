import { executeUpdateQuery } from "./../../db/queries";
import { Response } from "express";
import User from "../../models/userModel";
import { TypedRequest } from "../../interfaces/typedInterface";
import logger from "../../logger";
import { TABLES } from "../../constants";
import { executeSelectQuery } from "../../db/queries";

const log = logger(__filename);

async function getUserData(
  req: TypedRequest<any, any>,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  const requiredUserId = req.params.userId;
  try {
    // const requiredUser = await User.findById(requiredUserId);
    const result = await executeSelectQuery(
      TABLES.USER,
      ["id, name, role, phoneNumber"],
      {
        id: requiredUserId,
      }
    );
    const requiredUser = result[0];
    return res.status(200).send({ user: requiredUser });
  } catch (error) {
    log.error({
      logMessage: "ERROR_GETTING_USER_DATA",
      errorMessage: error.message,
    });
    return res
      .status(500)
      .send({ message: "Error in getting data from database", error: error });
  }
}

async function patchUserData(
  req: TypedRequest<any, any>,
  res: Response
): Promise<Response<any, Record<string, any>>> {
  try {
    const userId = req.params.userId;
    const updateUserData = req.body;
    // await User.findByIdAndUpdate(userId, updateUserData);
    const result = await executeUpdateQuery(TABLES.USER, updateUserData, {
      id: userId,
    });
    return res
      .status(200)
      .send({ message: "Successfully update user data", result });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error in updating user", error: error });
  }
}

export { getUserData, patchUserData };
