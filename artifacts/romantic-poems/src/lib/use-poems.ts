import { useState, useEffect, useCallback } from "react";
import { poems as builtInPoems, type Poem } from "./poems";

const STORAGE_KEY = "nocturne-user-poems";

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

async function fetchUserPoems(): Promise<Poem[]> {
  try {
    const res = await fetch("/api/poems");
    if (!res.ok) return [];
    const data = (await res.json()) as Poem[];
    saveCache(data);
    return data;
  } catch {
    return loadCache();
  }
}

export function usePoems() {
  const [userPoems, setUserPoems] = useState<Poem[]>(loadCache);

  useEffect(() => {
    fetchUserPoems().then(setUserPoems);
  }, []);

  const allPoems = [...builtInPoems, ...userPoems];

  const addPoem = useCallback(async (poem: Omit<Poem, "id">): Promise<string> => {
    const id = generateId(poem.title);
    const newPoem: Poem = { ...poem, id };

    const optimistic = [newPoem, ...loadCache()];
    saveCache(optimistic);
    setUserPoems(optimistic);

    try {
      await fetch("/api/poems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPoem),
      });
    } catch {
    }

    return id;
  }, []);

  const deletePoem = useCallback(async (id: string) => {
    setUserPoems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveCache(updated);
      return updated;
    });
    try {
      await fetch(`/api/poems/${id}`, { method: "DELETE" });
    } catch {
    }
  }, []);

  const isUserPoem = useCallback(
    (id: string) => userPoems.some((p) => p.id === id),
    [userPoems]
  );

  return { allPoems, userPoems, addPoem, deletePoem, isUserPoem };
}
