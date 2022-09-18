import axios from "axios";
import cmd from "../cmd";
import { parse } from "node-html-parser";
import { Logger } from "tslog";

const log = new Logger();

export type Explorer = "etherscan" | "bscscan" | "polygonscan";

export interface ExplorerContractVerified {
  Address: string;
  "Contract Name": string;
  Compiler: string;
  Version: string;
  Balance: string;
  Txns: string;
  Setting: string;
  Verified: string;
  Audited: string;
  License: string;
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

export async function getContractDir(dir: string): Promise<string> {
  return cmd(`find ${dir} -type d -d 1`);
}

export async function getSourceCode(
  explorer: Explorer,
  contractAddress: string,
  apiKey: string
): Promise<string> {
  log.debug({ network: explorer, contractAddress, apiKey });

  const url = `https://api.${explorer}.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
  log.debug(url);

  interface ApiResponse {
    status: string;
    message: string;
    result: [
      {
        SourceCode: string;
        ContractName: string;
      }
    ];
  }

  const {
    data: {
      result: [{ SourceCode: code }],
    },
  } = await axios.get<ApiResponse>(url);

  return code;
}

export async function listContractsVerified(
  explorer: Explorer,
  page: number
): Promise<ExplorerContractVerified[]> {
  const results: ExplorerContractVerified[] = [];
  const url = `https://${explorer}.com/contractsVerified/${page}`;
  log.debug(url);

  const { data } = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0",
    },
  });
  const html = parse(data);
  const table = html.querySelector("table");

  if (!table) {
    console.log({ url }, html.innerHTML);
    throw new Error("err");
  }
  const header = table!.querySelectorAll("thead > tr > th");
  const headerStrings = Array.from(header).map((e) => e.innerText.trim());
  const rows = table!.querySelectorAll("tbody > tr");
  const rowsObjects = rows.map((row) =>
    Array.from(row.querySelectorAll("td"))
      .map((td, index) => {
        const column = headerStrings[index];
        let value = td.innerHTML.trim();
        switch (true) {
          case column === "Address":
            value = parse(value).innerText.trim().toLowerCase();
            break;
          case column === "Version":
            value = parse(value).innerText.trim();
            break;
          case column === "Balance":
            value = parse(value).innerText.trim();
            break;
          case column === "Setting":
            value = Array.from(parse(value).querySelectorAll("span"))
              .map((span) => span.attrs.title)
              .sort()
              .join("; ");
            break;
        }
        return {
          [column]: value,
        };
      })
      .reduce((a, b) => ({ ...a, ...b }), {} as ExplorerContractVerified)
  );

  results.push(...rowsObjects);
  return results;
}
