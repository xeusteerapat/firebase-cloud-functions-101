const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', e => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

// Invoke greeting function
// const button = document.querySelector('.call');
// button.addEventListener('click', () => {
// Get function reference from firebase
//   const greeting = firebase.functions().httpsCallable('greeting');
//   greeting({ name: 'Teerapat Prommarak' }).then(result => {
//     console.log(result.data);
//   });
// });
