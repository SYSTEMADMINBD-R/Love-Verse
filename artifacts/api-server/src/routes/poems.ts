import { Router, type IRouter } from "express";
import { db, userPoemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

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
    await db.insert(userPoemsTable).values({
      id,
      title,
      bnTitle: bnTitle ?? null,
      lines: JSON.stringify(lines),
      bnLines: bnLines ? JSON.stringify(bnLines) : null,
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
