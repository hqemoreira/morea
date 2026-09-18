const crypto = require("crypto");
const { getSql } = require("../../lib/db");
const { getSessionUser } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const user = await getSessionUser(req);
  if (!user || !user.company_id) {
    res.status(401).json({ error: "Log in as a demo register owner or admin to invite teammates." });
    return;
  }
  if (user.role !== "owner" && user.role !== "admin") {
    res.status(403).json({ error: "Only owners or admins can invite teammates." });
    return;
  }

  const sql = getSql();

  const [company] = await sql`SELECT seat_limit FROM companies WHERE id = ${user.company_id}`;
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM users WHERE company_id = ${user.company_id}`;
  const [{ pending }] = await sql`SELECT count(*)::int AS pending FROM invites WHERE company_id = ${user.company_id} AND used_at IS NULL AND expires_at > now()`;

  if (count + pending >= company.seat_limit) {
    res.status(400).json({ error: "Demo seat limit reached for this learning register." });
    return;
  }

  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO invites (token, company_id, role, expires_at, created_by)
    VALUES (${token}, ${user.company_id}, 'member', ${expiresAt.toISOString()}, ${user.id})
  `;

  const host = req.headers.host || "litrixeu.vercel.app";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const link = protocol + "://" + host + "/signup.html?invite=" + token;

  res.status(200).json({ link, expiresAt });
};
