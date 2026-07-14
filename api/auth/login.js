const { getSql } = require("../../lib/db");
const { verifyPassword, createSession, setSessionCookie } = require("../../lib/auth");

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

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const sql = getSql();
  const rows = await sql`SELECT id, email, name, company_id, role, password_hash FROM users WHERE email = ${email}`;
  const user = rows[0];

  if (!user) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(req, res, token, expiresAt);

  delete user.password_hash;
  res.status(200).json({ user });
};
