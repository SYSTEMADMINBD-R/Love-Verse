import { createContext, useContext, useState, useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { ui } from "@/lib/i18n";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof ui["en"];
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: ui["en"],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("nocturne-lang");
      return stored === "bn" ? "bn" : "en";
    } catch {
      return "en";
    }
  });

  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem("nocturne-lang", l); } catch {}
  }

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: ui[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
