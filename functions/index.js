const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// http request and response random number just for test
// exports.randomNumber = functions.https.onRequest((req, res) => {
//   const number = Math.round(Math.random() * 100);
//   res.send(number.toString());
// });

// Auth trigger (new user signup)
exports.userSignUp = functions.auth.user().onCreate(user => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    upvotedOn: [],
  });
});

// Auth trigger (delete user)
exports.userDeleted = functions.auth.user().onDelete(user => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});
