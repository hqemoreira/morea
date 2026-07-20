const { neon } = require("@neondatabase/serverless");

let sqlClient;

function getSql() {
  if (!sqlClient) {
    if (!process.env.NEON_DATABASE_URL) {
      throw new Error("NEON_DATABASE_URL is not set");
    }
    sqlClient = neon(process.env.NEON_DATABASE_URL);
  }
  return sqlClient;
}

module.exports = { getSql };
