import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
const auth = getAuth();

const signUpUser = async (email, password) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      errorMessage;
      // ..
    });
};

const signInUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      user;
      return user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      errorMessage;
    });
};

const checkAuthObserver = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      user + ': ' + user.uid;
      return user;
      // ...
    } else {
      // User is signed out
      // ...
      ('user signed out');
    }
  });
};
