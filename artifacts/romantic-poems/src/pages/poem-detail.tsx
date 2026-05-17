import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { poems } from "@/lib/poems";
import { ArrowLeft } from "lucide-react";

export default function PoemDetail() {
  const params = useParams();
  const poem = poems.find(p => p.id === params.id);

  if (!poem) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <p className="font-serif italic text-xl">Poem not found.</p>
        <Link href="/" className="text-primary hover:underline text-sm uppercase tracking-widest">
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="min-h-[85vh] flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="w-full max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-16">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <div className="space-y-4 mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary/70">{poem.mood}</span>
          <h1 className="text-4xl md:text-6xl font-serif">{poem.title}</h1>
        </div>

        <div className="space-y-6 font-serif text-xl md:text-2xl leading-loose text-foreground/90 mx-auto max-w-xl">
          {poem.lines.map((line, i) => (
            <motion.p 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.5, duration: 0.8 }}
              className={line === "" ? "h-6" : ""}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
