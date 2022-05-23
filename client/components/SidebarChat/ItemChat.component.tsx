import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import React, {useState} from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Router from 'next/router'
import {PRIVATE_ROOM} from "../../app/models/Room";
import DialogConfirmComponent from "../DialogConfirm.component";
import {toast} from "react-toastify";
import {useAppDispatch} from "../../app/hook";
import {changeTab} from "../../app/features/Tab.slice";
import {useLeaveRoomMutation} from "../../app/services/Room.service";

export interface ItemChat {
    name: string;
    avatar: string;
    id: string;
    roomType: string;
}

const ItemChat: React.FC<ItemChat> = ({roomType, name, avatar, id}) => {
    const [openLeaveRoom, setOpenLeaveRoom] = useState(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [leaveRoomApi] = useLeaveRoomMutation();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const dispatch = useAppDispatch();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenRoom = async () => {
        await Router.push(`/room/${id}`)
    }

    const handleConfirmLeaveRoom = async () => {
        await leaveRoomApi(id).then((res: any) => {
            if (!res.error) {
                toast.success('Bạn đã rời khỏi phòng', {
                    position: 'top-right',
                    autoClose: 3000,
                    pauseOnHover: false
                })
                Router.replace('/');

            } else {
                toast.error('Có lỗi xảy ra', {
                    position: 'top-right',
                    autoClose: 3000,
                    pauseOnHover: false
                })
            }
        })
        handleClose()
    }

    return (
        <>
            <ListItem
                sx={{padding: "0"}}
                secondaryAction={
                    <IconButton onClick={handleClick}>
                        <MoreHorizOutlinedIcon/>
                    </IconButton>
                }
            >
                <ListItemButton onClick={handleOpenRoom}>
                    <ListItemAvatar>
                        <Avatar src={avatar ? avatar : ""} alt="Avatar"/>
                    </ListItemAvatar>
                    <ListItemText primary={name}/>
                </ListItemButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    {
                        roomType === PRIVATE_ROOM ? (
                            <MenuItem onClick={() => {
                                dispatch(changeTab(1))
                            }}>Huỷ kết bạn</MenuItem>
                        ) : (
                            <MenuItem onClick={() => setOpenLeaveRoom(true)}>Rời nhóm</MenuItem>
                        )
                    }
                </Menu>
            </ListItem>
            <DialogConfirmComponent
                open={openLeaveRoom}
                setOpen={setOpenLeaveRoom}
                title={'Rời nhóm'}
                message={'Bạn có chắc chắn muốn rời nhóm này?'}
                handleConfirm={handleConfirmLeaveRoom}
            />
        </>
    );
};

export default ItemChat;