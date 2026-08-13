(async function () {
  const sessionRes = await fetch("/api/auth/session");
  const sessionData = await sessionRes.json();

  if (!sessionData.user) {
    window.location.href = "/login.html";
    return;
  }
  if (!sessionData.user.company_id) {
    document.getElementById("workspace-content").innerHTML =
      '<div class="dossier notice notice-error">This account isn\'t part of a shared demo register. <a href="/signup.html">Create a shared demo register</a> to practise multi-user learning flows.</div>';
    return;
  }

  const [seatsRes, registerRes] = await Promise.all([fetch("/api/company/seats"), fetch("/api/register")]);
  const seats = await seatsRes.json();
  const register = await registerRes.json();

  const contentEl = document.getElementById("workspace-content");

  const membersRows = seats.members
    .map(
      (m) =>
        "<tr><td>" + escapeHtml(m.name || "—") + "</td><td>" + escapeHtml(m.email) + "</td><td>" + m.role + "</td></tr>"
    )
    .join("");

  const registerRows = (register.entries || [])
    .map((e) => {
      const cr = e.classification_result || {};
      return (
        "<tr><td>" +
        escapeHtml(e.name || e.email || "—") +
        "</td><td>" +
        new Date(e.completed_at).toLocaleDateString() +
        "</td><td>" +
        escapeHtml(cr.tierLabel || "—") +
        "</td><td>" +
        e.quiz_score +
        "/" +
        e.quiz_total +
        '</td><td class="mono">' +
        e.verification_code +
        "</td></tr>"
      );
    })
    .join("");

  contentEl.innerHTML =
    "<h1>" + escapeHtml(seats.company.name) + " &mdash; workspace</h1>" +
    '<p class="faint">' + seats.members.length + " / " + seats.company.seat_limit + " seats used</p>" +
    '<div class="dossier">' +
    "<h2>Living training register</h2>" +
    (registerRows
      ? "<table><tr><th>Name</th><th>Completed</th><th>Exposure</th><th>Quiz</th><th>Verification code</th></tr>" + registerRows + "</table>"
      : "<p>No completed training records yet.</p>") +
    "</div>" +
    '<div class="dossier">' +
    "<h2>Team</h2>" +
    "<table><tr><th>Name</th><th>Email</th><th>Role</th></tr>" + membersRows + "</table>" +
    (seats.isAdmin
      ? '<div id="invite-area" style="margin-top:20px;"><button class="btn btn-primary" id="invite-btn">Invite teammate</button><div id="invite-result"></div></div>'
      : "") +
    "</div>";

  if (seats.isAdmin) {
    document.getElementById("invite-btn").addEventListener("click", async () => {
      const resultEl = document.getElementById("invite-result");
      resultEl.innerHTML = "<p>Generating invite link&hellip;</p>";
      const res = await fetch("/api/company/invite", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        resultEl.innerHTML = '<div class="notice notice-error">' + (data.error || "Could not create invite.") + "</div>";
        return;
      }
      resultEl.innerHTML =
        '<div class="notice">Share this link (expires in 7 days):<br><span class="mono">' + data.link + "</span></div>";
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
