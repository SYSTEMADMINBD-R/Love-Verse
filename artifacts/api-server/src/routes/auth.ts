import { Router, type IRouter } from "express";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  adminPasswordMatches,
  createAdminSessionValue,
  isAdminAuthConfigured,
  isAdminAuthenticated,
} from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/auth/status", (req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    configured: isAdminAuthConfigured(),
    authenticated: isAdminAuthenticated(req),
  });
});

router.post("/auth/login", (req, res): void => {
  res.setHeader("Cache-Control", "no-store");

  if (!isAdminAuthConfigured()) {
    res.status(503).json({
      error:
        "Admin access is not configured. Set ADMIN_PASSWORD (at least 16 characters) and SESSION_SECRET (at least 32 characters).",
    });
    return;
  }

  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  if (!adminPasswordMatches(password)) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  res.cookie(ADMIN_SESSION_COOKIE, createAdminSessionValue(expiresAt), {
    ...adminCookieOptions(),
    signed: true,
  });
  res.json({ authenticated: true });
});

router.post("/auth/logout", (_req, res): void => {
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api",
  });
  res.status(204).end();
});

export default router;