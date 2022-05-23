import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    Divider,
    MenuItem, Typography, Tooltip,
} from "@mui/material";
import {styled} from "@mui/styles";
import React, {useState} from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import {IUser} from "../../app/models/User";
import DialogConfirmComponent from "../DialogConfirm.component";
import {useAppDispatch} from "../../app/hook";
import {cancelFriend} from "../../app/features/User.slice";
import {toast} from "react-toastify";
import {useCancelFriendMutation} from "../../app/services/User.service";

const ListItemCustom = styled(ListItem)(() => ({
    padding: 0,
}));

export interface ItemFriend {
    user: IUser
}

const ItemFriendComponent: React.FC<ItemFriend> = ({user}) => {
    const [openCancelFriend, setOpenCancelFriend] = useState(false);
    const [cancelFriendApi] = useCancelFriendMutation();
    const dispatch = useAppDispatch();

    const [anchorEl, setAnchorEl] = useState<any>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleConfirmCancel = async () => {
        await cancelFriendApi(user._id).then((res: any) => {
            if (!res.error) {
                dispatch(cancelFriend(user._id));
                toast.success('Đã huỷ kết bạn!', {
                    position: 'top-right',
                    autoClose: 3000,
                })
            } else {
                toast.error('Có lỗi xảy ra!', {
                    position: 'top-right',
                    autoClose: 3000,
                })
            }
        })
        handleClose();
    };


    return (
        <>
            <ListItemCustom
                secondaryAction={
                    <IconButton onClick={handleClick}>
                        <MoreHorizOutlinedIcon/>
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar src={user.avatar} alt="Avatar"/>
                </ListItemAvatar>
                <Tooltip title={user.full_name}>
                    <ListItemText primary={
                        <Typography
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                            maxWidth={'100%'}
                            component={'p'}>
                            {user.full_name}
                        </Typography>
                    }/>
                </Tooltip>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <MenuItem onClick={handleClose}>Thông tin</MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => setOpenCancelFriend(true)}>Huỷ kết bạn</MenuItem>
                </Menu>
            </ListItemCustom>
            <DialogConfirmComponent
                open={openCancelFriend}
                setOpen={setOpenCancelFriend}
                title={'Huỷ kết bạn'}
                message={'Bạn có chắc chắn muốn huỷ kết bạn với ' + user.full_name + '?'}
                handleConfirm={handleConfirmCancel}
            />
        </>
    )
};

export default ItemFriendComponent;