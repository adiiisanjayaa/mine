import dayjs from 'dayjs';
import {
  INotification,
} from './types';


// notifications
export const NOTIFICATIONS: INotification[] = [
  {
    id: 1,
    subject: 'New Message',
    message: 'You have a new message from the owner.',
    type: 'document',
    business: true,
    read: false,
    createdAt: dayjs().subtract(2, 'h').toDate(),
  },
  {
    id: 2,
    subject: 'New Order',
    message: 'A confirmed request by one client.',
    type: 'extras',
    business: true,
    read: false,
    createdAt: dayjs().subtract(4, 'h').toDate(),
  },
  {
    id: 3,
    subject: 'New Likes',
    message: 'Your posts have been liked by 2,342.',
    type: 'notification',
    business: true,
    read: true,
    createdAt: dayjs().subtract(6, 'h').toDate(),
  },
  {
    id: 4,
    subject: 'Last Message',
    message: 'Your posts have been liked by 2,342.',
    type: 'document',
    business: true,
    read: true,
    createdAt: dayjs().subtract(2, 'd').toDate(),
  },
  {
    id: 5,
    subject: 'Check your profile',
    message: 'Your profile has new updates.',
    type: 'profile',
    business: true,
    read: true,
    createdAt: dayjs().subtract(3, 'd').toDate(),
  },
  {
    id: 6,
    subject: 'Product Update',
    message: 'Your product has been updated',
    type: 'documentation',
    business: true,
    read: true,
    createdAt: dayjs().subtract(2, 'w').toDate(),
  },
  {
    id: 7,
    subject: 'Last Message',
    message: 'Your posts have been liked by 2,342.',
    type: 'document',
    business: true,
    read: true,
    createdAt: dayjs().subtract(3, 'w').toDate(),
  },
  {
    id: 8,
    subject: 'Learn new things',
    message:
      'Like so many organizations these days, Autodesk is a company in transition. It was until recently.',
    type: 'document',
    business: false,
    read: false,
    createdAt: dayjs().subtract(2, 'h').toDate(),
  },
  {
    id: 9,
    subject: 'Give your best',
    message:
      'The time is now for it to be okay to be great. People in this world shun people for being great. For being a bright color.',
    type: 'payment',
    business: false,
    read: false,
    createdAt: dayjs().subtract(9, 'h').toDate(),
  },
  {
    id: 10,
    subject: 'Come and meet us',
    message:
      'Technology is applied science. Science is the study of nature. Mathematics is the language of nature.',
    type: 'office',
    business: false,
    read: false,
    createdAt: dayjs().subtract(12, 'h').toDate(),
  },
];

export default {
  NOTIFICATIONS,
};
