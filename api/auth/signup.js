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

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const name = (body.name || "").trim();
  const accountType = body.accountType === "company" ? "company" : "individual";
  const companyName = (body.companyName || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }
  if (accountType === "company" && !companyName) {
    res.status(400).json({ error: "Company name is required." });
    return;
  }

  const sql = getSql();

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await hashPassword(password);

  let companyId = null;
  if (accountType === "company") {
    const companyRows = await sql`INSERT INTO companies (name) VALUES (${companyName}) RETURNING id`;
    companyId = companyRows[0].id;
  }

  const userRows = await sql`
    INSERT INTO users (email, password_hash, name, company_id, role)
    VALUES (${email}, ${passwordHash}, ${name || null}, ${companyId}, 'owner')
    RETURNING id, email, name, company_id, role
  `;
  const user = userRows[0];

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(req, res, token, expiresAt);

  res.status(200).json({ user });
};
