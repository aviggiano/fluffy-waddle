import axios from "axios";
import cmd from "../cmd";
import { parse } from "node-html-parser";
import { Logger } from "tslog";

const log = new Logger();

export type Explorer = "etherscan" | "bscscan" | "polygonscan";

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
  log.debug({ network: explorer, contractAddress, apiKey });

  const url = `https://api.${explorer}.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
  log.debug(url);

  const {
    data: {
      result: [{ SourceCode: code }],
    },
  } = await axios.get<ApiResponse>(url);

  return code;
}

export async function listContractsVerified(
  explorer: Explorer,
  pages = 20
): Promise<Record<string, string>[]> {
  const results: Record<string, string>[] = [];
  for (let page = 1; page <= pages; page++) {
    const url = `https://${explorer}.com/contractsVerified/${page}`;
    log.debug(url);

    const { data } = await axios.get(url);
    const html = parse(data);
    const table = html.querySelector("table");

    const header = table!.querySelectorAll("thead > tr > th");
    const headerStrings = Array.from(header).map((e) => e.innerText.trim());
    const rows = table!.querySelectorAll("tbody > tr");
    const rowsObjects = rows.map((row) =>
      Array.from(row.querySelectorAll("td"))
        .map((td, index) => {
          const column = headerStrings[index];
          let value = td.innerHTML.trim();
          if (column === "Address") {
            value = parse(value).innerText.trim().toLowerCase();
          } else if (column === "Version") {
            value = parse(value).innerText.trim();
          } else if (column === "Setting") {
            value = Array.from(parse(value).querySelectorAll("span"))
              .map((span) => span.attrs.title)
              .sort()
              .join("; ");
          }
          return {
            [column]: value,
          };
        })
        .reduce((a, b) => ({ ...a, ...b }), {})
    );

    results.push(...rowsObjects);
  }
  return results;
}
