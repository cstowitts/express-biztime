const express = require("express");
const { NotFoundError } = require("../expressError");

const db = require("../db");
const router = new express.Router();


/** Returns list of companies, like {companies: [{code, name}, ...]} */
router.get("/", async function (req, res) {
  const results = await db.query(
    `SELECT code, name, description
    FROM companies`);
  const companies = results.rows;
  return res.json({ companies });
})


/** Return obj of company: {company: {code, name, description}}
 * If the company given cannot be found, 
 * this should return a 404 status response. 
 * */
router.get("/:code", async function (req, res) {
  const code = req.params.code;
  const results = await db.query(
    `SELECT code, name, description
          FROM companies
          WHERE code = $1`, [code]
  );
  const companies = results.rows[0];
  if (!companies) {
    throw new NotFoundError('Company code does not exist!')
  };

  return res.json({ companies });
})


/** Adds a company.
 * Needs to be given JSON like: {code, name, description}
 * Returns obj of new company: {company: {code, name, description}}
 * */
router.post("/", async function (req, res) {
  const { code, name, description } = req.body;

  const results = await db.query(
    `INSERT INTO companies(code, name, description)
    VALUES ($1, $2, $3)
    RETURNING code, name, description`, [code, name, description]
  );

  const company = results.rows[0];
  return res.status(201).json({ company });
})

/** Edit existing company.
 * Should return 404 if company cannot be found.
 * Needs to be given JSON like: {name, description}
 * Returns update company object: {company: {code, name, description}}
 * */
router.put("/:code", function (req, res) {

})


/** Deletes company.
 * Should return 404 if company cannot be found.
 * Returns {status: "deleted"}
 * */
router.delete("/:code", function (req, res) {

})




module.exports = router;