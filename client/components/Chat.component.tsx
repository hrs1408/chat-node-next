import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    Avatar,
    Box,
    Button, ButtonBase, Drawer,
    IconButton,
    InputAdornment,
    TextField, Tooltip,
    Typography,
} from "@mui/material";
import styles from "../styles/Chat.module.scss";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import VideocamIcon from "@mui/icons-material/Videocam";
import AttachmentIcon from "@mui/icons-material/Attachment";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { GROUP_ROOM, IRoom, PRIVATE_ROOM } from "../app/models/Room";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { IUser } from "../app/models/User";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSendMessageMutation } from "../app/services/Message.service";
import { SocketContext } from "../context/SocketProvider";
import { IMessage } from "../app/models/Message";
import { sendMessage } from "../app/features/Message.slice";
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import Fancybox from "./Fancybox";
import InfoIcon from '@mui/icons-material/Info';
import SidebarInfoChatComponent from "./SidebarInfoChat/SidebarInfoChat.component";
import { deleteRoom } from "../app/features/User.slice";
import { useGetUserQuery } from "../app/services/User.service";

export interface IChat {
    room: IRoom;
    onGetMore: (n: number) => void;
    totalMessage: number;
    refetchRoom: () => void;
}

type Inputs = {
    text: string;
}

type Image = {
    src: string;
    id: string;
}

const ChatComponent: React.FC<IChat> = ({ room, onGetMore, totalMessage, refetchRoom }) => {
    const socket = useContext(SocketContext);
    const [sendMessageApi] = useSendMessageMutation();
    const { user } = useAppSelector((state: RootState) => state.userSlice)
    const { messages } = useAppSelector((state: RootState) => state.messageSlice);
    const [roomName, setRoomName] = useState("");
    const [roomAvatar, setRoomAvatar] = useState("");
    const { register, handleSubmit, setValue } = useForm<Inputs>();
    const dispatch = useAppDispatch();
    const [images, setImages] = useState<Image[]>([]);
    const imageRef = useRef<any>(null)
    const [open, setOpen] = useState(false);
    const { refetch: refetchUser } = useGetUserQuery();

    useEffect(() => {
        socket.on('chat_message', (message: IMessage) => {
            if (message.room === room?._id) {
                dispatch(sendMessage(message));
            }
        });

        socket.on('change_room_name', (message: IMessage) => {
            if (message.room === room?._id) {
                dispatch(sendMessage(message));
                refetchRoom();
            }
        });

        socket.on('change_avatar_room', (message: IMessage) => {
            if (message.room === room?._id) {
                dispatch(sendMessage(message));
                refetchRoom();
                refetchUser();
            }
        });

        socket.on('add_member_to_room', (message: IMessage) => {
            if (message.room === room?._id) {
                dispatch(sendMessage(message));
                refetchRoom();
            }
        });

        socket.on('leave_room', async (data: {
            roomId: string,
            message: IMessage,
        }) => {
            if (data.message.room === room?._id) {
                dispatch(sendMessage(data.message))
                refetchRoom();
            }
        })

        return () => {
            socket.off('chat_message');
            socket.off('leave_room');
            socket.off('change_room_name');
            socket.off('change_avatar_room');
            socket.off('add_member_to_room');
        }

    }, [socket, messages, room, dispatch, refetchRoom, refetchUser])

    useEffect(() => {
        if (room) {
            if (room.room_type === PRIVATE_ROOM) {
                const userDiff: IUser = room?.members.filter(u => u._id !== user._id)[0];
                setRoomName(userDiff.full_name);
                setRoomAvatar(userDiff.avatar);
            } else {
                setRoomName(room.name)
                setRoomAvatar(room.avatar)
            }
        }
    }, [room, user._id])

    const onGetImage = (e: any) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = (event: any) => {
            setImages([...images, {
                src: event.target.result,
                id: uuidv4()
            }]);
            imageRef.current.value = null;
        }
    }

    const handleSendMessage: SubmitHandler<Inputs> = async (data) => {

        const request = {
            roomId: room._id,
            text: data.text,
            images: images.map(i => i.src)
        }

        if (request.text.trim() === '' && request.images.length === 0) {
            return;
        }

        await sendMessageApi(request).then((res: any) => {
            if (!res.error) {
                setValue("text", "");
                setImages([]);
            }
        });
    }

    const renderChat = useMemo(() => {
        return messages.map((message, index) => {
            if (message.owner) {
                if (message.owner._id === user._id) {
                    return (
                        <Box key={index} className={`${styles.wrapperContent} ${styles.contentRight}`}>
                            <Tooltip title={message.owner.full_name}>
                                <Avatar src={message.owner.avatar}
                                    sx={{
                                        width: '32px',
                                        height: '32px',
                                        alignSelf: 'flex-end',
                                        marginBottom: '8px'
                                    }} />
                            </Tooltip>
                            <Box className={styles.content}>
                                {message.text && <Typography className={styles.text}>{message.text}</Typography>}
                                {message.image && (
                                    <Box className={styles.wrapperMessageImage}>
                                        {message.image.map((img, index) => {
                                            return <a key={index} data-fancybox="gallery" href={img}>
                                                <img src={img} alt="" />
                                            </a>
                                        })}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )
                } else {
                    return <Box key={index} className={`${styles.wrapperContent} ${styles.contentLeft}`}>
                        <Tooltip title={message.owner.full_name}>
                            <Avatar src={message.owner.avatar}
                                sx={{ width: '32px', height: '32px', alignSelf: 'flex-end', marginBottom: '8px' }} />
                        </Tooltip>
                        <Box className={styles.content}>
                            {message.text && <Typography className={styles.text}>{message.text}</Typography>}
                            <Box className={styles.wrapperMessageImage}>
                                {message.image && message.image.map((img, index) => {
                                    return <a key={index} data-fancybox="gallery" href={img}>
                                        <img src={img} alt="" />
                                    </a>
                                })}
                            </Box>
                        </Box>
                    </Box>
                }
            } else {
                return (
                    <Box key={index} className={styles.messageNotify}>
                        <Typography className={styles.notifyText}>{message.text}</Typography>
                    </Box>
                )
            }
        })
    }, [messages, user._id]);


    const handleRemoveImage = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    }

    const renderButtonLoadMessage = useMemo(() => {
        return (messages.length !== totalMessage && messages.length >= 10) &&
            <Box display={'flex'} justifyContent={'center'}>
                <ButtonBase
                    onClick={() => onGetMore(10)}
                    sx={{ padding: '6px 12px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                    Xem thêm
                </ButtonBase>
            </Box>
    }, [messages.length, onGetMore, totalMessage])

    return (
        <Box className={styles.root}>
            <Box className={styles.chatHeader}>
                <Box className={styles.title}>
                    <Avatar src={roomAvatar} />
                    <Box>
                        <Typography variant="h6">{roomName}</Typography>
                        <Typography variant="caption">Online</Typography>
                    </Box>
                </Box>
                <Box className={styles.actions}>
                    <Button className={styles.buttonGreen}>
                        <LocalPhoneIcon />
                    </Button>
                    <Button className={styles.buttonGray}>
                        <VideocamIcon />
                    </Button>
                    {room.room_type === GROUP_ROOM &&
                        <Button onClick={() => setOpen(true)} className={styles.buttonGray}>
                            <InfoIcon />
                        </Button>}
                    <SidebarInfoChatComponent room={room} open={open} setOpen={setOpen} />
                </Box>
            </Box>
            <Box className={styles.chatContent}>
                <Fancybox>
                    {renderChat}
                </Fancybox>
                {renderButtonLoadMessage}
            </Box>
            <Box className={styles.chatFooter}>
                {images.length > 0 && (
                    <Box className={styles.wrapperImages}>
                        {images.map((image, index) => {
                            return <Box key={index} className={styles.wrapperImage}>
                                <IconButton onClick={() => handleRemoveImage(image.id)}
                                    className={styles.buttonCloseImage}>
                                    <CloseIcon />
                                </IconButton>
                                <img src={image.src} alt="image" />
                            </Box>
                        })}
                    </Box>
                )}
                <form onSubmit={handleSubmit(handleSendMessage)}>
                    <TextField
                        variant={`outlined`}
                        className={styles.chatInput}
                        {...register('text')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <AttachmentIcon />
                                        <label className='label_wrapper' htmlFor="send_image" />
                                    </IconButton>
                                    <input type="file" ref={imageRef} onChange={onGetImage} id='send_image' hidden />
                                    <IconButton>
                                        <MicIcon />
                                    </IconButton>
                                    <IconButton type="submit" sx={{ color: "#0abb87" }}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>
            </Box>
        </Box>
    )
};

export default ChatComponent;