// Translations are handled server-side at save time (stored in DB as bnTitle/bnLines).
// This module is kept for any future use but no longer makes API calls on-demand.

const CACHE_KEY = "nocturne-translations-v2";
const OLD_CACHE_KEY = "nocturne-translations";

// Wipe old caches from previous approaches
try { localStorage.removeItem(OLD_CACHE_KEY); } catch {}
try { localStorage.removeItem(CACHE_KEY); } catch {}

// No-op: translations are pre-stored in the database now
export async function translateToBangla(text: string): Promise<string> {
  return text;
}

export async function translateLines(lines: string[]): Promise<string[]> {
  return lines;
}
