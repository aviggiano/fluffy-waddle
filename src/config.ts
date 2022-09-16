import * as dotenv from "dotenv";
dotenv.config();

export default {
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
};
