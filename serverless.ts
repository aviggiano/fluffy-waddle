import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import monitorContracts from "@functions/monitor-contracts";
import generateStatistics from "@functions/generate-statistics";
import getFindingsCode4rena from "@functions/get-findings-code4rena";

const serverlessConfiguration: AWS = {
  service: "fluffy-waddle",
  frameworkVersion: "2",
  plugins: ["serverless-plugin-typescript", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
    timeout: 900,
  },
  functions: {
    hello,
    monitorContracts,
    generateStatistics,
    getFindingsCode4rena,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
