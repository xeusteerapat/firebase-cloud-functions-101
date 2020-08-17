const functions = require('firebase-functions');
const { firebaseConfig } = require('firebase-functions');

// http request and response random number
exports.randomNumber = functions.https.onRequest((req, res) => {
  const number = Math.round(Math.random() * 100);
  res.send(number.toString());
});

// http request and redirect
exports.toTheXeus = functions.https.onRequest((req, res) => {
  res.redirect('https://github.com/xeusteerapat');
});

// http callable function
exports.greeting = functions.https.onCall((data, context) => {
  const { name } = data;
  return `Hello, My Name is ${name}`;
});
