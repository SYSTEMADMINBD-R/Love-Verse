import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { usePoems } from "@/lib/use-poems";

const MOODS = ["longing", "tender", "passion", "devotion", "heartbreak", "joy"] as const;

export default function AddPoem() {
  const [, navigate] = useLocation();
  const { addPoem } = usePoems();

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState<string>("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Write something first.");
      return;
    }

    const lines = trimmedText.split("\n");
    const resolvedTitle =
      title.trim() || lines.find((l) => l.trim() !== "")?.trim() || "Untitled";
    const resolvedMood = mood || "longing";

    const id = addPoem({ title: resolvedTitle, mood: resolvedMood, lines });
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
          className="inline-flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-16"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <div className="space-y-3 mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary/70">Your Words</span>
          <h1 className="text-4xl md:text-5xl font-serif">Write freely.</h1>
          <p className="text-muted-foreground font-light leading-relaxed text-sm">
            No rules. Just write — then add it. Title and mood are optional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(""); }}
            placeholder={"Start writing here...\n\nA poem, a thought, a paragraph — anything goes.\nLet it come as it comes.\nNo need to be careful.\nThis is just for you."}
            rows={16}
            autoFocus
            className="w-full bg-transparent border border-border/20 focus:border-primary/40 outline-none p-6 font-serif text-xl leading-loose placeholder:text-muted-foreground/20 resize-none transition-colors"
          />

          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground block">
                  Title <span className="normal-case tracking-normal text-muted-foreground/40">(optional — uses your first line if blank)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Leave blank to auto-title..."
                  className="w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none py-2 font-serif text-lg placeholder:text-muted-foreground/25 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-muted-foreground block">
                Mood <span className="normal-case tracking-normal text-muted-foreground/40">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(mood === m ? "" : m)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all duration-300 ${
                      mood === m
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-primary/80 text-sm font-light italic">{error}</p>
          )}

          <div className="flex items-center gap-6 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center border border-primary/50 text-primary px-10 py-4 uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              Add to Collection
            </button>
            <Link
              href="/"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
