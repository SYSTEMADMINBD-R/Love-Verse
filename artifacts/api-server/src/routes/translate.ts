import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

router.post("/translate", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate the following English text to Bangla (Bengali). Return ONLY the translated text, nothing else — no explanations, no notes, no quotation marks.\n\n${text}`,
            },
          ],
        },
      ],
    });

    const translated = response.text?.trim() ?? text;
    res.json({ translated });
  } catch (err) {
    req.log.error({ err }, "Translation failed");
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
