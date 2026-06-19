import { useState, useEffect } from "react";
import type { Poem } from "./poems";
import { translateToBangla, translateLines } from "./translate";

type TranslatedPoem = {
  title: string;
  lines: string[];
  loading: boolean;
};

export function useTranslatedPoem(poem: Poem | undefined, lang: string): TranslatedPoem {
  const [bnTitle, setBnTitle] = useState<string | null>(null);
  const [bnLines, setBnLines] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const needsTranslation = lang === "bn" && poem && !poem.bnTitle && !poem.bnLines;

  useEffect(() => {
    if (!poem) return;
    if (lang !== "bn") {
      setBnTitle(null);
      setBnLines(null);
      return;
    }
    if (poem.bnTitle && poem.bnLines) {
      setBnTitle(poem.bnTitle);
      setBnLines(poem.bnLines);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([
      translateToBangla(poem.title),
      translateLines(poem.lines),
    ]).then(([title, lines]) => {
      if (!cancelled) {
        setBnTitle(title);
        setBnLines(lines);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [poem?.id, lang]);

  if (!poem) return { title: "", lines: [], loading: false };

  if (lang === "bn") {
    const displayTitle = bnTitle ?? poem.bnTitle ?? poem.title;
    const displayLines = bnLines ?? poem.bnLines ?? poem.lines;
    return { title: displayTitle, lines: displayLines, loading: needsTranslation ? loading : false };
  }

  return { title: poem.title, lines: poem.lines, loading: false };
}
