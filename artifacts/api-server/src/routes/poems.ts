import { Router, type IRouter } from "express";
import { db, userPoemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/poems", async (req, res) => {
  try {
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
