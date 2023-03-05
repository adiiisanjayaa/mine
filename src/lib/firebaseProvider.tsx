import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { IUser } from '../constants/types';

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

export const SaveUser = (data: FirebaseAuthTypes.UserCredential, name: string) => {
    return firestore().collection('users').doc(data.user.uid).set({
        uid: data.user.uid,
        name: name,
        address: null,
        website: null,
        email: data.user.email,
        avatar: data.user.photoURL,
        backgroundImage: null,
        chatWith: [],
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

// export async function getRecentChat(user: IUser): FirebaseFirestoreTypes.DocumentData[] {
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
        }).then(async () => {
            console.log('sent message...');
            await firestore().collection('messages').doc(groupUid).collection('messages').add({
                fromUid: fromUser.uid,
                toUserUid: toUser.uid,
                content: content,
                createdAt: new Date().valueOf(),
                type: type.toString(),
            });
        });
        console.log('sentMessage Chat : ', sent);
        return sent;
    } catch (e) {
        console.log('errorSentMessage', e);
    }
};

// export async function getRecentChat(user: IUser): FirebaseFirestoreTypes.DocumentData[] {
//     try {
//         await firestore().collection('messages').where('users', 'array-contains-any', [user]).onSnapshot((querySnapshot) => {
//             const data: Array<FirebaseFirestoreTypes.DocumentData> = [];
//             querySnapshot.docs.map((doc) => {
//                 const x = doc.data();
//                 console.log(doc.id, ' => ', x);
//                 data.push(x);
//             });
//             return data;
//         });
//     } catch (e) {
//         console.log('error getRecentChat', e);
//     }
//     return [];
// }

export const getRecentChat2 = async (user: IUser) => {
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
        console.log('error getRecentChat2', e);
    }
};
