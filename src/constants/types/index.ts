import {ITheme} from './theme';

export * from './components';
export * from './theme';

export interface IUser {
  id: number | string;
  name?: string;
  department?: string;
  avatar?: string;
  stats?: {posts?: number; followers?: number; following?: number};
  social?: {twitter?: string; dribbble?: string};
  about?: string;
}

export interface IUseData {
  isDark: boolean;
  handleIsDark: (isDark?: boolean) => void;
  theme: ITheme;
  setTheme: (theme?: ITheme) => void;
  user: IUser;
  users: IUser[];
  handleUser: (data?: IUser) => void;
  handleUsers: (data?: IUser[]) => void;
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
