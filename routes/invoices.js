const express = require("express");
const { NotFoundError,
  BadRequestError,
} = require("../expressError");

const db = require("../db");
const router = new express.Router();


/**  Return info on invoices: returns {invoices: [{id, comp_code}, ...]} */
router.get("/", async function (req, res) {
  const results = await db.query(
    `SELECT id, comp_code, amt, paid, add_date, paid_date
            FROM invoices`
  );
  const invoices = results.rows;
  return res.json({ invoices });
})


/** Returns obj on given invoice.
 * If invoice cannot be found, returns 404.
 * Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}
 * */
router.get("/:id", async function (req, res) {
  const id = req.params.id;
  const results = await db.query(
    `SELECT id, comp_code, amt, paid, add_date, paid_date
            FROM invoices
            WHERE id = $1`, [id]
  );
  const invoice = results.rows[0];

  if (!invoice) {
    throw new NotFoundError('Invoice does not exist! Sucker!!')
  };

  const coResults = await db.query(
    `SELECT code, name, description
            FROM companies as c
            JOIN invoices as i 
            ON c.code = i.comp_code
            WHERE i.id = $1`, [id]
  );

  const company = coResults.rows[0];

  invoice.company = company;

  return res.json({ invoice });
})


/** Adds an invoice.
 * Needs to be passed in JSON body of: {comp_code, amt}
 * Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 * */
router.post("/", async function (req, res) {
  const { comp_code, amt } = req.body;

  const results = await db.query(
    `INSERT INTO invoices (comp_code, amt)
      VALUES ($1, $2)
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [comp_code, amt]
  );

  const invoice = results.rows[0];

  return res.json({ invoice });
})


/** Updates an invoice.
 * If invoice cannot be found, returns a 404.
 * Needs to be passed in a JSON body of {amt}
 * Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 * */
router.put("/:id", async function (req, res) {
  const id = req.params.id;
  const amt = req.body.amt;

  const results = await db.query(
    `UPDATE invoices
      SET amt = $1
      WHERE id = $2
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [amt, id]
  );

  const invoice = results.rows[0];

  if (!invoice) {
    throw new NotFoundError("We didn't find the invoice to update, it's free!");
  }

  return res.json({ invoice });
})


/** Deletes an invoice.
 * If invoice cannot be found, returns a 404.
 * Returns: {status: "deleted"}
 * */
router.delete("/:id", async function (req, res) {
    const id = req.params.id;

    const results = await db.query(
        `DELETE FROM invoices
        WHERE id = $1
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [id]
    );

    // console.log("results obj = ", results);

    if (results.rows.length === 0) {
        throw new NotFoundError("Invoice not found, nothing deleted.");
    };

    return res.json({ status: "invoice deleted" });

})






module.exports = router;