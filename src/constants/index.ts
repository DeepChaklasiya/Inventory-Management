export const X_ACCESS_TOKEN: string = "x-access-token";

export enum ROLES {
  ADMIN = 1,
  WORKER,
  UNKNOWN,
}

export enum BATCH_ACTION {
  ADD = 1,
  DISPATCH,
}

/**
 * Use the following link to find appropriate status code
 * Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * Link: https://restfulapi.net/http-status-codes/
 */
export const RES_STATUS = {
  SWITCH_PROTOCOL: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQ: 400,
  UNATHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
  NOT_SUPPORTED: 501,
  BAD_GATEWAY: 502,
};

export const enum QUERY_OPERATOR {
  AND = 1,
  OR,
  NOT,
}

export const TABLES = {
  USER: "User",
  PRODUCT: "Product",
  BATCH_PRODUCT: "BatchProduct",
  PRODUCT_STOCK: "ProductStock",
  BATCH: "Batch",
};
