import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function callGemini(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return response.text?.trim() ?? "";
}

router.post("/translate", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text is required" });
    return;
  }
  try {
    const translated = await callGemini(
      `Translate the following English text to Bangla (Bengali). Return ONLY the translated text, nothing else — no explanations, no notes, no quotation marks.\n\n${text}`
    );
    res.json({ translated: translated || text });
  } catch (err) {
    req.log.error({ err }, "Translation failed");
    res.status(500).json({ error: "Translation failed" });
  }
});

router.post("/translate-batch", async (req, res) => {
  const { texts } = req.body as { texts?: string[] };
  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    res.status(400).json({ error: "texts array is required" });
    return;
  }

  try {
    const prompt = `Translate each of the following English texts to Bangla (Bengali).
Return a JSON array of translated strings in the EXACT same order as the input.
Each translated string must preserve internal newlines (\\n) from the original.
Return ONLY the JSON array — no explanation, no markdown, no code block.

Input JSON array:
${JSON.stringify(texts)}`;

    const raw = await callGemini(prompt);

    let translations: string[];
    try {
      const cleaned = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/,"").trim();
      translations = JSON.parse(cleaned) as string[];
      if (!Array.isArray(translations) || translations.length !== texts.length) {
        throw new Error("Mismatched length");
      }
    } catch {
      translations = texts;
    }

    res.json({ translations });
  } catch (err) {
    req.log.error({ err }, "Batch translation failed");
    res.status(500).json({ error: "Batch translation failed" });
  }
});

export default router;
