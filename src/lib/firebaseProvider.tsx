import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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
        name: data.user.displayName,
        address: null,
        website: null,
        email: data.user.email,
        avatar: data.user.photoURL,
        backgroundImage: null,
    });
};

export const getUserByUid = (uid: string) => {
    return firestore().collection('users').doc(uid).get();
};

export const getUsers = () => {
    return firestore().collection('users').get();
};

export const UpdateUser = (data: IUser) => {
    return firestore().collection('users').doc(data.uid.toString()).update({
        name: data.name,
        address: data.address,
        website: data.website,
        email: data.email,
        avatar: data.avatar,
        backgroundImage: data.backgroundImage,
    });
};

export const getMessageByGroupUid = async (fromUid: string, toUid: string) => {
    const groupUid1 = fromUid + toUid;
    const groupUid2 = toUid + fromUid;

    try {
        let groupChat: FirebaseFirestoreTypes.DocumentData;
        const groupChat1 = await (await firestore().collection('messages').doc(groupUid1).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
        if (groupChat1.empty) {
            groupChat = await (await firestore().collection('messages').doc(groupUid2).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
            console.log('groupUid1 not found');
            if (!groupChat.empty) {
                console.log('groupUid2 not found');
            }
        } else {
            const data: Array<FirebaseFirestoreTypes.DocumentData> = [];
            groupChat1.docs.forEach((doc) => {
                const x = doc.data();
                console.log(doc.id, ' => ', x);
                data.push(x);
            });
            return data;
        }
    } catch (e) {
        console.log('error getMessageByGroupUid : ', e);
    }
};

export const sentMessage = async (groupUid: string, fromUser: IUser, toUser: IUser, content: string, type: string) => {
    try {
        const sent = await firestore().collection('messages').doc(groupUid).collection('messages').add({
            fromUid: fromUser.uid,
            toUserUid: toUser.uid,
            content: content,
            createdAt: new Date().valueOf(),
            type: type.toString(),
        });
        console.log('sentMessage Chat : ', sent);
        return sent;
    } catch (e) {
        console.log('errorSentMessage', e);
    }
};
