const { getSql } = require("../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const code = ((req.query && req.query.code) || "").trim().toUpperCase();
  if (!code) {
    res.status(400).json({ error: "Verification code is required." });
    return;
  }

  const sql = getSql();
  const rows = await sql`
    SELECT re.verification_code, re.sector, re.classification_result, re.completed_at, re.quiz_score, re.quiz_total, c.name AS company_name
    FROM register_entries re
    LEFT JOIN companies c ON c.id = re.company_id
    WHERE re.verification_code = ${code}
  `;

  if (rows.length === 0) {
    res.status(404).json({ error: "No record found for this code." });
    return;
  }

  const entry = rows[0];
  res.status(200).json({
    entry: {
      verification_code: entry.verification_code,
      sector: entry.sector,
      tier: entry.classification_result && entry.classification_result.tierLabel,
      completed_at: entry.completed_at,
      quiz_score: entry.quiz_score,
      quiz_total: entry.quiz_total,
      organization: entry.company_name || "Individual"
    }
  });
};
