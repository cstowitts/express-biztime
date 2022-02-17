const express = require("express");

const db = require("../db");
const router = new express.Router();


/** Returns list of companies, like {companies: [{code, name}, ...]} */
router.get("/", function(req, res){

})

/** Return obj of company: {company: {code, name, description}}
 * If the company given cannot be found, 
 * this should return a 404 status response. 
 * */
router.get("/:code", function(req, res){

})


/** Adds a company.
 * Needs to be given JSON like: {code, name, description}
 * Returns obj of new company: {company: {code, name, description}}
 * */
router.post("/", function(req, res){

})

/** Edit existing company.
 * Should return 404 if company cannot be found.
 * Needs to be given JSON like: {name, description}
 * Returns update company object: {company: {code, name, description}}
 * */
router.put("/:code", function(req, res){

})


/** Deletes company.
 * Should return 404 if company cannot be found.
 * Returns {status: "deleted"}
 * */
router.delete("/:code", function(req, res){

})




module.exports = router;