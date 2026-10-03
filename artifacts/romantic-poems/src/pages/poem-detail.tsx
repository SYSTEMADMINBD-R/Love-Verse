import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { usePoems } from "@/lib/use-poems";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import { useTranslatedPoem } from "@/lib/use-translated-poem";
import { useAdminAuth } from "@/contexts/admin-auth-context";

export default function PoemDetail() {
  const [, params] = useRoute<{ id: string }>("/poem/:id");
  const [, navigate] = useLocation();
  const { allPoems, deletePoem, isUserPoem } = usePoems();
  const { lang, t } = useLang();
  const { authenticated } = useAdminAuth();
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const poem = allPoems.find(p => p.id === params?.id);
  const canDelete = poem ? authenticated && isUserPoem(poem.id) : false;
  const { title, lines, loading } = useTranslatedPoem(poem, lang);

  async function handleDelete() {
    if (!poem) return;
    setDeleting(true);
    setActionError("");
    try {
      await deletePoem(poem.id);
      navigate("/");
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "Could not delete this poem.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (!poem) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <p className="font-serif italic text-xl">{t.notFound}</p>
        <Link href="/" className="text-primary hover:underline text-sm uppercase tracking-widest">
          {t.returnLib}
        </Link>
      </div>
    );
  }

  const moodKey = poem.mood as keyof typeof t.moodNames;
  const mood = t.moodNames[moodKey] ?? poem.mood;
  const serif = lang === "bn" ? "font-bengali" : "font-serif";

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="min-h-[85vh] flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className={`inline-flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors ${serif}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Link>
          {canDelete && (
            <div className="flex items-center gap-5">
              <Link
                href={`/edit-poem/${poem.id}`}
                data-testid="link-edit-poem"
                className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors ${serif}`}
              >
                <Pencil className="w-3.5 h-3.5" />
                {lang === "bn" ? "সম্পাদনা" : "Edit"}
              </Link>
              <button
                type="button"
                data-testid="button-delete-poem"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground/50 hover:text-primary/70 transition-colors ${serif}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? (lang === "bn" ? "মুছে ফেলা হচ্ছে…" : "Deleting…") : t.remove}
              </button>
            </div>
          )}
        </div>
        {actionError && (
          <p data-testid="status-poem-action-error" role="alert" className="mb-8 text-sm text-destructive">
            {actionError}
          </p>
        )}

        <div className="space-y-4 mb-16 text-center">
          <span className={`text-xs uppercase tracking-[0.2em] text-primary/70 ${serif}`}>{mood}</span>
          {loading ? (
            <div className="h-12 w-64 mx-auto bg-primary/10 animate-pulse rounded" />
          ) : (
            <h1 className={`text-4xl md:text-6xl ${serif}`}>{title}</h1>
          )}
        </div>

        {loading ? (
          <div className="space-y-4 mx-auto max-w-xl">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-7 bg-primary/10 animate-pulse rounded" style={{ width: `${60 + i * 10}%` }} />
            ))}
          </div>
        ) : (
          <div className={`text-xl md:text-2xl leading-loose text-foreground/90 mx-auto max-w-xl space-y-4 ${serif}`}>
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                className={line.trim() === "" ? "h-4" : ""}
              >
                {line}
              </motion.p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
