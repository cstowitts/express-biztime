"use strict";

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let pear;

beforeEach(async function () {
  await db.query("DELETE FROM companies");
  let result = await db.query(
    `INSERT INTO companies
    VALUES ('pear', 'Pear IncorPEARated', 'creators of pear programming')`);
  pear = result.rows[0];
});


/** Get /companies, 
 * Returns list of companies, returns {companies: [{code, name}, ...]} 
 */

describe("GET /companies", function () {
  test("gets the list of one company", async function () {
    const resp = await request(app).get('/companies');
    expect(resp.body).toEqual({
      "companies": [
        {
          "code": "pear",
          "name": "Pear IncorPEARated",
          "description": "creators of pear programming"
        }
      ]
    });
  })
})

