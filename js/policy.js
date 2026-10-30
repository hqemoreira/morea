(function () {
  var inventory = MoreaStore.getJSON("inventory");
  var intake = MoreaStore.getJSON("intake");
  var quiz = MoreaStore.getJSON("quiz");

  if (!intake) {
    window.location.href = "/inventory.html";
    return;
  }
  if (!quiz || !quiz.passed) {
    window.location.href = "/quiz.html";
    return;
  }

  function toolList(inv) {
    if (!inv || inv.none || !inv.tools || !inv.tools.length) {
      return "No AI tools currently listed (or none in use).";
    }
    return inv.tools
      .map(function (t) {
        var name = t.customName || t.label;
        return name + " (" + (t.purpose || "general") + "; data: " + (t.sensitivity || "unsure") + ")";
      })
      .join("; ");
  }

  function buildPolicy(sector, inv) {
    var sectorLabel = (sector || "general").replace(/_/g, " ");
    var tools = toolList(inv);
    return {
      title: "Illustrative internal AI-use policy — " + sectorLabel,
      illustrative: true,
      generatedAt: new Date().toISOString(),
      sections: [
        {
          heading: "Purpose",
          body:
            "This short note is an educational draft for practice. It is not legal advice and does not make an organisation compliant. It sketches how a small " +
            sectorLabel +
            " team might describe responsible AI use at work."
        },
        {
          heading: "Tools in scope (from inventory)",
          body: tools
        },
        {
          heading: "Allowed use",
          body:
            "Staff may use approved AI tools to draft, summarise, and explore ideas. Outputs that leave the organisation, affect a client, or influence a decision about a person must be reviewed by a human before they are acted on."
        },
        {
          heading: "Data rules",
          body:
            "Do not paste secrets, passwords, or special-category personal data into public AI tools. Prefer tools and settings that match the sensitivity of the work. When client or confidential material is involved, follow the firm's confidentiality and NDA rules first."
        },
        {
          heading: "Literacy and records",
          body:
            "People who use AI in their role complete a short, role-aware literacy path and keep a dated record of that measure. This Evidence Pack practice is educational — organisations should adapt records to their own governance process."
        },
        {
          heading: "Escalation",
          body:
            "If an AI output looks wrong, biased, or unsafe — or if you are unsure whether data may be shared — stop and ask a partner, ops lead, or compliance contact before continuing."
        }
      ]
    };
  }

  var policy = buildPolicy(intake.answers && intake.answers.sector, inventory);
  MoreaStore.setJSON("policy", policy);

  var content = document.getElementById("policy-content");
  var html =
    '<p class="dossier-label">Illustrative only · not legal advice</p>' +
    "<h1>" +
    escapeHtml(policy.title) +
    "</h1>";
  policy.sections.forEach(function (s) {
    html +=
      '<div class="dossier" style="margin-top:16px;"><h3>' +
      escapeHtml(s.heading) +
      "</h3><p>" +
      escapeHtml(s.body) +
      "</p></div>";
  });
  html +=
    '<p style="margin-top:24px;">' +
    '<a class="btn btn-primary" href="/register.html">Include in Evidence Pack</a> ' +
    '<a class="btn btn-secondary" href="/register.html" id="skip-policy">Skip policy draft</a>' +
    "</p>";
  content.innerHTML = html;

  document.getElementById("skip-policy").addEventListener("click", function () {
    MoreaStore.setJSON("policy", {
      skipped: true,
      illustrative: true,
      generatedAt: new Date().toISOString()
    });
  });

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
