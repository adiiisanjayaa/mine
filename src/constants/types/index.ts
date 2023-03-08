import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {ITheme} from './theme';

export * from './components';
export * from './theme';

export interface IUser {
  uid: number | string;
  name?: string;
  address?: string;
  email?: string;
  website?: string;
  avatar?: string;
  backgroundImage?: string;
  token?: string;
}

export interface IURecentChat {
  data: FirebaseFirestoreTypes.DocumentData;
  userData: Array<IUser>;
}

export interface IUseData {
  isDark: boolean;
  loading: boolean;
  setLoading: (loading?: boolean) => void;
  handleIsDark: (isDark?: boolean) => void;
  theme: ITheme;
  setTheme: (theme?: ITheme) => void;
  user: IUser;
  handleUser: (data?: IUser) => Promise<void>;
  updateUser: (data?: IUser) => Promise<void>;
  notifications: INotification[];
  handleNotifications: (data?: INotification[]) => void;
}

export interface INotification {
  id?: number;
  subject?: string;
  message?: string;
  read?: boolean;
  business?: boolean;
  createdAt?: number | Date;
  type:
    | 'document'
    | 'documentation'
    | 'payment'
    | 'notification'
    | 'profile'
    | 'extras'
    | 'office';
}
