import { Contract } from "../database";
import cmd from "../cmd";
import { Explorer } from "./explorer";
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
  return cmd(
    `slither ${networks[explorer]}:${address} ${apiKeyNames[explorer]} ${apiKeyValues[explorer]} --exclude-informational --exclude-low --exclude-dependencies --exclude-optimization 2>&1 || true`
  );
}
