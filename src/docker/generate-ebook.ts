import database, { connect, Audit, Finding } from "fluffy-waddle-database";
import fs from "fs/promises";
import mkdirp from "mkdirp";
import cmd from "../cmd";
import { Logger } from "tslog";

const log = new Logger();

function sortBySeverity(a: Finding, b: Finding): number {
  const map = {
    high: 0,
    medium: 1,
    low: 2,
  };
  if (map[a.severity] < map[b.severity]) {
    return -1;
  } else if (map[a.severity] > map[b.severity]) {
    return 1;
  } else return 0;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function (): Promise<void> {
  log.info("generate-ebook start");
  await connect();
  const audits = await database.manager.find(Audit);

  const title = "The Auditor Book";
  const filename = "the-auditor-book";
  const dir = `/tmp/${filename}`;
  await mkdirp(dir);

  for (const audit of audits) {
    await fs.writeFile(`${dir}/${audit.name}-${0}.md`, `# ${audit.name}`);
    const findings = await database.manager.find(Finding, {
      where: {
        auditId: audit.id,
      },
    });
    await Promise.all(
      findings.sort(sortBySeverity).map(async (finding, index) => {
        const content = [
          `## [${finding.title} (${capitalize(finding.severity)})](${finding.url
            .replace("api.", "")
            .replace("repos/", "")})`,
          "\n\n",
          finding.body
            .split("\n")
            .map((line) => line.replace(/^#/g, "###"))
            .join("\n"),
        ].join("");
        await fs.writeFile(`${dir}/${audit.name}-${index + 1}.md`, content);
      })
    );
  }

  await cmd(
    `pandoc -o ${filename}.epub --metadata creator="fluffy-waddle" --metadata title="${title}" ${dir}/*.md --toc --from markdown-yaml_metadata_block`
  );

  log.info("generate-ebook end");
}
