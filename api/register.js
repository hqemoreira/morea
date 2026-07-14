const { getSql } = require("../lib/db");
const { getSessionUser } = require("../lib/auth");

module.exports = async (req, res) => {
  const user = await getSessionUser(req);

  if (req.method === "POST") {
    if (!user) {
      res.status(401).json({ error: "Log in to save a training register entry." });
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

    const sql = getSql();
    try {
      const rows = await sql`
        INSERT INTO register_entries
          (verification_code, user_id, company_id, company_size, sector, ai_usage, role_answer, classification_result, quiz_score, quiz_total, completed_at)
        VALUES
          (${body.verification_code}, ${user.id}, ${user.company_id}, ${body.company_size}, ${body.sector}, ${body.ai_usage}, ${body.role_answer}, ${JSON.stringify(body.classification_result)}::jsonb, ${body.quiz_score}, ${body.quiz_total}, ${body.completed_at})
        RETURNING id, verification_code
      `;
      res.status(200).json({ entry: rows[0] });
    } catch (err) {
      if (String(err.message || "").includes("duplicate key")) {
        res.status(409).json({ error: "This record has already been saved." });
        return;
      }
      throw err;
    }
    return;
  }

  if (req.method === "GET") {
    if (!user) {
      res.status(401).json({ error: "Log in to view your training register." });
      return;
    }
    const sql = getSql();
    const rows = user.company_id
      ? await sql`
          SELECT re.id, re.verification_code, re.sector, re.company_size, re.classification_result, re.quiz_score, re.quiz_total, re.completed_at, u.email, u.name
          FROM register_entries re
          JOIN users u ON u.id = re.user_id
          WHERE re.company_id = ${user.company_id}
          ORDER BY re.completed_at DESC
        `
      : await sql`
          SELECT id, verification_code, sector, company_size, classification_result, quiz_score, quiz_total, completed_at
          FROM register_entries
          WHERE user_id = ${user.id}
          ORDER BY completed_at DESC
        `;
    res.status(200).json({ entries: rows });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
