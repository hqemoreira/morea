const crypto = require("crypto");
const cookie = require("cookie");
const bcrypt = require("bcryptjs");
const { getSql } = require("./db");

const COOKIE_NAME = "litrix_session";
const SESSION_DAYS = 30;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function isLocalhost(req) {
  const host = req.headers.host || "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

async function createSession(userId) {
  const sql = getSql();
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (${tokenHash}, ${userId}, ${expiresAt.toISOString()})`;
  return { token, expiresAt };
}

function setSessionCookie(req, res, token, expiresAt) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: !isLocalhost(req),
      sameSite: "lax",
      path: "/",
      expires: expiresAt
    })
  );
}

function clearSessionCookie(req, res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, "", {
      httpOnly: true,
      secure: !isLocalhost(req),
      sameSite: "lax",
      path: "/",
      maxAge: 0
    })
  );
}

function getTokenFromRequest(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  return cookies[COOKIE_NAME];
}

async function getSessionUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const sql = getSql();
  const tokenHash = hashToken(token);
  const rows = await sql`
    SELECT users.id, users.email, users.name, users.company_id, users.role
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenHash} AND sessions.expires_at > now()
  `;
  return rows[0] || null;
}

async function destroySession(req) {
  const token = getTokenFromRequest(req);
  if (!token) return;
  const sql = getSql();
  const tokenHash = hashToken(token);
  await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionUser,
  destroySession
};
