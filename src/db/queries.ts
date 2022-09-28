import { QUERY_OPERATOR } from "../constants";
import App from "../app";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export const getInsertQuery = (tableName: string, dataObject: any): string => {
  let columnName: string = "";
  let values: string = "";

  Object.entries(dataObject).forEach((dataItem) => {
    if (columnName.length > 0) {
      columnName += ", ";
      values += ", ";
    }
    columnName += `${dataItem[0]}`;
    values += `'${dataItem[1]}'`;
  });
  return `INSERT INTO ${tableName} (${columnName}) VALUES (${values});`;
};

export const getSelectQuery = (
  tableName: string,
  columnArray: Array<string>,
  conditionObject: any
): string => {
  let columnNames: string = "";

  columnArray.forEach((columnName) => {
    if (columnNames.length > 0) {
      columnNames += ", ";
    }
    columnNames += `${columnName}`;
  });

  return `SELECT ${columnNames} FROM ${tableName} WHERE ${getAndOrNotConditions(
    conditionObject
  )};`;
};

export const getUpdateQuery = (
  tableName: string,
  updateObject: any,
  conditionObject: any
): string => {
  let columnValues: string = "";

  Object.entries(updateObject).forEach((updateItem) => {
    if (columnValues.length > 0) {
      columnValues += ", ";
    }
    columnValues += `${updateItem[0]}='${updateItem[1]}'`;
  });

  return `UPDATE ${tableName} SET ${columnValues} WHERE ${getAndOrNotConditions(
    conditionObject
  )};`;
};

const getAndOrNotConditions = (
  conditionObject: any,
  operator: QUERY_OPERATOR = QUERY_OPERATOR.AND
): string => {
  let resultCondition: string = "";
  if (operator === QUERY_OPERATOR.AND || operator === QUERY_OPERATOR.OR) {
    Object.entries(conditionObject).forEach((conditionItem) => {
      let condition: string = "";

      if (conditionItem[0] === "or") {
        condition = getAndOrNotConditions(conditionItem[1], QUERY_OPERATOR.OR);
      } else if (conditionItem[0] === "not") {
        condition = getAndOrNotConditions(conditionItem[1], QUERY_OPERATOR.NOT);
      } else {
        condition = `${conditionItem[0]}='${conditionItem[1]}'`;
      }

      if (resultCondition.length > 0) {
        resultCondition += operator === QUERY_OPERATOR.AND ? " AND " : " OR ";
      }

      resultCondition += "(" + condition + ")";
    });
  } else {
    resultCondition +=
      "NOT " + getAndOrNotConditions(conditionObject, QUERY_OPERATOR.AND);
  }
  return resultCondition;
};

export const executeInsertQuery = async (
  tableName: string,
  dataObject: any
) => {
  try {
    const [result] = await App.connection.query(
      getInsertQuery(tableName, dataObject)
    );
    return result as ResultSetHeader;
  } catch (error) {
    throw error;
  }
};

export const executeSelectQuery = async (
  tableName: string,
  columnArray: Array<string>,
  conditionObject: any
): Promise<RowDataPacket[]> => {
  try {
    const [row] = await App.connection.query(
      getSelectQuery(tableName, columnArray, conditionObject)
    );
    return row as RowDataPacket[];
  } catch (error) {
    throw error;
  }
};

export const executeUpdateQuery = async (
  tableName: string,
  updateObject: any,
  conditionObject: any
) => {
  try {
    const [result] = await App.connection.query(
      getUpdateQuery(tableName, updateObject, conditionObject)
    );
    return result as ResultSetHeader;
  } catch (error) {
    throw error;
  }
};
