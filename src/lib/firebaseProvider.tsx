import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/messaging';
import { IUser } from '../constants/types';
import messaging from '@react-native-firebase/messaging';
import { serverKey } from '../constants/constants';

//Sign Up
export const DoSignUp = async (email: string,
    password: string, name: string) => {
    return await auth()
        .createUserWithEmailAndPassword(email, password).then(async (newUser) => {
            console.log('Success Sign Up : ', newUser);
            //Save User Data to Firestore
            try { await SaveUser(newUser, name); } catch (error) { return { result: null, error: 'Failed sign up' }; }
            return { result: newUser, error: null };
        }).catch((error) => {
            console.log('Error Sign Up : ', error);
            var errorMessage = error.message;
            return { result: null, error: errorMessage };
        });
};

//Sign In
export const DoSignIn = async (email: string,
    password: string,) => {
    return await auth()
        .signInWithEmailAndPassword(email, password).then((loggedInUser) => {
            //Update user firebase token
            UpdateUserToken(loggedInUser.user.uid);
            console.log('Success Sign In : ', loggedInUser);
            return { result: loggedInUser, error: null };
        }).catch((error) => {
            console.log('Error Sign In : ', error);
            var errorMessage = error.message;
            return { result: null, error: errorMessage };
        });
};

//Sign Out
export const DoSignOut = async () => {
    return await auth()
        .signOut().then(() => {
            //Delete Firebase Token
            messaging().deleteToken();
            return true;
        }).catch((error) => {
            console.error(error);
            return false;
        });
};

//Get Firebase Token
const getToken = async () => {
    try {
        const token = await firebase.messaging().getToken();
        if (token) { return token; }
    } catch (error) {
        console.log(error);
    }
};

//Save User Data to Firestore
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
            token: token,
        });
    });
};

//get user by UID
export const getUserByUid = (uid: string) => {
    return firestore().collection('users').doc(uid).get();
};

//delete chat by uid
export const deleteChatByUID = async (uid: string) => {
    var colRef = firestore().collection('messages').doc(uid).collection('messages');
    await colRef.get().then((querySnapshot) => {
        Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
    });
    await firestore().collection('messages').doc(uid).delete();
};

//get all user
export const getUsers = () => {
    return firestore().collection('users').get();
};

//update user data
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

//Update User Firebase Token
export const UpdateUserToken = (uid) => {
    return getToken().then(async (token) => {
        await firestore().collection('users').doc(uid.toString()).update({
            token: token,
        });
    });
};

//get user by UID
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

//get messages by group UID
export const getMessageByGroupUid = async (fromUid: string, toUid: string) => {
    //group UID
    var groupUid = fromUid + toUid;

    try {
        let groupChat: FirebaseFirestoreTypes.DocumentData;
        //get message
        groupChat = await (await firestore().collection('messages').doc(groupUid).collection('messages').get()).query.orderBy('createdAt', 'desc').get();
        //set data to array
        const data: Array<FirebaseFirestoreTypes.DocumentData> = [];
        groupChat.docs.forEach((doc) => {
            const x = doc.data();
            console.log(doc.id, ' => ', x);
            data.push(x);
        });
        return { result: data };
    } catch (e) {
        console.log('error getMessageByGroupUid : ', e);
    }
};

//sent message
export const sentMessage = async (fromUser: IUser, toUser: IUser, content: string, type: string) => {
    const user1 = fromUser.uid.toString();
    const user2 = toUser.uid.toString();
    var groupUid1 = user1 + user2;
    var groupUid2 = user2 + user1;

    try {
        //set data message 1
        await firestore().collection('messages').doc(groupUid1).set({
            fromUsers: [fromUser.uid],
            toUsers: [toUser.uid],
            lastChatUID: fromUser.uid,
            lastChat: content,
            type: type,
            createdAt: new Date().valueOf(),
            read: false,
            isOpen: true,
            unRead: 0,
        }).then(async () => {
            //set data content message 1
            await firestore().collection('messages').doc(groupUid1).collection('messages').add({
                fromUid: fromUser.uid,
                toUserUid: toUser.uid,
                content: content,
                createdAt: new Date().valueOf(),
                type: type.toString(),
            });
        });
        //get current message to get unread
        firestore().collection('messages').doc(groupUid2).get().then(async (val) => {
            let x = val.data();
            let unReadDoc = 0;
            if (x !== undefined) {
                let i = parseInt(x.unRead.toString(), 10);
                unReadDoc = i + 1;
                console.log('unread msg ', unReadDoc);
            }
            //set data message 2
            await firestore().collection('messages').doc(groupUid2).set({

                fromUsers: [toUser.uid],
                toUsers: [fromUser.uid],
                lastChatUID: fromUser.uid,
                lastChat: content,
                type: type,
                createdAt: new Date().valueOf(),
                read: true,
                isOpen: false,
                unRead: unReadDoc,
            });

            //set data content message 2
            await firestore().collection('messages').doc(groupUid2).collection('messages').add({
                fromUid: fromUser.uid,
                toUserUid: toUser.uid,
                content: content,
                createdAt: new Date().valueOf(),
                type: type.toString(),
            });
        });
        pushNotification(toUser.token, toUser.name, content, toUser.avatar);
    } catch (e) {
        console.log('errorSentMessage', e);
    }
};

//read message
export const readMsg = async (fromUid: string, toUid: string, isToOpen: boolean) => {
    let groupUID1 = fromUid + toUid;
    let groupUID2 = toUid + fromUid;

    try {
        if (isToOpen) {
            await firestore().collection('messages').doc(groupUID1).update({
                isOpen: true,
                unRead: 0,
                read: true,
            });
            await firestore().collection('messages').doc(groupUID2).update({
                read: true,
            });
        } else {
            await firestore().collection('messages').doc(groupUID2).update({
                read: true,
            });
        }

        console.log('readMsg Chat');
    } catch (e) {
        console.log('error getMessageByGroupUid : ', e);
    }
};

//Push Notification
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

//Get Recent Chat
export const getRecentChat = async (user: IUser) => {
    try {
        return firestore().collection('messages').where('fromUsers', 'array-contains-any', [user]).onSnapshot((querySnapshot) => {
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
