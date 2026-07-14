const { getSessionUser } = require("../../lib/auth");

module.exports = async (req, res) => {
  const user = await getSessionUser(req);
  res.status(200).json({ user: user || null });
};
