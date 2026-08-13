import neo4j, {
  type Driver,
  type Session,
} from "neo4j-driver";

import config from "./config";

let driver: Driver | null = null;

// ============================================================
// GET COGNODB DRIVER
// ============================================================

export function getCognoDBDriver(): Driver {
  if (driver) {
    return driver;
  }

  if (!config.url) {
    throw new Error("COGNODB_URL is not configured");
  }

  if (!config.username) {
    throw new Error("COGNODB_USERNAME is not configured");
  }

  if (!config.password) {
    throw new Error("COGNODB_PASSWORD is not configured");
  }

  driver = neo4j.driver(
    config.url,
    neo4j.auth.basic(
      config.username,
      config.password
    )
  );

  return driver;
}

// ============================================================
// GET COGNODB SESSION
// ============================================================

export function getCognoDBSession(): Session {
  const driver = getCognoDBDriver();

  return driver.session({
    database: config.database,
  });
}

// ============================================================
// CLOSE COGNODB CONNECTION
// ============================================================

export async function closeCognoDBConnection(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}