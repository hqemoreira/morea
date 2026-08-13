const { getSql } = require("../../lib/db");
const { getSessionUser } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const user = await getSessionUser(req);
  if (!user || !user.company_id) {
    res.status(401).json({ error: "Log in to a shared demo register to view seats." });
    return;
  }

  const sql = getSql();
  const [company] = await sql`SELECT name, seat_limit FROM companies WHERE id = ${user.company_id}`;
  const members = await sql`SELECT id, email, name, role, created_at FROM users WHERE company_id = ${user.company_id} ORDER BY created_at ASC`;
  const pendingInvites = await sql`SELECT id, token, expires_at, created_at FROM invites WHERE company_id = ${user.company_id} AND used_at IS NULL AND expires_at > now() ORDER BY created_at DESC`;

  res.status(200).json({
    company,
    members,
    pendingInvites,
    isAdmin: user.role === "owner" || user.role === "admin"
  });
};
