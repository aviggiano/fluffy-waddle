import cmd from "../cmd";

export async function findSolidityVersion(dir: string): Promise<string> {
  return cmd(
    `grep -r 'pragma solidity' ${dir} | awk -F'solidity' '{print $NF}' | sed 's/[\\^>=; ]//g' | sed 's/.*[<|]//g' | sort -n | tail -1`
  );
}

export async function selectSolidityVersion(version: string): Promise<string> {
  return cmd(`solc-select install ${version} && solc-select use ${version}`);
}
