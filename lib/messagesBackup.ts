import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Message } from "./types";

/**
 * A single JSON snapshot of the messages table, overwritten on every
 * successful fetch and read back when Supabase is unreachable (paused free
 * tier, outage, missing env vars).
 *
 * Two locations, because serverless filesystems are read-only:
 *  - REPO_PATH is committed, so a deployed build always ships a snapshot.
 *  - TMP_PATH is the runtime refresh; it survives while an instance stays warm
 *    and is preferred when present, being the more recent of the two.
 */
const REPO_PATH = path.join(process.cwd(), "data", "messages-backup.json");
const TMP_PATH = path.join(os.tmpdir(), "tfw-messages-backup.json");

interface Snapshot {
  saved_at: string;
  messages: Message[];
}

/** Best effort — a backup that cannot be written must never break the page. */
export async function saveMessagesBackup(messages: Message[]): Promise<void> {
  // Never overwrite a good snapshot with an empty result
  if (messages.length === 0) return;

  const body = JSON.stringify(
    { saved_at: new Date().toISOString(), messages } satisfies Snapshot,
    null,
    2,
  );

  try {
    await mkdir(path.dirname(REPO_PATH), { recursive: true });
    await writeFile(REPO_PATH, body, "utf8");
  } catch {
    // Read-only filesystem (Vercel) — fall back to the instance's tmp dir
    try {
      await writeFile(TMP_PATH, body, "utf8");
    } catch {
      // Nowhere writable; the committed snapshot is still readable
    }
  }
}

async function read(file: string): Promise<Message[] | null> {
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));

    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as Snapshot).messages)
    ) {
      return (parsed as Snapshot).messages;
    }
    return null;
  } catch {
    return null;
  }
}

/** The most recent snapshot available, or null if there has never been one. */
export async function readMessagesBackup(): Promise<Message[] | null> {
  return (await read(TMP_PATH)) ?? (await read(REPO_PATH));
}
