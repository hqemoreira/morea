/** Morea session helpers — prefers morea_* keys, falls back to legacy litrix_*. */
window.MoreaStore = {
  get: function (key) {
    return (
      sessionStorage.getItem("morea_" + key) ||
      sessionStorage.getItem("litrix_" + key)
    );
  },
  set: function (key, value) {
    sessionStorage.setItem("morea_" + key, value);
  },
  getJSON: function (key) {
    var raw = this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },
  setJSON: function (key, obj) {
    this.set(key, JSON.stringify(obj));
  },
  /** Map intake role → literacy track for dual curricula. */
  trackFromRole: function (role) {
    if (role === "founder" || role === "compliance" || role === "partner_ops") {
      return "partner_ops";
    }
    return "staff";
  }
};
