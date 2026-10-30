(async function () {
  var inventory = MoreaStore.getJSON("inventory");
  var intake = MoreaStore.getJSON("intake");
  var module = MoreaStore.getJSON("module") || {};
  var quiz = MoreaStore.getJSON("quiz");
  var policy = MoreaStore.getJSON("policy");

  if (!intake) {
    window.location.href = "/inventory.html";
    return;
  }
  if (!quiz || !quiz.passed) {
    window.location.href = "/quiz.html";
    return;
  }

  var track =
    quiz.track ||
    MoreaStore.trackFromRole(intake.answers && intake.answers.role);

  var packCore = {
    product: "Morea Evidence Pack",
    version: "0.2",
    illustrative: true,
    disclaimer:
      "Educational / illustrative research prototype. Not legal advice. Not a conformity assessment. Not a compliance service. Personal reskilling · Non-commercial · Not a product for sale.",
    inventory: inventory || { tools: [], none: true },
    classification: {
      company_size: intake.answers.size,
      sector: intake.answers.sector,
      ai_usage: intake.answers.usage,
      role_answer: intake.answers.role,
      track: track,
      tier: intake.tier,
      tierLabel: intake.tierLabel,
      score: intake.score,
      optionLabels: intake.optionLabels || null
    },
    literacy: {
      moduleTitle: module.title || null,
      moduleSource: module.source || null,
      track: track
    },
    quiz: {
      score: quiz.score,
      total: quiz.total,
      track: track,
      completed_at: quiz.completedAt
    },
    policy: policy || { skipped: true },
    completed_at: new Date().toISOString()
  };

  var canonical = JSON.stringify(packCore);
  var digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical)
  );
  var hex = Array.from(new Uint8Array(digest))
    .map(function (b) {
      return b.toString(16).padStart(2, "0");
    })
    .join("");
  var code =
    "MOREA-" +
    hex
      .slice(0, 20)
      .toUpperCase()
      .match(/.{1,4}/g)
      .join("-");

  var pack = Object.assign({}, packCore, {
    verification_code: code,
    content_hash: hex
  });

  MoreaStore.setJSON("evidence_pack", pack);

  var contentEl = document.getElementById("register-content");
  var completedDate = new Date(pack.completed_at).toLocaleString();
  var toolsHtml = "";
  if (pack.inventory.none) {
    toolsHtml = "<tr><th>AI inventory</th><td>None listed / no tools in use</td></tr>";
  } else if (pack.inventory.tools && pack.inventory.tools.length) {
    toolsHtml =
      "<tr><th>AI inventory</th><td>" +
      escapeHtml(
        pack.inventory.tools
          .map(function (t) {
            return t.customName || t.label;
          })
          .join(", ")
      ) +
      "</td></tr>";
  }

  var policyNote =
    pack.policy && pack.policy.skipped
      ? "Skipped (optional)"
      : pack.policy && pack.policy.title
        ? pack.policy.title
        : "Included";

  contentEl.innerHTML =
    '<p class="dossier-label">Evidence Pack &middot; Illustrative</p>' +
    "<h1>Pack ready to show</h1>" +
    '<div class="stamp stamp-' +
    pack.classification.tier +
    '" style="margin-bottom:20px;">' +
    escapeHtml(pack.classification.tierLabel) +
    "</div>" +
    "<table>" +
    '<tr><th>Verification code</th><td class="mono">' +
    code +
    "</td></tr>" +
    "<tr><th>Completed</th><td>" +
    completedDate +
    "</td></tr>" +
    "<tr><th>Literacy track</th><td>" +
    (track === "partner_ops" ? "Partner / ops" : "Staff user") +
    "</td></tr>" +
    "<tr><th>Sector</th><td>" +
    escapeHtml(pack.classification.sector) +
    "</td></tr>" +
    "<tr><th>Company size</th><td>" +
    escapeHtml(pack.classification.company_size) +
    "</td></tr>" +
    toolsHtml +
    "<tr><th>Quiz score</th><td>" +
    pack.quiz.score +
    " / " +
    pack.quiz.total +
    "</td></tr>" +
    "<tr><th>Policy draft</th><td>" +
    escapeHtml(policyNote) +
    "</td></tr>" +
    "</table>" +
    '<p class="faint" style="margin-top:16px;">' +
    escapeHtml(pack.disclaimer) +
    "</p>" +
    '<p style="margin-top:20px;" class="no-print">' +
    '<button class="btn btn-primary" id="export-btn">Download evidence-pack.json</button> ' +
    '<button class="btn btn-secondary" id="print-btn">Print dossier</button>' +
    "</p>" +
    '<p class="faint no-print">Client-side verify: open <a href="/verify.html">verify</a> and upload this JSON, or look up a saved demo code.</p>' +
    '<div id="save-status" class="no-print"></div>';

  document.getElementById("export-btn").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(pack, null, 2)], {
      type: "application/json"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "morea-evidence-pack-" + code + ".json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("print-btn").addEventListener("click", function () {
    window.print();
  });

  var statusEl = document.getElementById("save-status");
  try {
    var sessionRes = await fetch("/api/auth/session");
    var sessionData = await sessionRes.json();
    if (sessionData.user) {
      var legacyEntry = {
        company_size: pack.classification.company_size,
        sector: pack.classification.sector,
        ai_usage: pack.classification.ai_usage,
        role_answer: pack.classification.role_answer,
        classification_result: {
          tier: pack.classification.tier,
          tierLabel: pack.classification.tierLabel,
          score: pack.classification.score,
          moduleTitle: pack.literacy.moduleTitle,
          moduleSource: pack.literacy.moduleSource
        },
        quiz_score: pack.quiz.score,
        quiz_total: pack.quiz.total,
        completed_at: pack.completed_at,
        verification_code: pack.verification_code
      };
      var saveRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(legacyEntry)
      });
      if (saveRes.ok) {
        statusEl.innerHTML =
          '<div class="notice">Optional demo save succeeded. Your JSON export remains the primary Evidence Pack artifact.</div>';
      } else {
        statusEl.innerHTML =
          '<div class="notice">Demo save unavailable. Your local JSON export is still valid for this learning exercise.</div>';
      }
    } else {
      statusEl.innerHTML =
        '<div class="notice">No account required. Keep the downloaded JSON as your illustrative Evidence Pack. Demo login exists only for portfolio experiments — not a product, no billing.</div>';
    }
  } catch (err) {
    statusEl.innerHTML =
      '<div class="notice">Keep the downloaded JSON as your illustrative Evidence Pack.</div>';
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }
})();
