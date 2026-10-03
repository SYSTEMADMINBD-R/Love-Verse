import type { NextFunction, Request, Response } from "express";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "love_verse_admin";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const MIN_PASSWORD_LENGTH = 16;
const MIN_SESSION_SECRET_LENGTH = 32;

export function isAdminAuthConfigured(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  return (
    typeof password === "string" &&
    password.length >= MIN_PASSWORD_LENGTH &&
    typeof secret === "string" &&
    secret.length >= MIN_SESSION_SECRET_LENGTH
  );
}

export function isAdminAuthenticated(req: Request): boolean {
  if (!isAdminAuthConfigured()) return false;

  const session = req.signedCookies?.[ADMIN_SESSION_COOKIE];
  if (typeof session !== "string") return false;

  const match = /^admin:(\d+):([a-f0-9]{64})$/.exec(session);
  if (!match) return false;

  const expiresAt = Number(match[1]);
  const now = Math.floor(Date.now() / 1000);
  const currentPasswordVersion = adminPasswordVersion();
  return (
    Number.isSafeInteger(expiresAt) &&
    expiresAt > now &&
    expiresAt <= now + SESSION_DURATION_SECONDS + 60 &&
    match[2] === currentPasswordVersion
  );
}

export function createAdminSessionValue(expiresAt: number): string {
  return `admin:${expiresAt}:${adminPasswordVersion()}`;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/api",
    maxAge: SESSION_DURATION_SECONDS * 1000,
  };
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!isAdminAuthConfigured()) {
    res.status(503).json({
      error:
        "Admin access is not configured. Set ADMIN_PASSWORD (at least 16 characters) and SESSION_SECRET (at least 32 characters).",
    });
    return;
  }

  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ error: "Admin sign-in required" });
    return;
  }

  next();
}

export function adminPasswordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const candidateDigest = createHash("sha256").update(candidate).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

function adminPasswordVersion(): string {
  return createHmac("sha256", process.env.SESSION_SECRET ?? "")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest("hex");
}