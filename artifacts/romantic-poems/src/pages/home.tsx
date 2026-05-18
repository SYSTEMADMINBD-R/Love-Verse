import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { usePoems } from "@/lib/use-poems";
import { useRef } from "react";
import { PenLine } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  const { allPoems } = usePoems();
  const featuredPoem = allPoems[2];

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Hero Section */}
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
          <p className="text-primary text-sm uppercase tracking-[0.3em]">A Collection of Love Letters</p>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Words written in the <br />
            <span className="italic text-muted-foreground">velvet dark</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-lg mx-auto leading-relaxed mt-8">
            An archive of longing, devotion, and quiet passion. Read them slowly. Let them linger.
          </p>
          
          <div className="pt-12">
            <a 
              href="#collection" 
              className="inline-flex items-center justify-center border border-primary/30 text-primary px-8 py-4 uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              Enter the Library
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Featured Poem (Full Screen-ish) */}
      <section className="min-h-[80vh] flex items-center justify-center px-6 py-24 relative overflow-hidden bg-secondary/30">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto w-full text-center space-y-12"
        >
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-primary">Featured Verse</span>
            <h2 className="text-4xl md:text-5xl font-serif italic">{featuredPoem.title}</h2>
          </div>
          
          <div className="space-y-6 font-serif text-xl md:text-3xl leading-relaxed text-foreground/90">
            {featuredPoem.lines.map((line, i) => (
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
              href={`/poem/${featuredPoem.id}`}
              className="text-sm border-b border-primary/30 pb-1 text-primary hover:text-foreground transition-colors"
            >
              Read Full Piece
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Gallery */}
      <section id="collection" className="py-32 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl font-serif">The Collection</h2>
          <p className="text-muted-foreground font-light">Select a fragment to read more.</p>
          <div className="pt-4">
            <Link
              href="/add-poem"
              className="inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-3 uppercase tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              <PenLine className="w-3.5 h-3.5" />
              Add Your Own
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPoems.map((poem, i) => (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <Link href={`/poem/${poem.id}`}>
                <div className="group h-full p-8 border border-border/50 bg-card hover:border-primary/50 transition-colors duration-500 cursor-pointer flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      {poem.mood}
                    </span>
                    <span className="text-muted-foreground/30 font-serif italic text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors">
                    {poem.title}
                  </h3>
                  
                  <div className="flex-1 text-muted-foreground font-serif text-base italic mb-8 opacity-70 group-hover:opacity-100 transition-opacity line-clamp-4 leading-relaxed">
                    {poem.lines.filter(l => l.trim() !== "").slice(0, 3).join(" ")}
                  </div>
                </div>
              </Link>
            </motion.div>
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
          <h2 className="text-3xl font-serif italic text-primary">About Nocturne</h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            This space exists as a sanctuary for the romantic. A place to pause the endless scroll of modern life and remember what it feels like to ache, to yearn, and to love deeply. 
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Read by candlelight. Send a verse to someone who occupies your thoughts. Let the words sit with you.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
