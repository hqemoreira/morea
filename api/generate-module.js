const fs = require("fs");
const path = require("path");

const curriculum = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "fallback-curriculum.json"), "utf8")
);

function buildPrompt(sector, role, tier, track) {
  const trackLine =
    track === "partner_ops"
      ? "Write for a partner or ops lead who must organise literacy measures, keep an AI-use inventory, and produce a dated evidence-style record. Emphasise oversight, documentation habits, and proportionate measures — not model internals."
      : "Write for a staff member who uses AI tools in daily work. Emphasise practical habits, human review, data care, and knowing when to escalate — not model internals.";

  return (
    'Write a 10-minute EU AI Act Article 4 AI-literacy training module for an employee in the "' +
    sector.replace(/_/g, " ") +
    '" sector, working as "' +
    role +
    '", literacy track "' +
    track +
    '", at a company classified with "' +
    tier +
    '" Article 4 exposure. ' +
    trackLine +
    " Cover: what Article 4 requires of their role, where AI shows up in their daily work, practical habits, and what good documentation looks like. Keep it concrete and specific to their sector."
  );
}

function withTrackIntro(fallback, track) {
  const copy = JSON.parse(JSON.stringify(fallback));
  if (track === "partner_ops") {
    copy.title = (copy.title || "AI Literacy") + " — Partner / ops";
    if (copy.sections && copy.sections[0]) {
      copy.sections[0].heading = "What Article 4 asks of partners and ops leads";
      copy.sections[0].body =
        "Article 4 requires providers and deployers to take literacy measures for people who use AI on their behalf. As a partner or ops lead, your job is not to become a machine-learning engineer — it is to make sure measures exist, match real tools and roles, and leave a dated record you can show. This module is educational practice for that habit.";
    }
    if (copy.sections && copy.sections[3]) {
      copy.sections[3].heading = "What an evidence-style record looks like";
      copy.sections[3].body =
        "A useful practice pack lists which AI tools are in use, who completed a role-aware literacy path, quiz confirmation, and optionally a short internal use policy. Treat any demo export as illustrative — not a conformity assessment or legal advice.";
    }
  } else {
    copy.title = (copy.title || "AI Literacy") + " — Staff user";
  }
  return copy;
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
  const track =
    body.track === "partner_ops" ||
    role === "partner_ops" ||
    role === "founder" ||
    role === "compliance"
      ? "partner_ops"
      : "staff";
  const fallback = withTrackIntro(curriculum[sector], track);

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    res.status(200).json(Object.assign({}, fallback, { source: "fallback", track: track }));
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
              'You are an EU AI Act Article 4 literacy educator for a non-commercial educational prototype called Morea Evidence Pack. Respond only with valid JSON matching: {"title": string, "sections": [{"heading": string, "body": string}]}. Write exactly 4 sections, each 2-4 sentences, practical and specific. Never claim the reader is compliant. No sales language.'
          },
          { role: "user", content: buildPrompt(sector, role, tier, track) }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) throw new Error("Mistral API error: " + response.status);

    const data = await response.json();
    const content =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;
    const parsed = JSON.parse(content);

    if (!parsed.title || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      throw new Error("Malformed Mistral response");
    }

    res.status(200).json(Object.assign({}, parsed, { source: "mistral", track: track }));
  } catch (err) {
    res.status(200).json(Object.assign({}, fallback, { source: "fallback", track: track }));
  }
};
