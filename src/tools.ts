import cmd from "./cmd";

export async function findSolidityVersion(dir: string): Promise<string> {
  return cmd(
    `grep -rHn 'pragma solidity' ${dir} | awk -F'solidity' '{print $NF}' | sed 's/[\\^>=; ]//g' | sort -n | tail -1`
  );
}

export async function selectSolidityVersion(version: string): Promise<string> {
  return cmd(`solc-select install ${version} && solc-select use ${version}`);
}

export async function slither(dir: string): Promise<string> {
  return cmd(`slither ${dir} || true`);
}
