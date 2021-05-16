const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { ensureAuth, ensureGuest } = require("../middlewares/auth");

// @desc Login/Landing-Page
// @routes GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
});

// @desc Library
// @routes GET /library
router.get("/library", ensureAuth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).lean();
    res.render("library", {
      name: req.user.firstName,
      books,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
