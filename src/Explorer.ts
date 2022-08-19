import axios from "axios";

export type Network = "etherscan" | "bscscan" | "polygonscan";

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

export async function getSourceCode(): Promise<string> {
  const network = process.env.NETWORK as Network;
  const contractAddress = process.env.CONTRACT_ADDRESS as string;
  const apiKey = process.env.API_KEY as string;

  console.log({ network, contractAddress, apiKey });

  const url = `${explorerUrls[network]}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
  console.log({ url });

  const {
    data: {
      result: [{ SourceCode: code }],
    },
  } = await axios.get<ApiResponse>(url);

  return code;
}
