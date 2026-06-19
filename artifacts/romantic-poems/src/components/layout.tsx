import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/language-context";

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none fixed top-0 left-1/4 w-1/2 h-[50vh] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-1/2 h-[50vh] bg-amber-500/5 blur-[120px] rounded-full mix-blend-screen" />

      <header className="fixed top-0 w-full z-40 bg-background/50 backdrop-blur-sm border-b border-border/10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-widest text-primary hover:text-primary/80 transition-colors">
            {t.siteTitle}
          </Link>
          <nav className="flex items-center gap-6 md:gap-8">
            <Link href="/#collection" className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              {t.navCollection}
            </Link>
            <Link href="/#about" className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              {t.navAbout}
            </Link>
            <Link href="/add-poem" className="text-sm uppercase tracking-widest text-primary/70 hover:text-primary transition-colors">
              {t.navWrite}
            </Link>
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="text-xs uppercase tracking-widest border border-border/40 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300 px-3 py-1.5"
              title={lang === "en" ? "বাংলায় দেখুন" : "View in English"}
            >
              {lang === "en" ? "বাংলা" : "EN"}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      <footer className="py-10 border-t border-border/20 text-center space-y-2">
        <p className={`italic text-muted-foreground text-lg ${lang === "bn" ? "font-bengali" : "font-serif"}`}>
          {t.footer}
        </p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground/40">
          {t.madeBy}
        </p>
      </footer>
    </div>
  );
}
