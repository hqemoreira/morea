(async function () {
  const intakeRaw = sessionStorage.getItem("litrix_intake");
  const quizRaw = sessionStorage.getItem("litrix_quiz");
  if (!intakeRaw) {
    window.location.href = "/assess.html";
    return;
  }
  if (!quizRaw) {
    window.location.href = "/quiz.html";
    return;
  }

  const intake = JSON.parse(intakeRaw);
  const module = JSON.parse(sessionStorage.getItem("litrix_module") || "{}");
  const quiz = JSON.parse(quizRaw);

  const entry = {
    company_size: intake.answers.size,
    sector: intake.answers.sector,
    ai_usage: intake.answers.usage,
    role_answer: intake.answers.role,
    classification_result: {
      tier: intake.tier,
      tierLabel: intake.tierLabel,
      score: intake.score,
      moduleTitle: module.title || null,
      moduleSource: module.source || null
    },
    quiz_score: quiz.score,
    quiz_total: quiz.total,
    completed_at: quiz.completedAt
  };

  const canonical = JSON.stringify(entry);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const code =
    "LTRX-" +
    hex
      .slice(0, 20)
      .toUpperCase()
      .match(/.{1,4}/g)
      .join("-");

  entry.verification_code = code;

  const contentEl = document.getElementById("register-content");
  const completedDate = new Date(entry.completed_at).toLocaleString();

  contentEl.innerHTML =
    '<p class="dossier-label">Training register entry</p>' +
    '<h1>Record complete</h1>' +
    '<div class="stamp stamp-' + entry.classification_result.tier + '" style="margin-bottom:20px;">' + entry.classification_result.tierLabel + "</div>" +
    "<table>" +
    "<tr><th>Verification code</th><td class=\"mono\">" + code + "</td></tr>" +
    "<tr><th>Completed</th><td>" + completedDate + "</td></tr>" +
    "<tr><th>Sector</th><td>" + entry.sector + "</td></tr>" +
    "<tr><th>Company size</th><td>" + entry.company_size + "</td></tr>" +
    "<tr><th>Quiz score</th><td>" + entry.quiz_score + " / " + entry.quiz_total + "</td></tr>" +
    "</table>" +
    '<p style="margin-top:20px;">' +
    '<button class="btn btn-primary" id="export-btn">Export JSON</button> ' +
    '<button class="btn btn-secondary" id="print-btn">Print</button>' +
    "</p>" +
    '<p class="faint">Anyone can verify this record at <a href="/verify.html">litrixeu.vercel.app/verify.html</a> using the code above.</p>' +
    '<div id="save-status"></div>';

  document.getElementById("export-btn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "litrix-register-" + code + ".json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("print-btn").addEventListener("click", () => window.print());

  const statusEl = document.getElementById("save-status");
  try {
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();

    if (sessionData.user) {
      const saveRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });
      if (saveRes.ok) {
        statusEl.innerHTML = '<div class="notice">Saved to your training register' + (sessionData.user.company_id ? " and shared with your shared demo register." : ".") + '</div>';
      } else {
        statusEl.innerHTML = '<div class="notice notice-error">Could not save to your account. Your local export above is still valid.</div>';
      }
    } else {
      statusEl.innerHTML =
        '<div class="notice">This copy exists only in your browser. <a href="/signup.html">Create a demo login</a> or <a href="/login.html">log in</a> to keep a permanent copy in your training register.</div>';
    }
  } catch (err) {
    statusEl.innerHTML = '<div class="notice">This copy exists only in your browser. <a href="/signup.html">Create a demo login</a> to keep a permanent copy.</div>';
  }
})();
