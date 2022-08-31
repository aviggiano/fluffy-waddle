import cmd from "../cmd";

export async function md5(dir: string): Promise<string> {
  return cmd(
    `find ${dir} -type f -exec md5sum {} \\; | sort -k 2 | md5sum | sed 's/ .*//g'`
  );
}
