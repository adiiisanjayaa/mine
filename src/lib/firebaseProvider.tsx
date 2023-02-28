import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { IUser } from '../constants/types';

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

export const DoSignOut = async () => {
    return await auth()
        .signOut().then(() => {
            return true;
        }).catch((error) => {
            console.error(error);
            return false;
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

export const getUserByUid = (uid: string) => {
    return firestore().collection('users').doc(uid).get();
};

export const UpdateUser = (data: IUser) => {
    return firestore().collection('users').doc(data.uid.toString()).update({
        name: data.name ?? '',
        address: data.address ?? '',
        website: data.website ?? '',
        email: data.email ?? '',
        avatar: data.avatar ?? '',
        backgroundImage: data.backgroundImage ?? '',
    });
};
