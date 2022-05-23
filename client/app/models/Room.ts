import {IUser} from "./User";

export const PRIVATE_ROOM = "PRIVATE_ROOM"
export const GROUP_ROOM = "GROUP_ROOM"

export interface IRoom {
    _id: string;
    name: string;
    owner?: IUser;
    avatar: string;
    members: IUser[];
    room_type: string;
    total_message: number
}