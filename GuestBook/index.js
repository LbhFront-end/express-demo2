const express = require('express');
const db = require('./model/db.js');

const app = express();

// app.get('/', (req, res) => {
//   db.insertOne('resturants', {
//     name: 'haha1',
//     age: parseInt(Math.random() * 100 + 10)
//   }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

// app.get('/student', (req, res) => {
//   const { page } = req.query;
//   db.find('resturants', {}, { pageAmount: 10, page: parseInt(page) }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

// app.get('/delete', (req, res) => {
//   const age = parseInt(req.query.age);
//   db.deleteMany('resturants', { age }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

// app.get('/modify', (req, res) => {
//   const age = parseInt(req.query.age);
//   db.updateMany('resturants', { age }, {
//     $set: {
//       work: 'frontend'
//     }
//   }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

app.listen(3000);

