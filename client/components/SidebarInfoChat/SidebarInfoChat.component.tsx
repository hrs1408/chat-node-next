import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import styles from '../../styles/SidebarInfoChat.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import {IRoom, PRIVATE_ROOM} from "../../app/models/Room";
import {useAppSelector} from "../../app/hook";
import {RootState} from "../../app/store";
import {IUser} from "../../app/models/User";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import PhotoIcon from '@mui/icons-material/Photo';
import DialogChangeNameRoomComponent from "./DialogChangeNameRoom.component";
import {
    useAddMemberToRoomMutation,
    useChangeRoomAvatarMutation,
    useChangeRoomNameMutation
} from "../../app/services/Room.service";
import {toast} from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import DialogAddMemberComponent from "./DialogAddMember.component";

interface IProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    room: IRoom
}

type OpenAccor = 'info' | 'members';

const SidebarInfoChatComponent: React.FC<IProps> = ({room, open, setOpen}) => {
    const [roomName, setRoomName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [changeRoomNameApi] = useChangeRoomNameMutation();
    const {user} = useAppSelector((state: RootState) => state.userSlice);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const avatarRef = React.useRef<any>(null);
    const [changeRoomAvatarApi] = useChangeRoomAvatarMutation();
    const [addMemberToRoomApi] = useAddMemberToRoomMutation();

    const [openAccor, setOpenAccor] = React.useState({
        info: false,
        members: false,
    });

    const handleClick = (name: OpenAccor) => {
        setOpenAccor({
            ...openAccor,
            [name]: !openAccor[name]
        })
    };

    useEffect(() => {
        if (room) {
            if (room.room_type === PRIVATE_ROOM) {
                const userDiff: IUser = room.members.filter(u => u._id !== user._id)[0];
                setRoomName(userDiff.full_name);
                setAvatar(userDiff.avatar);
            } else {
                setRoomName(room.name);
                setAvatar(room.avatar);
            }
        }
    }, [room])

    const onConfirmChangeRoomName = async (name: string) => {
        if (name === room.name) {
            toast.warning('Tên phòng không thay đổi', {
                position: 'top-right',
                autoClose: 3000,
                pauseOnHover: false
            });
            return;
        }

        const request = {
            roomId: room._id,
            roomName: name
        };
        await changeRoomNameApi(request).then((res: any) => {
            if (!res.error) {
                setOpenDialog(false);
                toast.success('Đổi tên thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    pauseOnHover: false
                });
            }
        });
    }

    const onChangeAvatar = async (e: any) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onload = async (event: any) => {
            await setAvatar(event.target.result);
            const request = {
                roomId: room._id,
                avatar: event.target.result
            }
            await changeRoomAvatarApi(request).then((res: any) => {
                if (!res.error) {
                    toast.success('Đổi ảnh nhóm thành công', {
                        position: 'top-right',
                        autoClose: 3000,
                        pauseOnHover: false
                    });
                    avatarRef.current.value = null;
                } else {
                    toast.error('Đổi ảnh nhóm thất bại', {
                        position: 'top-right',
                        autoClose: 3000,
                        pauseOnHover: false
                    });
                }
            });

        }
    };

    const onConfirmAddMember = async (members: IUser[]) => {
        await addMemberToRoomApi({
            roomId: room._id,
            members
        }).then((res: any) => {
            if (!res.error) {
                setOpenDialogAdd(false);
                toast.success('Thêm thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    pauseOnHover: false
                });
            } else {
                toast.error('Thêm thất bại', {
                    position: 'top-right',
                    autoClose: 3000,
                    pauseOnHover: false
                });
            }
        })
    }

    return <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
    >
        <Box className={styles.root}>
            <Box className={styles.header}>
                <Box className={styles.title}>
                    <Typography fontSize={22} fontWeight={'bold'}>Thông tin về phòng Chat</Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <Box className={styles.avatar}>
                    <Avatar src={avatar} sx={{width: '100px', height: '100px'}}/>
                    <Typography mt={3} fontSize={'18px'} fontWeight={'bold'}>{roomName}</Typography>
                </Box>
                <List sx={{marginTop: '20px'}}>
                    <ListItemButton onClick={() => {
                        handleClick('info');
                    }}>
                        <ListItemText primary="Tuỳ chỉnh đoạn chat"/>
                        {(openAccor['info']) ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={openAccor['info']} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton onClick={() => setOpenDialog(true)} sx={{pl: 4}}>
                                <ListItemIcon>
                                    <EditIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Đổi tên phòng"/>
                            </ListItemButton>
                            <DialogChangeNameRoomComponent
                                open={openDialog}
                                handleClose={() => setOpenDialog(false)}
                                onConfirm={onConfirmChangeRoomName}
                            />
                            <ListItemButton sx={{pl: 4}}>
                                <ListItemIcon>
                                    <PhotoIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Thay đổi ảnh"/>
                                <label className='label_wrapper' htmlFor="file"/>
                                <input type="file" hidden ref={avatarRef} id="file" onChange={onChangeAvatar}/>
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={() => {
                        handleClick('members');
                    }}>
                        <ListItemText primary="Thành viên"/>
                        {(openAccor['members']) ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={openAccor['members']} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton onClick={() => setOpenDialogAdd(true)}>
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Thêm thành viên"/>
                            </ListItemButton>
                            <DialogAddMemberComponent
                                open={openDialogAdd}
                                handleClose={() => setOpenDialogAdd(false)}
                                onConfirm={onConfirmAddMember}
                                room={room}
                            />
                            {room?.members.map((u, index) => {
                                return (
                                    <ListItemButton key={index} sx={{pl: 4}}>
                                        <ListItemIcon>
                                            <Avatar src={u.avatar}/>
                                        </ListItemIcon>
                                        <ListItemText primary={
                                            <Typography
                                                textOverflow={'ellipsis'}
                                                overflow={'hidden'}
                                                maxWidth={'100%'}
                                                component={'p'}>
                                                {u.full_name}
                                            </Typography>
                                        }/>
                                    </ListItemButton>
                                )
                            })}
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Box>
    </Drawer>
}

export default SidebarInfoChatComponent;