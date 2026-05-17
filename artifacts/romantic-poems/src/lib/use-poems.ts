import { useState, useEffect, useCallback } from "react";
import { poems as builtInPoems, type Poem } from "./poems";

const STORAGE_KEY = "nocturne-user-poems";

function loadUserPoems(): Poem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Poem[]) : [];
  } catch {
    return [];
  }
}

function saveUserPoems(poems: Poem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
}

export function usePoems() {
  const [userPoems, setUserPoems] = useState<Poem[]>(loadUserPoems);

  const allPoems = [...builtInPoems, ...userPoems];

  const addPoem = useCallback((poem: Omit<Poem, "id">) => {
    const id =
      poem.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now();
    const newPoem: Poem = { ...poem, id };
    setUserPoems((prev) => {
      const updated = [newPoem, ...prev];
      saveUserPoems(updated);
      return updated;
    });
    return id;
  }, []);

  const deletePoem = useCallback((id: string) => {
    setUserPoems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveUserPoems(updated);
      return updated;
    });
  }, []);

  const isUserPoem = useCallback(
    (id: string) => userPoems.some((p) => p.id === id),
    [userPoems]
  );

  return { allPoems, userPoems, addPoem, deletePoem, isUserPoem };
}
