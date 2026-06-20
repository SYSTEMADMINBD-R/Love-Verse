const CACHE_KEY = "nocturne-translations";

function loadCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export async function translateToBangla(text: string): Promise<string> {
  if (!text.trim()) return text;

  const cache = loadCache();
  if (cache[text]) return cache[text];

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return text;
    const data = await res.json() as { translated?: string };
    const translated = data.translated ?? text;
    cache[text] = translated;
    saveCache(cache);
    return translated;
  } catch {
    return text;
  }
}

export async function translateLines(lines: string[]): Promise<string[]> {
  const full = lines.join("\n");
  const translated = await translateToBangla(full);
  return translated.split("\n");
}
