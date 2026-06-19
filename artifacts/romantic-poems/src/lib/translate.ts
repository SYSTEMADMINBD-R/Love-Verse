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

function isBadTranslation(text: string): boolean {
  const upper = text.toUpperCase();
  return upper.includes("MYMEMORY WARNING") || upper.includes("YOU USED ALL AVAILABLE");
}

clearBadTranslationsOnLoad();

function clearBadTranslationsOnLoad() {
  const cache = loadCache();
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(cache)) {
    if (!isBadTranslation(v)) cleaned[k] = v;
  }
  saveCache(cleaned);
}

export async function translateToBangla(text: string): Promise<string> {
  if (!text.trim()) return text;

  const cache = loadCache();
  if (cache[text] && !isBadTranslation(cache[text])) return cache[text];

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|bn`;
    const res = await fetch(url);
    const data = await res.json();
    const translated: string = data?.responseData?.translatedText ?? text;

    if (isBadTranslation(translated)) {
      return text;
    }

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
