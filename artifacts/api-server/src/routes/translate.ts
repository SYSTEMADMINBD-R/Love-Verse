import { Router, type IRouter } from "express";
import Groq from "groq-sdk";
import { db, userPoemsTable } from "@workspace/db";
import { isNull, or, eq } from "drizzle-orm";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

async function groqTranslate(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

export async function autoTranslate(
  title: string,
  lines: string[]
): Promise<{ bnTitle: string; bnLines: string[] } | null> {
  try {
    const texts = [title, lines.join("\n")];
    const raw = await groqTranslate(
      `Translate each English text to Bangla. Return ONLY a JSON array of 2 strings. Preserve newlines in the second string.\n\nInput: ${JSON.stringify(texts)}`
    );
    const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned) as string[];
    if (!Array.isArray(parsed) || parsed.length < 2) return null;
    return { bnTitle: parsed[0], bnLines: parsed[1].split("\n") };
  } catch {
    return null;
  }
}

// Bulk-translate all user poems missing Bangla — all in ONE Groq call
router.post("/poems/translate-missing", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(userPoemsTable)
      .where(or(isNull(userPoemsTable.bnTitle), isNull(userPoemsTable.bnLines)));

    if (rows.length === 0) {
      res.json({ translated: 0, failed: 0, total: 0 });
      return;
    }

    // Build one combined request: array of {title, body} objects
    const inputs = rows.map((row) => ({
      title: row.title,
      body: (JSON.parse(row.lines) as string[]).join("\n"),
    }));

    const prompt = `Translate each poem from English to Bangla (Bengali).
Return ONLY a valid JSON array. Each element must be an object with "title" and "body" (body preserves newlines).
No explanation, no markdown, no code blocks.

Input: ${JSON.stringify(inputs)}`;

    let results: Array<{ title: string; body: string }> = [];
    try {
      const raw = await groqTranslate(prompt);
      const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
      results = JSON.parse(cleaned) as Array<{ title: string; body: string }>;
    } catch {
      res.status(500).json({ error: "Translation parsing failed" });
      return;
    }

    let translated = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = results[i];
      if (r?.title && r?.body) {
        await db
          .update(userPoemsTable)
          .set({
            bnTitle: r.title,
            bnLines: JSON.stringify(r.body.split("\n")),
          })
          .where(eq(userPoemsTable.id, rows[i].id));
        translated++;
      } else {
        failed++;
      }
    }

    res.json({ translated, failed, total: rows.length });
  } catch (err) {
    req.log.error({ err }, "Bulk translation failed");
    res.status(500).json({ error: "Bulk translation failed" });
  }
});

export default router;
