import React, {createContext, useEffect} from 'react';
import {io} from 'socket.io-client';
import {useGetUserQuery} from "../app/services/User.service";
import {IUser} from "../app/models/User";
import {useAppDispatch} from "../app/hook";
import {addFriendRequest, deleteRoom, newRoom} from "../app/features/User.slice";
import {toast} from "react-toastify";
import {IRoom} from "../app/models/Room";
import {useSendMessageMutation} from "../app/services/Message.service";

const URL = process.env.URL_SERVER || 'http://localhost:4000';

const socket = io(URL);

export const SocketContext = createContext(socket);

interface IProps {

}

type FriendAccept = {
    user: IUser,
    room: IRoom,
    message?: string
}

const SocketProvider: React.FC<IProps> = ({children}) => {
    const {data: user, refetch} = useGetUserQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user) {
            const u = {
                ...user?.body,
                rooms: user?.body?.rooms ? user?.body.rooms : []
            }
            socket.emit('user_connected', u)
        }

        socket.on('friend_pending', (data: IUser) => {
            dispatch(addFriendRequest(data))
            toast.info(`${data.email} đã gửi lời mời kết bạn`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
            })
        })

        socket.on('friend_accept', (data: FriendAccept) => {
            refetch();
            if (data.message) {
                toast.success(`${data.user.full_name} đã đồng ý lời mời kết bạn`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                })
            }
        })
        socket.on('friend_cancel', () => {
            refetch();
        })

        socket.on('new_room', (data: IRoom) => {
            dispatch(newRoom(data));
            socket.emit('join_room', data._id);
            if (data) {
                if (data.owner?._id !== user?.body._id) {
                    toast.info(`${data.owner?.full_name} đã mời bạn vào cuộc trò chuyện`, {
                        position: "top-right",
                        autoClose: 5000,
                        pauseOnHover: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                    })
                }
            }
        })

        socket.on('user_leave_room', (data: {
            userId: string,
            roomId: string,
        }) => {
            if (data.userId === user?.body._id) {
                dispatch(deleteRoom(data.roomId));
            }
        })

        socket.on('delete_room', (data: IRoom) => {
            dispatch(deleteRoom(data._id))
            if (data) {
                if (data.owner?._id !== user?.body._id) {
                    toast.info(`${data.owner?.full_name} đã xóa cuộc trò chuyện`, {
                        position: "top-right",
                        autoClose: 3000,
                        pauseOnHover: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                    })
                }
            }
        })

        return () => {
            socket.off('friend_pending');
            socket.off('friend_accept');
            socket.off('friend_cancel');
            socket.off('new_room');
            socket.off('delete_room');
        }

    }, [user])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
// @ts-ignore
export default SocketProvider;