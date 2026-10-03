import { useState, useEffect, useCallback } from "react";
import { poems as builtInPoems, type Poem } from "./poems";
import { useAdminAuth } from "@/contexts/admin-auth-context";

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

async function ensureResponseOk(response: Response): Promise<void> {
  if (response.ok) return;
  const payload = (await response.json().catch(() => null)) as
    | { error?: unknown }
    | null;
  throw new Error(
    typeof payload?.error === "string"
      ? payload.error
      : `Request failed (${response.status})`,
  );
}

async function postPoem(poem: Poem): Promise<void> {
  const response = await fetch("/api/poems", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(poem),
  });
  await ensureResponseOk(response);
}

async function loadAndMigratePoems(allowLocalMigration: boolean): Promise<Poem[]> {
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
  let shouldUpdateCache = alreadyMigrated;
  if (!alreadyMigrated && allowLocalMigration) {
    const local = loadCache();
    let migrationSucceeded = true;
    if (local.length > 0) {
      const dbIds = new Set(dbPoems.map((p) => p.id));
      const toMigrate = local.filter((p) => !dbIds.has(p.id));
      for (const poem of toMigrate) {
        try {
          await postPoem(poem);
          dbPoems = [poem, ...dbPoems];
        } catch {
          migrationSucceeded = false;
        }
      }
    }
    if (migrationSucceeded) {
      localStorage.setItem(MIGRATED_KEY, "true");
      shouldUpdateCache = true;
    }
  }

  if (shouldUpdateCache) saveCache(dbPoems);
  return dbPoems;
}

export function usePoems() {
  const { authenticated } = useAdminAuth();
  const [userPoems, setUserPoems] = useState<Poem[]>(loadCache);

  useEffect(() => {
    loadAndMigratePoems(authenticated).then(setUserPoems);
  }, [authenticated]);

  const allPoems = [...builtInPoems, ...userPoems];

  const addPoem = useCallback(async (poem: Omit<Poem, "id">): Promise<string> => {
    const id = generateId(poem.title);
    const newPoem: Poem = { ...poem, id };

    await postPoem(newPoem);
    setUserPoems((prev) => {
      const updated = [newPoem, ...prev];
      saveCache(updated);
      return updated;
    });

    return id;
  }, []);

  const updatePoem = useCallback(async (id: string, updates: Partial<Omit<Poem, "id">>) => {
    const response = await fetch(`/api/poems/${id}`, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await ensureResponseOk(response);

    setUserPoems((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveCache(updated);
      return updated;
    });
  }, []);

  const deletePoem = useCallback(async (id: string) => {
    const response = await fetch(`/api/poems/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    await ensureResponseOk(response);

    setUserPoems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveCache(updated);
      return updated;
    });
  }, []);

  const isUserPoem = useCallback(
    (id: string) => userPoems.some((p) => p.id === id),
    [userPoems]
  );

  const refreshPoems = useCallback(async () => {
    const fresh = await loadAndMigratePoems(authenticated);
    setUserPoems(fresh);
  }, [authenticated]);

  return { allPoems, userPoems, addPoem, updatePoem, deletePoem, isUserPoem, refreshPoems };
}
