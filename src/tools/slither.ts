import cmd from "../cmd";

export default async function (dir: string): Promise<string> {
  return cmd(`slither ${dir} 2>&1 || true`);
}
