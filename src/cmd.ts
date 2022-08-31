import { exec } from "child_process";

export default async function (cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
      console.log(error, stdout, stderr);
      if (error) {
        reject(error);
      } else {
        resolve(stdout.replace("\r\n", ""));
      }
    });
  });
}
