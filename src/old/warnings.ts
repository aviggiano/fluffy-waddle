export enum erc20 {
  balanceOf = "balanceOf",
}

export enum oracle {
  getAmountsIn = "getAmountsIn",
  getAmountsOut = "getAmountsOut",
}

export const all = {
  ...oracle,
  ...erc20,
};

export function verify(code: string): Record<string, number>[] {
  const warnings = Object.keys(all)
    .map((warning) => ({
      [warning]: code.indexOf(`.${warning}`),
    }))
    .filter((e) => e[Object.keys(e)[0]] !== -1);
  return warnings;
}
