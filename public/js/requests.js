var app = new Vue({
  el: '#app',
  data: {
    requests: [],
  },
  methods: {
    upvoteRequest(id) {
      const upvote = firebase.functions().httpsCallable('upvote');
      upvote({ id }).catch(err => console.log(err.message));
    },
  },
  mounted() {
    const ref = firebase.firestore().collection('requests');

    ref.onSnapshot(snapshot => {
      let requests = [];
      snapshot.forEach(doc => {
        requests.push({ ...doc.data(), id: doc.id });
      });
      this.requests = requests;
    });
  },
});
