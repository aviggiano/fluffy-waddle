import cmd from "../cmd";
import { Explorer, Contract } from "fluffy-waddle-database";
import config from "../config";

type SlitherNetwork =
  | "mainet"
  | "ropsten"
  | "kovan"
  | "rinkeby"
  | "goerli"
  | "tobalaba"
  | "bsc"
  | "testnet.bsc"
  | "arbi"
  | "testnet.arbi"
  | "poly"
  | "avax"
  | "testnet.avax"
  | "ftm";

export default async function (contract: Contract): Promise<string> {
  const {
    blockchain: { explorer },
    address,
  } = contract;

  const networks: Record<Explorer, SlitherNetwork> = {
    bscscan: "bsc",
    polygonscan: "poly",
    etherscan: "mainet",
  };
  const apiKeyNames: Record<Explorer, string> = {
    bscscan: "--bscan-apikey",
    polygonscan: "--polygonscan-apikey",
    etherscan: "--etherscan-apikey",
  };
  const apiKeyValues: Record<Explorer, string> = {
    bscscan: config.explorer.bscscanApiKey,
    polygonscan: config.explorer.polygonscanApiKey,
    etherscan: config.explorer.etherscanApiKey,
  };
  const output = `/tmp/${explorer}:${address}`;
  return cmd(
    `slither ${networks[explorer]}:${address} ${apiKeyNames[explorer]} ${apiKeyValues[explorer]} --json ${output} 2>/dev/null || true && cat ${output} | jq -c && rm ${output}`
  );
}
