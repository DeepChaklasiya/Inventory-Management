import { Send, Query } from "express-serve-static-core";
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export interface TypedRequest<T extends Query, U> extends Express.Request {
  userId?: any;
  body: U;
  query: T;
  headers: any;
  params: any;
}

export interface TypedResponse<ResBody> extends Express.Response {
  status: any;
  json: Send<ResBody, this>;
}

export interface RegisterRequestInterface {
  userName: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequestInterface {
  userName: string;
  password: string;
}
