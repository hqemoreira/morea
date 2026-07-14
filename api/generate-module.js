const fs = require("fs");
const path = require("path");

const curriculum = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "fallback-curriculum.json"), "utf8")
);

function buildPrompt(sector, role, tier) {
  return (
    'Write a 10-minute EU AI Act Article 4 AI-literacy training module for an employee in the "' +
    sector.replace(/_/g, " ") +
    '" sector, working as "' +
    role +
    '", at a company classified with "' +
    tier +
    '" Article 4 exposure. Cover: what Article 4 requires of their role, where AI shows up in their daily work, practical habits that satisfy the obligation, and what good documentation looks like. Keep it concrete and specific to their sector, not generic.'
  );
}

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

  const answers = body.answers || {};
  const sector = curriculum[answers.sector] ? answers.sector : "general";
  const role = answers.role || "other";
  const tier = body.tier || "low";
  const fallback = curriculum[sector];

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    res.status(200).json(Object.assign({}, fallback, { source: "fallback" }));
    return;
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You are an EU AI Act Article 4 compliance trainer. Respond only with valid JSON matching: {"title": string, "sections": [{"heading": string, "body": string}]}. Write exactly 4 sections, each 2-4 sentences, practical and specific, no legal disclaimers.'
          },
          { role: "user", content: buildPrompt(sector, role, tier) }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) throw new Error("Mistral API error: " + response.status);

    const data = await response.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    const parsed = JSON.parse(content);

    if (!parsed.title || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      throw new Error("Malformed Mistral response");
    }

    res.status(200).json(Object.assign({}, parsed, { source: "mistral" }));
  } catch (err) {
    res.status(200).json(Object.assign({}, fallback, { source: "fallback" }));
  }
};
