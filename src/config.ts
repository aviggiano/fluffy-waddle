import * as dotenv from "dotenv";
dotenv.config();

export default {
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  postgres: {
    host: process.env.POSTGRES_HOST!,
    port: Number(process.env.POSTGRES_PORT!),
    username: process.env.POSTGRES_USERNAME!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DATABASE!,
    logging: Boolean(process.env.POSTGRES_LOGGING ?? false),
  },
  reports: {
    maxAgeDays: 7,
  },
  explorer: {
    bscscanApiKey: process.env.BSCSCAN_API_KEY!,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY!,
    polygonscanApiKey: process.env.POLYGONSCAN_API_KEY!,
  },
};
