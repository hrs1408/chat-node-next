import { IRoom } from "./Room";

export interface IUser {
    _id: string;
    email: string;
    full_name: string;
    avatar: string;
    phone: string;
    address: string;
    rooms: IRoom[];
    friends: IUser[];
    friend_pending: IUser[];
    is_first_login: boolean;
}
