import type { Handler } from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

export const middyfy = (handler: Handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
