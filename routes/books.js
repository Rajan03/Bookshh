const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const { ensureAuth } = require("../middlewares/auth");

// @desc Show Add Page
// @routes GET /books/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("books/add");
});

// @desc get Books Page
// @routes GET /books
router.get("/", ensureAuth, async (req, res) => {
  try {
    const books = await Book.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("books/index", {
      books,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc Show Edit Page
// @routes GET /books/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
    }).lean();
    if (!book) {
      return res.send("404 Error!! Not found THis Book");
    }
    if (book.user != req.user.id) {
      res.redirect("/books");
    } else {
      res.render("books/edit", {
        book,
      });
    }
  } catch (err) {
    console.log(err);
    res.send("Error 500");
  }
});

// @desc Show single Book
// @routes GET /books/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("user").lean();
    if (!book || (book.user._id != req.user.id && book.status == "private")) {
      return res.send("404 Error!! Not found this Book");
    }
    res.render("books/show", {
      book,
    });
  } catch (err) {
    console.log(err);
    res.send("Error 500");
  }
});

// @desc Show All Books from Single User
// @routes GET /books/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const books = await Book.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("books/userBooks", {
      books,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc Process add form
// @routes POST /books
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Book.create(req.body);
    res.redirect("/library");
  } catch (err) {
    console.log(err);
  }
});

// @desc    Update book
// @route   PUT /books/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.send("404 Error!!");
    }

    if (book.user != req.user.id) {
      res.redirect("/books");
    } else {
      book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/library");
    }
  } catch (err) {
    console.error(err);
    return res.send("500 Error!!");
  }
});

// @desc Delete Book
// @routes DELETE /books/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Book.remove({ _id: req.params.id });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("500 Error!!");
  }
});
module.exports = router;
