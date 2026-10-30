(function () {
  var TOOLS = [
    { id: "chatgpt", label: "ChatGPT / OpenAI" },
    { id: "copilot", label: "Microsoft Copilot" },
    { id: "gemini", label: "Google Gemini" },
    { id: "claude", label: "Claude (Anthropic)" },
    { id: "mistral", label: "Mistral / Le Chat" },
    { id: "internal", label: "Internal / custom AI tool" },
    { id: "other", label: "Other" }
  ];

  var PURPOSES = [
    { value: "drafting", label: "Drafting / writing" },
    { value: "research", label: "Research / summarising" },
    { value: "client_work", label: "Client deliverables" },
    { value: "ops", label: "Internal ops / admin" },
    { value: "decisions", label: "Decisions about people" },
    { value: "other", label: "Other" }
  ];

  var SENSITIVITY = [
    { value: "none", label: "No client or personal data" },
    { value: "client", label: "Client / confidential work" },
    { value: "personal", label: "Personal data (people)" },
    { value: "unsure", label: "Not sure" }
  ];

  var form = document.getElementById("inventory-form");
  var listEl = document.getElementById("tool-list");

  TOOLS.forEach(function (tool) {
    var wrap = document.createElement("div");
    wrap.className = "inventory-tool";
    wrap.dataset.toolId = tool.id;

    var checkLabel = document.createElement("label");
    checkLabel.className = "option-row";
    var check = document.createElement("input");
    check.type = "checkbox";
    check.name = "tool_" + tool.id;
    check.value = tool.id;
    checkLabel.appendChild(check);
    checkLabel.appendChild(document.createTextNode(tool.label));
    wrap.appendChild(checkLabel);

    var details = document.createElement("div");
    details.className = "inventory-details";
    details.hidden = true;

    var purposeLabel = document.createElement("label");
    purposeLabel.textContent = "Main purpose";
    var purpose = document.createElement("select");
    purpose.name = "purpose_" + tool.id;
    PURPOSES.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.value;
      opt.textContent = p.label;
      purpose.appendChild(opt);
    });
    purposeLabel.appendChild(purpose);
    details.appendChild(purposeLabel);

    var sensLabel = document.createElement("label");
    sensLabel.textContent = "Data sensitivity";
    var sens = document.createElement("select");
    sens.name = "sensitivity_" + tool.id;
    SENSITIVITY.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.value;
      opt.textContent = s.label;
      sens.appendChild(opt);
    });
    sensLabel.appendChild(sens);
    details.appendChild(sensLabel);

    if (tool.id === "other") {
      var customLabel = document.createElement("label");
      customLabel.textContent = "Name of tool";
      var custom = document.createElement("input");
      custom.type = "text";
      custom.name = "custom_" + tool.id;
      custom.placeholder = "e.g. vendor name";
      customLabel.appendChild(custom);
      details.appendChild(customLabel);
    }

    wrap.appendChild(details);
    listEl.appendChild(wrap);

    check.addEventListener("change", function () {
      details.hidden = !check.checked;
    });
  });

  var noneRow = document.createElement("label");
  noneRow.className = "option-row";
  var noneCheck = document.createElement("input");
  noneCheck.type = "checkbox";
  noneCheck.id = "no-tools";
  noneCheck.name = "no_tools";
  noneRow.appendChild(noneCheck);
  noneRow.appendChild(
    document.createTextNode("We do not currently use AI tools at work")
  );
  listEl.appendChild(noneRow);

  noneCheck.addEventListener("change", function () {
    if (noneCheck.checked) {
      listEl.querySelectorAll('input[type="checkbox"][name^="tool_"]').forEach(function (cb) {
        cb.checked = false;
        cb.closest(".inventory-tool").querySelector(".inventory-details").hidden = true;
      });
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var tools = [];
    listEl.querySelectorAll(".inventory-tool").forEach(function (wrap) {
      var id = wrap.dataset.toolId;
      var cb = wrap.querySelector('input[type="checkbox"]');
      if (!cb || !cb.checked) return;
      var purpose = wrap.querySelector('select[name="purpose_' + id + '"]');
      var sens = wrap.querySelector('select[name="sensitivity_' + id + '"]');
      var custom = wrap.querySelector('input[name="custom_' + id + '"]');
      tools.push({
        id: id,
        label: TOOLS.find(function (t) {
          return t.id === id;
        }).label,
        customName: custom ? custom.value.trim() || null : null,
        purpose: purpose ? purpose.value : null,
        sensitivity: sens ? sens.value : null
      });
    });

    if (!noneCheck.checked && tools.length === 0) {
      var err = document.getElementById("inventory-error");
      err.textContent = "Select at least one tool, or confirm you use none.";
      err.style.display = "block";
      return;
    }

    var inventory = {
      tools: tools,
      none: !!noneCheck.checked,
      completedAt: new Date().toISOString()
    };
    MoreaStore.setJSON("inventory", inventory);
    window.location.href = "/assess.html";
  });
})();
