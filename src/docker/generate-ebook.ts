import database, { connect, Audit, Finding } from "fluffy-waddle-database";
import { Logger } from "tslog";

const log = new Logger();

export default async function (): Promise<void> {
  log.info("generate-ebook start");
  await connect();
  const audits = await database.manager.find(Audit);

  for (const audit of audits) {
    const findings = await database.manager.find(Finding, {
      where: {
        auditId: audit.id,
      },
    });
  }

  log.info("generate-ebook end");
}
