import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const DoSignUp = async (email: string,
    password: string,) => {
    return await auth()
        .createUserWithEmailAndPassword(email, password).then(async (newUser) => {
            try { await SaveUser(newUser); } catch (error) { return { result: null, error: 'Failed sign up' }; }
            return { result: newUser, error: null };
        }).catch((error) => {
            console.error(error);
            var errorMessage = error.message;
            return { result: null, error: errorMessage };
        });
};

export const DoSignIn = async (email: string,
    password: string,) => {
    return await auth()
        .signInWithEmailAndPassword(email, password).then((loggedInUser) => {
            return { result: loggedInUser, error: null };
        }).catch((error) => {
            console.error(error);
            var errorMessage = error.message;
            return { result: null, error: errorMessage };
        });
};

export const SaveUser = (data: FirebaseAuthTypes.UserCredential) => {
    return firestore().collection('users').doc(data.user.uid).set({
        uid: data.user.uid,
        name: data.user.displayName ?? '',
        address: '',
        website: '',
        email: data.user.email ?? '',
        avatar: data.user.photoURL ?? '',
        backgroundImage: '',
    });
};
