import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { usePoems } from "@/lib/use-poems";
import { useLang } from "@/contexts/language-context";

const MOOD_KEYS = ["longing", "tender", "passion", "devotion", "heartbreak", "joy"] as const;

export default function AddPoem() {
  const [, navigate] = useLocation();
  const { addPoem } = usePoems();
  const { lang, t } = useLang();

  const [title, setTitle] = useState("");
  const [bnTitle, setBnTitle] = useState("");
  const [mood, setMood] = useState<string>("");
  const [text, setText] = useState("");
  const [bnText, setBnText] = useState("");
  const [showBn, setShowBn] = useState(false);
  const [error, setError] = useState("");

  const serif = lang === "bn" ? "font-bengali" : "font-serif";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError(lang === "bn" ? "আগে কিছু লিখুন।" : "Write something first.");
      return;
    }
    const lines = trimmedText.split("\n");
    const resolvedTitle =
      title.trim() || lines.find((l) => l.trim() !== "")?.trim() || "Untitled";
    const resolvedMood = mood || "longing";

    const bnLines = bnText.trim() ? bnText.trim().split("\n") : undefined;
    const resolvedBnTitle = bnTitle.trim() || undefined;

    const id = addPoem({
      title: resolvedTitle,
      mood: resolvedMood,
      lines,
      bnTitle: resolvedBnTitle,
      bnLines,
    });
    navigate(`/poem/${id}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="min-h-[85vh] flex flex-col items-center py-20 px-6"
    >
      <div className="w-full max-w-2xl mx-auto">
        <Link
          href="/"
          className={`inline-flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-16 ${serif}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Link>

        <div className="space-y-3 mb-12 text-center">
          <span className={`text-xs uppercase tracking-[0.2em] text-primary/70 ${serif}`}>{t.yourWords}</span>
          <h1 className={`text-4xl md:text-5xl ${serif}`}>{t.writeTitle}</h1>
          <p className={`text-muted-foreground font-light leading-relaxed text-sm ${serif}`}>{t.writeSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main text */}
          <div className="space-y-2">
            <label className={`text-xs uppercase tracking-widest text-muted-foreground block ${serif}`}>
              {lang === "bn" ? "ইংরেজি / অন্য ভাষায়" : "Your writing"}
            </label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setError(""); }}
              placeholder={t.writePlaceholder}
              rows={10}
              autoFocus
              className={`w-full bg-transparent border border-border/20 focus:border-primary/40 outline-none p-6 text-xl leading-loose placeholder:text-muted-foreground/20 resize-none transition-colors ${serif}`}
            />
          </div>

          {/* Bangla version toggle */}
          <div className="border border-border/20 hover:border-border/40 transition-colors">
            <button
              type="button"
              onClick={() => setShowBn(!showBn)}
              className={`w-full flex items-center justify-between px-6 py-4 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors ${serif}`}
            >
              <span>
                {showBn
                  ? (lang === "bn" ? "বাংলা সংস্করণ লুকান" : "Hide Bangla version")
                  : (lang === "bn" ? "+ বাংলা সংস্করণ যোগ করুন" : "+ Add Bangla version (optional)")}
              </span>
              <motion.div animate={{ rotate: showBn ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showBn && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-6 border-t border-border/20">
                    <p className="font-bengali text-sm text-muted-foreground/60 pt-4">
                      বাংলায় অনুবাদ বা নতুনভাবে লিখুন। বাংলা মোডে এই সংস্করণটি দেখাবে।
                    </p>
                    <div className="space-y-2">
                      <label className="font-bengali text-xs uppercase tracking-widest text-muted-foreground block">
                        বাংলা শিরোনাম <span className="normal-case tracking-normal text-muted-foreground/40">(ঐচ্ছিক)</span>
                      </label>
                      <input
                        type="text"
                        value={bnTitle}
                        onChange={(e) => setBnTitle(e.target.value)}
                        placeholder="বাংলা শিরোনাম..."
                        className="font-bengali w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none py-2 text-lg placeholder:text-muted-foreground/25 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bengali text-xs uppercase tracking-widest text-muted-foreground block">
                        বাংলায় লেখা
                      </label>
                      <textarea
                        value={bnText}
                        onChange={(e) => setBnText(e.target.value)}
                        placeholder={"এখানে বাংলায় লিখুন...\nপ্রতিটি লাইন আলাদা হবে।"}
                        rows={10}
                        className="font-bengali w-full bg-transparent border border-border/20 focus:border-primary/40 outline-none p-6 text-xl leading-loose placeholder:text-muted-foreground/20 resize-none transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title & Mood */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className={`text-xs uppercase tracking-widest text-muted-foreground block ${serif}`}>
                {t.labelTitle} <span className={`normal-case tracking-normal text-muted-foreground/40 ${serif}`}>{t.labelTitleHint}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                className={`w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none py-2 text-lg placeholder:text-muted-foreground/25 transition-colors ${serif}`}
              />
            </div>

            <div className="space-y-3">
              <label className={`text-xs uppercase tracking-widest text-muted-foreground block ${serif}`}>
                {t.labelMood} <span className={`normal-case tracking-normal text-muted-foreground/40 ${serif}`}>{t.labelMoodHint}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {MOOD_KEYS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(mood === m ? "" : m)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${serif} ${
                      mood === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {t.moodNames[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className={`text-primary/80 text-sm font-light italic ${serif}`}>{error}</p>
          )}

          <div className="flex items-center gap-6 pt-2">
            <button
              type="submit"
              className={`inline-flex items-center justify-center border border-primary/50 text-primary px-10 py-4 uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500 ${serif}`}
            >
              {t.addBtn}
            </button>
            <Link
              href="/"
              className={`text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors ${serif}`}
            >
              {t.cancel}
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
