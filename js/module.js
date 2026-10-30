(async function () {
  const intake = MoreaStore.getJSON("intake");
  if (!intake) {
    window.location.href = "/inventory.html";
    return;
  }

  const loadingEl = document.getElementById("loading");
  const contentEl = document.getElementById("module-content");
  const track =
    intake.track ||
    MoreaStore.trackFromRole(intake.answers && intake.answers.role);

  let module;
  try {
    const res = await fetch("/api/generate-module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: intake.answers,
        tier: intake.tier,
        track: track
      })
    });
    module = await res.json();
  } catch (err) {
    module = { title: "Training module unavailable", sections: [], source: "error" };
  }

  module.track = track;
  MoreaStore.setJSON("module", module);

  loadingEl.style.display = "none";
  contentEl.style.display = "block";

  const trackLabel =
    track === "partner_ops" ? "Partner / ops track" : "Staff user track";

  const sectionsHtml = (module.sections || [])
    .map(function (s) {
      return (
        '<div class="dossier"><h3>' +
        escapeHtml(s.heading) +
        "</h3><p>" +
        escapeHtml(s.body) +
        "</p></div>"
      );
    })
    .join("");

  contentEl.innerHTML =
    '<div class="stamp stamp-' +
    intake.tier +
    '" style="margin-bottom:20px;">' +
    escapeHtml(intake.tierLabel) +
    "</div>" +
    '<p class="dossier-label">' +
    trackLabel +
    "</p>" +
    "<h1>" +
    escapeHtml(module.title || "Your AI literacy module") +
    "</h1>" +
    sectionsHtml +
    '<p style="margin-top:24px;"><a class="btn btn-primary" href="/quiz.html">Continue to comprehension check</a></p>';

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
