import cmd from "../cmd";

export async function slither(dir: string): Promise<string> {
  return cmd(`slither ${dir} 2>&1 || true`);
}
