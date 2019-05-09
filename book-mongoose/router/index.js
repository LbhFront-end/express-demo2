const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const Book = require('../models/Book');

router.get('/', (req, res, next) => {
  Book.getBooks((err, books) => {
    if (err) throw Error(err);
    res.render('index', {
      books
    });
  })
})

router.get('/addbook', (req, res, next) => {
  res.render('book');
})

router.get('/editbook', (req, res, next) => {
  const { id } = req.query
  Book.getBook(id, (err, book = []) => {
    console.log(book)
    if (err) return res.json({ err });
    res.render('editbook', {
      book
    });
  })
})

router.post('/editbook', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    Book.editBook(fields, (err, result) => {
      if (err) return res.json(err);
      res.json(result)
    })
  })
})


router.post('/addbook', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) throw Error(err);
    Book.addBook(fields, (status, result) => {
      if (status.code === -1) {
        res.json(status)
      } else if (status.code === 1) {
        res.json(status)
      }
    })
  })
});

module.exports = router;