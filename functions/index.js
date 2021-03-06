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

// Upvote callable function
exports.upvote = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please login before add requests'
    );
  }

  const user = admin.firestore().collection('users').doc(context.auth.uid);
  const request = admin.firestore().collection('requests').doc(data.id);

  const doc = await user.get();
  // check thew user hasn't already upvoted
  if (doc.data().upvotedOn.includes(data.id)) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'You can only vote something up once'
    );
  }
  // update the array in user document
  await user.update({
    upvotedOn: [...doc.data().upvotedOn, data.id],
  });
  // update the votes on the request
  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1),
  });
});

// Demo firestore trigger for tracking activity
exports.logActivities = functions.firestore
  .document('/{collection}/{id}')
  .onCreate((snap, context) => {
    console.log(snap.data());
    const { collection, id } = context.params;
    const activites = admin.firestore().collection('activities');

    if (collection === 'requests') {
      return activites.add({ text: 'a new tutorial requests was added' });
    }

    if (collection === 'users') {
      return activites.add({ text: 'a new user signed up' });
    }

    return null;
  });
