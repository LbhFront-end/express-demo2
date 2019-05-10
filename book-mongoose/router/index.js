const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const Book = require('../models/Book');
const Student = require('../models/Student');
const Class = require('../models/Class');


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

router.get('/deletebook', (req, res, next) => {
  const { id } = req.query;
  Book.deleteBook(id, (err, result) => {
    if (err) return res.json(err)
    res.json(result)
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

router.get('/student', (req, res, next) => {
  Student.updateOne({ name: "小明" }, { $set: { age: 22 } }, (err, result) => {
    if (err) return res.json(err)
    res.json(result)
  })
})

router.get('/class', (req, res, next) => {
  Class.findOne({ name: "数学" }, (err, myclass) => {
    if (err) return res.json(err)
    Student.findOne({ name: myclass.students[0].name }, (err, student) => {
      student.age += 1;
      student.save((err, newStudent) => {
        if (err) return res.json(err)
        myclass.students.push(newStudent)
        myclass.save()
      });
    })
  })
})

module.exports = router;

function getStudent(json) {
  Student.findOne(json, (err, result) => {
    return new Promise((resolve, reject) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

