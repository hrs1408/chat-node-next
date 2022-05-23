import {IRoom} from "./Room";
import {IUser} from "./User";

export interface IMessage {
    _id: string;
    room: IRoom | string,
    owner?: IUser,
    text: string,
    image: string[],
    message_type: MessageType;
}

export type MessageType = 'message' | 'notify';