import { Router, type IRouter } from "express";
import { db, userPoemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function autoTranslate(title: string, lines: string[]): Promise<{ bnTitle: string; bnLines: string[] } | null> {
  try {
    const texts = [title, lines.join("\n")];
    const prompt = `Translate each of the following English texts to Bangla (Bengali).
Return a JSON array of 2 translated strings in the same order.
Preserve internal newlines in the second string.
Return ONLY the JSON array — no explanation, no markdown, no code block.

Input: ${JSON.stringify(texts)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = response.text?.trim() ?? "";
    const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned) as string[];

    if (!Array.isArray(parsed) || parsed.length < 2) return null;
    return {
      bnTitle: parsed[0],
      bnLines: parsed[1].split("\n"),
    };
  } catch {
    return null;
  }
}

router.get("/poems", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const rows = await db
      .select()
      .from(userPoemsTable)
      .orderBy(userPoemsTable.createdAt);
    const poems = rows.map((row) => ({
      id: row.id,
      title: row.title,
      bnTitle: row.bnTitle ?? undefined,
      lines: JSON.parse(row.lines) as string[],
      bnLines: row.bnLines ? (JSON.parse(row.bnLines) as string[]) : undefined,
      mood: row.mood,
    }));
    res.json(poems);
  } catch (err) {
    req.log.error(err, "Failed to fetch poems");
    res.status(500).json({ error: "Failed to fetch poems" });
  }
});

router.post("/poems", async (req, res) => {
  try {
    const { id, title, bnTitle, lines, bnLines, mood } = req.body as {
      id: string;
      title: string;
      bnTitle?: string;
      lines: string[];
      bnLines?: string[];
      mood: string;
    };
    if (!id || !title || !Array.isArray(lines) || !mood) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    let finalBnTitle = bnTitle ?? null;
    let finalBnLines = bnLines ?? null;

    // Auto-translate if the user didn't provide Bangla content
    if (!finalBnTitle || !finalBnLines) {
      const translated = await autoTranslate(title, lines);
      if (translated) {
        finalBnTitle = finalBnTitle ?? translated.bnTitle;
        finalBnLines = finalBnLines ?? translated.bnLines;
      }
    }

    await db.insert(userPoemsTable).values({
      id,
      title,
      bnTitle: finalBnTitle,
      lines: JSON.stringify(lines),
      bnLines: finalBnLines ? JSON.stringify(finalBnLines) : null,
      mood,
    });
    res.status(201).json({ id });
  } catch (err) {
    req.log.error(err, "Failed to save poem");
    res.status(500).json({ error: "Failed to save poem" });
  }
});

router.patch("/poems/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, bnTitle, lines, bnLines, mood } = req.body as {
      title?: string;
      bnTitle?: string;
      lines?: string[];
      bnLines?: string[];
      mood?: string;
    };

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (bnTitle !== undefined) updates.bnTitle = bnTitle || null;
    if (lines !== undefined) updates.lines = JSON.stringify(lines);
    if (bnLines !== undefined) updates.bnLines = bnLines ? JSON.stringify(bnLines) : null;
    if (mood !== undefined) updates.mood = mood;

    // Auto-translate if title or lines changed and no Bangla provided
    if ((title !== undefined || lines !== undefined) && !bnTitle && !bnLines) {
      const currentTitle = title ?? "";
      const currentLines = lines ?? [];
      if (currentTitle && currentLines.length > 0) {
        const translated = await autoTranslate(currentTitle, currentLines);
        if (translated) {
          updates.bnTitle = translated.bnTitle;
          updates.bnLines = JSON.stringify(translated.bnLines);
        }
      }
    }

    await db.update(userPoemsTable).set(updates).where(eq(userPoemsTable.id, id));
    res.json({ id });
  } catch (err) {
    req.log.error(err, "Failed to update poem");
    res.status(500).json({ error: "Failed to update poem" });
  }
});

router.delete("/poems/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(userPoemsTable).where(eq(userPoemsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err, "Failed to delete poem");
    res.status(500).json({ error: "Failed to delete poem" });
  }
});

export default router;
