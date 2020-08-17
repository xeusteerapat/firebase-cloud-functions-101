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

// http callable function (adding tutorial requests)
exports.addRequest = functions.https.onCall((data, context) => {
  const { text } = data;
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please login before add requests'
    );
  }

  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Request must be no more than 30 characters long'
    );
  }

  return admin
    .firestore()
    .collection('requests')
    .add({
      text,
      upvotes: 0,
    })
    .then(() => 'new request added')
    .catch(() => {
      throw new functions.https.HttpsError('internal', 'request not added');
    });
});
