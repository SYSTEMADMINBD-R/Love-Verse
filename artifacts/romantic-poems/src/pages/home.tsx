import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { usePoems } from "@/lib/use-poems";
import { PenLine } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import type { Poem } from "@/lib/poems";
import { useTranslatedPoem } from "@/lib/use-translated-poem";

const SCROLL_KEY = "nocturne-scroll-pos";

function PoemCard({ poem, index }: { poem: Poem; index: number }) {
  const { lang, t } = useLang();
  const { title, lines, loading } = useTranslatedPoem(poem, lang);
  const serif = lang === "bn" ? "font-bengali" : "font-serif";
  const moodKey = poem.mood as keyof typeof t.moodNames;
  const mood = t.moodNames[moodKey] ?? poem.mood;
  const preview = lines.filter(l => l.trim() !== "").slice(0, 3).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
    >
      <Link href={`/poem/${poem.id}`} onClick={() => sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))}>
        <div className="group h-full p-8 border border-border/50 bg-card hover:border-primary/50 transition-colors duration-500 cursor-pointer flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <span className={`text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors ${serif}`}>
              {mood}
            </span>
            <span className="text-muted-foreground/30 font-serif italic text-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          {loading ? (
            <>
              <div className="h-7 w-3/4 bg-primary/10 animate-pulse rounded mb-4" />
              <div className="flex-1 space-y-2 mb-8">
                <div className="h-4 w-full bg-primary/5 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-primary/5 animate-pulse rounded" />
              </div>
            </>
          ) : (
            <>
              <h3 className={`text-2xl mb-4 group-hover:text-primary transition-colors ${serif}`}>
                {title}
              </h3>
              <div className={`flex-1 text-muted-foreground text-base italic mb-8 opacity-70 group-hover:opacity-100 transition-opacity line-clamp-4 leading-relaxed ${serif}`}>
                {preview}
              </div>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedSection({ poem }: { poem: Poem }) {
  const { lang, t } = useLang();
  const { title, lines, loading } = useTranslatedPoem(poem, lang);
  const serif = lang === "bn" ? "font-bengali" : "font-serif";

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-24 relative overflow-hidden bg-secondary/30">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto w-full text-center space-y-12"
      >
        <div className="space-y-4">
          <span className={`text-xs uppercase tracking-widest text-primary ${serif}`}>{t.featuredLabel}</span>
          {loading ? (
            <div className="h-12 w-64 mx-auto bg-primary/10 animate-pulse rounded" />
          ) : (
            <h2 className={`text-4xl md:text-5xl italic ${serif}`}>{title}</h2>
          )}
        </div>
        <div className={`space-y-6 text-xl md:text-3xl leading-relaxed text-foreground/90 ${serif}`}>
          {loading
            ? [1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-primary/10 animate-pulse rounded mx-auto" style={{ width: `${55 + i * 10}%` }} />
              ))
            : lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                >
                  {line}
                </motion.p>
              ))}
        </div>
        <div className="pt-8">
          <Link
            href={`/poem/${poem.id}`}
            className={`text-sm border-b border-primary/30 pb-1 text-primary hover:text-foreground transition-colors ${serif}`}
          >
            {t.featuredLink}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  const { allPoems } = usePoems();
  const featuredPoem = allPoems[2];
  const { lang, t } = useLang();
  const serif = lang === "bn" ? "font-bengali" : "font-serif";

  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      sessionStorage.removeItem(SCROLL_KEY);
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Hero */}
      <motion.section
        className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <p className={`text-primary text-sm uppercase tracking-[0.3em] ${serif}`}>{t.heroLabel}</p>
          <h1 className={`text-5xl md:text-7xl leading-tight ${serif}`}>
            {t.heroHeadline1} <br />
            <span className="italic text-muted-foreground">{t.heroHeadline2}</span>
          </h1>
          <p className={`text-lg text-muted-foreground font-light max-w-lg mx-auto leading-relaxed mt-8 ${serif}`}>
            {t.heroSubtitle}
          </p>
          <div className="pt-12">
            <a
              href="#collection"
              className={`inline-flex items-center justify-center border border-primary/30 text-primary px-8 py-4 uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500 ${serif}`}
            >
              {t.heroBtn}
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Featured */}
      <FeaturedSection poem={featuredPoem} />

      {/* Gallery */}
      <section id="collection" className="py-32 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-20 space-y-4">
          <h2 className={`text-4xl ${serif}`}>{t.collectionTitle}</h2>
          <p className={`text-muted-foreground font-light ${serif}`}>{t.collectionSub}</p>
          <div className="pt-4">
            <Link
              href="/add-poem"
              className={`inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-3 uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500 ${serif}`}
            >
              <PenLine className="w-3.5 h-3.5" />
              {t.addYourOwn}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPoems.map((poem, i) => (
            <PoemCard key={poem.id} poem={poem} index={i} />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-6 bg-secondary/20 border-t border-border/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <h2 className={`text-3xl italic text-primary ${serif}`}>{t.aboutTitle}</h2>
          <p className={`text-lg text-muted-foreground leading-relaxed font-light ${serif}`}>{t.aboutP1}</p>
          <p className={`text-lg text-muted-foreground leading-relaxed font-light ${serif}`}>{t.aboutP2}</p>
        </motion.div>
      </section>
    </div>
  );
}
