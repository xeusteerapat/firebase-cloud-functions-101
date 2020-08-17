const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');

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

// Add new request
requestForm.addEventListener('submit', e => {
  e.preventDefault();

  const addRequest = firebase.functions().httpsCallable('addRequest');
  addRequest({
    text: requestForm.request.value,
  })
    .then(() => {
      requestForm.reset();
      requestModal.classList.remove('open');
      requestForm.querySelector('.error').textContent = '';
    })
    .catch(err => {
      requestForm.querySelector('.error').textContent = err.message;
    });
});
