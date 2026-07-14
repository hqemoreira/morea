const { getSql } = require("../../lib/db");
const { hashPassword, createSession, setSessionCookie } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const token = (body.token || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const name = (body.name || "").trim();

  if (!token) {
    res.status(400).json({ error: "Missing invite token." });
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const sql = getSql();

  const [invite] = await sql`SELECT id, company_id, role, expires_at, used_at FROM invites WHERE token = ${token}`;
  if (!invite) {
    res.status(404).json({ error: "This invite link is invalid." });
    return;
  }
  if (invite.used_at) {
    res.status(400).json({ error: "This invite has already been used." });
    return;
  }
  if (new Date(invite.expires_at) < new Date()) {
    res.status(400).json({ error: "This invite has expired." });
    return;
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [user] = await sql`
    INSERT INTO users (email, password_hash, name, company_id, role)
    VALUES (${email}, ${passwordHash}, ${name || null}, ${invite.company_id}, ${invite.role})
    RETURNING id, email, name, company_id, role
  `;

  await sql`UPDATE invites SET used_at = now() WHERE id = ${invite.id}`;

  const { token: sessionToken, expiresAt } = await createSession(user.id);
  setSessionCookie(req, res, sessionToken, expiresAt);

  res.status(200).json({ user });
};
