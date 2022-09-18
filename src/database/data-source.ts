import "reflect-metadata";
import { DataSource } from "typeorm";

import config from "../config";

export const AppDataSource = new DataSource({
  type: "postgres",
  ...config.postgres,
  synchronize: false,
  entities: [__dirname + "/**/*.entity.{js,ts}"],
});
