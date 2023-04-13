import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/messaging';
import { IUser } from '../constants/types';
import messaging from '@react-native-firebase/messaging';
import { serverKey } from '../constants/constants';

export const DoSignUp = async (email: string,
    password: string, name: string) => {
    return await auth()
        .createUserWithEmailAndPassword(email, password).then(async (newUser) => {
            try { await SaveUser(newUser, name); } catch (error) { return { result: null, error: 'Failed sign up' }; }
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
            UpdateUserToken(loggedInUser.user.uid);
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
            messaging().deleteToken();
            return true;
        }).catch((error) => {
            console.error(error);
            return false;
        });
};

const getToken = async () => {
    try {
        const token = await firebase.messaging().getToken();
        if (token) { return token; }
    } catch (error) {
        console.log(error);
    }
};

export const SaveUser = (data: FirebaseAuthTypes.UserCredential, name: string) => {
    return getToken().then(async (token) => {
        await firestore().collection('users').doc(data.user.uid).set({
            uid: data.user.uid,
            name: name,
            address: null,
            website: null,
            email: data.user.email,
            avatar: data.user.photoURL,
            backgroundImage: null,
            chatWith: [],
            token: token,
        });
    });
};

export const UpdateUserChatWith = async (uid: string, chatWith: string) => {
    const docRef = firestore().collection('users').doc(uid);
    return firestore().runTransaction(transaction => {
        return transaction.get(docRef).then(snapshot => {
            var largerArray: [string] = snapshot.get('chatWith');
            if (!largerArray.includes(chatWith)) {
                largerArray?.push(chatWith);
                transaction.update(docRef, 'chatWith', largerArray);
            }
        });
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

export const UpdateUserToken = (uid) => {
    return getToken().then(async (token) => {
        await firestore().collection('users').doc(uid.toString()).update({
            token: token,
        });
    });
};

export async function GetUserByUid(data: string): Promise<IUser | undefined> {
    return await firestore().collection('users').doc(data.toString()).get().then((doc) => {
        const userChat = doc.data();
        if (userChat !== undefined) {
            const user: IUser = {
                uid: userChat.uid,
                name: userChat.name,
                email: userChat.email,
                avatar: userChat.avatar,
                address: userChat.address,
                backgroundImage: userChat.backgroundImage,
                website: userChat.website,
                token: userChat.token,
            };
            return user;
        } else {
            return undefined;
        }
    });
}

export const getMessageByGroupUid = async (fromUid: string, toUid: string) => {
    const groupUid1 = fromUid + toUid;
    const groupUid2 = toUid + fromUid;
    let groupUID = '';

    try {
        let groupChat: FirebaseFirestoreTypes.DocumentData;

        groupChat = await (await firestore().collection('messages').doc(groupUid1).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
        groupUID = groupUid1;
        if (groupChat.empty) {
            groupChat = await (await firestore().collection('messages').doc(groupUid2).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
            groupUID = groupUid2;
            console.log('groupUid1 not found');
            if (groupChat.empty) {
                console.log('groupUid2 not found');
            }
        }
        const data: Array<FirebaseFirestoreTypes.DocumentData> = [];
        groupChat.docs.forEach((doc) => {
            const x = doc.data();
            console.log(doc.id, ' => ', x);
            data.push(x);
        });
        return { result: data, groupUID: groupUID };

    } catch (e) {
        console.log('error getMessageByGroupUid : ', e);
    }
};

export const sentMessage = async (groupUid: string | undefined, fromUser: IUser, toUser: IUser, content: string, type: string) => {
    const user1 = fromUser.uid.toString();
    const user2 = toUser.uid.toString();
    try {
        const sent = await firestore().collection('messages').doc(groupUid).set({
            users: [fromUser.uid, toUser.uid],
            lastChat: content,
            type: type,
            createdAt: new Date().valueOf(),
            read: {
                user1: { uid: user1, read: true },
                user2: { uid: user2, read: false },
            },
            // { fromUser.uid.toString() }: true,
        }).then(async () => {
            console.log('sent message...');
            await firestore().collection('messages').doc(groupUid).collection('messages').add({
                fromUid: fromUser.uid,
                toUserUid: toUser.uid,
                content: content,
                createdAt: new Date().valueOf(),
                type: type.toString(),
            });
            pushNotification(toUser.token, toUser.name, content, toUser.avatar);
        });
        console.log('sentMessage Chat : ', sent);
        return sent;
    } catch (e) {
        console.log('errorSentMessage', e);
    }
};

export const readMsg = async (fromUid: string, toUid: string) => {
    const groupUid1 = fromUid + toUid;
    const groupUid2 = toUid + fromUid;
    let groupUID = '';

    try {
        let groupChat: FirebaseFirestoreTypes.DocumentData;

        groupChat = await (await firestore().collection('messages').doc(groupUid1).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
        groupUID = groupUid1;
        if (groupChat.empty) {
            groupChat = await (await firestore().collection('messages').doc(groupUid2).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
            groupUID = groupUid2;
            console.log('groupUid1 not found');
            if (groupChat.empty) {
                console.log('groupUid2 not found');
            }
        }
        try {
            const sent = await firestore().collection('messages').doc(groupUID).update({
                read: {
                    user1: { uid: fromUid, read: true },
                    user2: { uid: toUid, read: false },
                },
            });
            console.log('readMsg Chat : ', sent);
            return sent;
        } catch (e) {
            console.log('error readMsg', e);
        }

    } catch (e) {
        console.log('error getMessageByGroupUid : ', e);
    }
};

export const pushNotification = async (to: string | undefined, from: string | undefined, message: string, photoUrl: string | undefined) => {
    console.log('Notification Data: ', from, message, photoUrl, to);
    await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': serverKey,
        },
        body: JSON.stringify({
            'to': to,
            'notification': {
                'title': from,
                'body': message,
                'mutable_content': true,
            },
            'data': {
                'url': photoUrl,
            },
        }),
    }).then((response) => { console.log(response); });
};

export const getRecentChat = async (user: IUser) => {
    try {
        return firestore().collection('messages').where('users', 'array-contains-any', [user]).onSnapshot((querySnapshot) => {
            const threads = querySnapshot.docs.map((documentSnapshot) => {
                return {
                    _id: documentSnapshot.id,
                    // give defaults
                    name: '',
                    ...documentSnapshot.data(),
                };
            });
            return threads;
        });

    } catch (e) {
        console.log('error getRecentChat', e);
    }
};
