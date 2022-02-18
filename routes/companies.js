const express = require("express");
const { NotFoundError,
  BadRequestError,
} = require("../expressError");

const db = require("../db");
const router = new express.Router();

//DB REQS ARE ASYNC, MUST BE AWAITED DON'T FORGET


/** Returns list of companies, returns {companies: [{code, name}, ...]} */
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
  const company = results.rows[0];
  if (!company) {
    throw new NotFoundError('Company code does not exist!')
  };

  return res.json({ company });
})


/** Adds a company.
 * Needs to be given JSON: {code, name, description}
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
router.put("/:code", async function (req, res) {
  const { name, description } = req.body;

  if (!req.body.name || !req.body.description) {
    throw new BadRequestError(`Don't forget to send over 'name' and 'description' info!`);
  }
  const code = req.params.code;

  const results = await db.query(
    `UPDATE companies 
        SET name = $2, description = $3
        WHERE code = $1
        RETURNING code, name, description`,
    [code, name, description]
  )
  const company = results.rows[0];

  if (!company) {
    throw new NotFoundError(`${code} is not a valid company!`);
  }

  return res.json({ company });
})


/** Deletes company.
 * Should return 404 if company cannot be found.
 * Returns {status: "deleted"}
 * */
router.delete("/:code", async function (req, res) {
  const code = req.params.code;

  // removes results variable
  const results = await db.query(
    `DELETE FROM companies
    WHERE code = $1
    RETURNING code`, [code]);

  if (results.rows.length === 0) {
    throw new NotFoundError("Company not found, did not delete anything. haha.");
  }
  // returning -> something from what was just deleted (it's possible to send data from a deleted element) or try looking into what results properties there are

  return res.json({ status: "deleted" });
})



module.exports = router;