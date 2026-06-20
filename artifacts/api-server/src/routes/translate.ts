import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";
import { db, userPoemsTable } from "@workspace/db";
import { isNull, or, eq } from "drizzle-orm";

const router: IRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function autoTranslate(
  title: string,
  lines: string[]
): Promise<{ bnTitle: string; bnLines: string[] } | null> {
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
    return { bnTitle: parsed[0], bnLines: parsed[1].split("\n") };
  } catch {
    return null;
  }
}

// Bulk-translate all user poems missing Bangla content
router.post("/poems/translate-missing", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(userPoemsTable)
      .where(or(isNull(userPoemsTable.bnTitle), isNull(userPoemsTable.bnLines)));

    let translated = 0;
    let failed = 0;

    for (const row of rows) {
      const lines = JSON.parse(row.lines) as string[];
      const result = await autoTranslate(row.title, lines);
      if (result) {
        await db
          .update(userPoemsTable)
          .set({ bnTitle: result.bnTitle, bnLines: JSON.stringify(result.bnLines) })
          .where(eq(userPoemsTable.id, row.id));
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
