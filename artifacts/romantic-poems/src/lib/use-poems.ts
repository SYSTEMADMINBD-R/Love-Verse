import { useState, useEffect, useCallback } from "react";
import { poems as builtInPoems, type Poem } from "./poems";

const STORAGE_KEY = "nocturne-user-poems";
const MIGRATED_KEY = "nocturne-migrated-v1";

function generateId(title: string): string {
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "poem";
  return slug + "-" + Date.now();
}

function loadCache(): Poem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Poem[]) : [];
  } catch {
    return [];
  }
}

function saveCache(poems: Poem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
  } catch {}
}

async function postPoem(poem: Poem): Promise<void> {
  await fetch("/api/poems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(poem),
  });
}

async function loadAndMigratePoems(): Promise<Poem[]> {
  let dbPoems: Poem[] = [];
  let fetchOk = false;

  try {
    const res = await fetch("/api/poems");
    if (res.ok) {
      dbPoems = (await res.json()) as Poem[];
      fetchOk = true;
    }
  } catch {
    // network error — fall back to cache
  }

  if (!fetchOk) {
    return loadCache();
  }

  const alreadyMigrated = localStorage.getItem(MIGRATED_KEY) === "true";
  if (!alreadyMigrated) {
    const local = loadCache();
    if (local.length > 0) {
      const dbIds = new Set(dbPoems.map((p) => p.id));
      const toMigrate = local.filter((p) => !dbIds.has(p.id));
      for (const poem of toMigrate) {
        try {
          await postPoem(poem);
          dbPoems = [poem, ...dbPoems];
        } catch {
          // ignore individual failures
        }
      }
    }
    localStorage.setItem(MIGRATED_KEY, "true");
  }

  saveCache(dbPoems);
  return dbPoems;
}

export function usePoems() {
  const [userPoems, setUserPoems] = useState<Poem[]>(loadCache);

  useEffect(() => {
    loadAndMigratePoems().then(setUserPoems);
  }, []);

  const allPoems = [...builtInPoems, ...userPoems];

  const addPoem = useCallback(async (poem: Omit<Poem, "id">): Promise<string> => {
    const id = generateId(poem.title);
    const newPoem: Poem = { ...poem, id };

    setUserPoems((prev) => {
      const updated = [newPoem, ...prev];
      saveCache(updated);
      return updated;
    });

    try {
      await postPoem(newPoem);
    } catch {
      // still works from cache
    }

    return id;
  }, []);

  const updatePoem = useCallback(async (id: string, updates: Partial<Omit<Poem, "id">>) => {
    setUserPoems((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveCache(updated);
      return updated;
    });
    try {
      await fetch(`/api/poems/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch {}
  }, []);

  const deletePoem = useCallback(async (id: string) => {
    setUserPoems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveCache(updated);
      return updated;
    });
    try {
      await fetch(`/api/poems/${id}`, { method: "DELETE" });
    } catch {}
  }, []);

  const isUserPoem = useCallback(
    (id: string) => userPoems.some((p) => p.id === id),
    [userPoems]
  );

  const refreshPoems = useCallback(async () => {
    const fresh = await loadAndMigratePoems();
    setUserPoems(fresh);
  }, []);

  return { allPoems, userPoems, addPoem, updatePoem, deletePoem, isUserPoem, refreshPoems };
}
