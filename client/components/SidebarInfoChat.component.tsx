import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    ButtonBase, Collapse,
    Drawer,
    IconButton,
    List,
    ListItemButton, ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import styles from '../styles/SidebarInfoChat.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import {GROUP_ROOM, IRoom, PRIVATE_ROOM} from "../app/models/Room";
import {useAppSelector} from "../app/hook";
import {RootState} from "../app/store";
import {IUser} from "../app/models/User";
import {ExpandLess, ExpandMore, StarBorder} from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import PhotoIcon from '@mui/icons-material/Photo';

interface IProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    room: IRoom
}

type OpenAccor = 'info' | 'members';

const SidebarInfoChatComponent: React.FC<IProps> = ({room, open, setOpen}) => {
    const [infoRoom, setInfoRoom] = useState({
        name: '',
        avatar: ''
    });
    const {user} = useAppSelector((state: RootState) => state.userSlice);

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
                setInfoRoom({
                    ...infoRoom,
                    name: userDiff.full_name,
                    avatar: userDiff.avatar
                });
            } else {
                setInfoRoom({
                    ...infoRoom,
                    name: room.name,
                    avatar: room.avatar
                });
            }
        }
    }, [room, infoRoom])

    return <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
    >
        <Box className={styles.root}>
            <Box className={styles.header}>
                <Box className={styles.title}>
                    <Typography fontSize={22} fontWeight={'bold'}>About</Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <Box className={styles.avatar}>
                    <Avatar src={infoRoom.avatar} sx={{width: '100px', height: '100px'}}/>
                    <Typography mt={3} fontSize={'18px'} fontWeight={'bold'}>{infoRoom.name}</Typography>
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
                            <ListItemButton sx={{pl: 4}}>
                                <ListItemIcon>
                                    <EditIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Đổi tên phòng"/>
                            </ListItemButton>
                            <ListItemButton sx={{pl: 4}}>
                                <ListItemIcon>
                                    <PhotoIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Thay đổi ảnh"/>
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