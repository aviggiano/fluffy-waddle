import axios from "axios";
import cmd from "./cmd";

export type Explorer = "etherscan" | "bscscan" | "polygonscan";

export enum explorerUrls {
  etherscan = "https://api.etherscan.io/api",
  bscscan = "https://api.bscscan.com/api",
  polygonscan = "https://api.polygonscan.com/api",
}

export interface ApiResponse {
  status: string;
  message: string;
  result: [
    {
      SourceCode: string;
      ContractName: string;
    }
  ];
}

export async function downloadSourceCode(
  explorer: string,
  contractAddress: string,
  outDir = "out"
): Promise<string> {
  return cmd(
    `npx ethereum-sources-downloader ${explorer} ${contractAddress} ${outDir}`
  );
}

export async function getSourceCode(
  explorer: Explorer,
  contractAddress: string,
  apiKey: string
): Promise<string> {
  console.log({ network: explorer, contractAddress, apiKey });

  const url = `${explorerUrls[explorer]}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
  console.log({ url });

  const {
    data: {
      result: [{ SourceCode: code }],
    },
  } = await axios.get<ApiResponse>(url);

  return code;
}
