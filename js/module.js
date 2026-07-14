(async function () {
  const raw = sessionStorage.getItem("litrix_intake");
  if (!raw) {
    window.location.href = "/assess.html";
    return;
  }
  const intake = JSON.parse(raw);

  const loadingEl = document.getElementById("loading");
  const contentEl = document.getElementById("module-content");

  let module;
  try {
    const res = await fetch("/api/generate-module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: intake.answers, tier: intake.tier })
    });
    module = await res.json();
  } catch (err) {
    module = { title: "Training module unavailable", sections: [], source: "error" };
  }

  sessionStorage.setItem("litrix_module", JSON.stringify(module));

  loadingEl.style.display = "none";
  contentEl.style.display = "block";

  const sectionsHtml = (module.sections || [])
    .map(
      (s) =>
        '<div class="dossier"><h3>' +
        escapeHtml(s.heading) +
        "</h3><p>" +
        escapeHtml(s.body) +
        "</p></div>"
    )
    .join("");

  contentEl.innerHTML =
    '<div class="stamp stamp-' + intake.tier + '" style="margin-bottom:20px;">' + intake.tierLabel + "</div>" +
    "<h1>" + escapeHtml(module.title || "Your AI literacy module") + "</h1>" +
    sectionsHtml +
    '<p style="margin-top:24px;"><a class="btn btn-primary" href="/quiz.html">Continue to comprehension check</a></p>';

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
