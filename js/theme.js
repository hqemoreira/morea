(function () {
  var MOON_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
  var SUN_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateIcon(theme) {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.innerHTML = theme === "dark" ? SUN_ICON : MOON_ICON;
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("morea-theme", theme);
      try { localStorage.setItem("litrix-theme", theme); } catch (e2) {}
    } catch (e) {}
    updateIcon(theme);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateIcon(currentTheme());
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        setTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    }
  });
})();
