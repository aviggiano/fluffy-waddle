import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  events: [
    {
      schedule: {
        rate: ["rate(1 minute)"],
      },
    },
  ],
};
