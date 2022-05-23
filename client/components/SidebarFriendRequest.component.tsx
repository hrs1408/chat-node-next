import React, { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent, IconButton,
    InputBase,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Menu, MenuItem, Tooltip,
    Typography
} from "@mui/material";
import styles from "../styles/SidebarFriendRequest.module.scss";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { IUser } from "../app/models/User";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { useAcceptFriendRequestMutation, useRemoveFriendRequestMutation } from "../app/services/User.service";
import { removeFriendRequest } from "../app/features/User.slice";
import { toast } from "react-toastify";
import DialogConfirmComponent from "./DialogConfirm.component";


interface IItem {
    user: IUser
}

const SidebarFriendRequestComponent = () => {
    const { user } = useAppSelector((state: RootState) => state.userSlice)
    const [listFriend, setListFriend] = useState<IUser[]>([]);
    const [keyword, setKeyword] = useState<string>("");

    useEffect(() => {
        setListFriend(user.friend_pending)
    }, [user])

    const renderFriendRequest = useMemo(() => {
        return listFriend.map((friend, index) => {
            if (friend.full_name.toLowerCase().includes(keyword.toLowerCase())) {
                return <Item key={index} user={friend} />
            }
        })
    }, [listFriend, keyword])



    return <Card variant="outlined" className={styles.root}>
        <CardContent className={styles.cardContent}>
            <Box className={styles.cardHeader}>
                <Typography className={styles.title}>Lời mời kết bạn</Typography>
            </Box>
            <Box className={styles.cardSearch}>
                <InputBase className={styles.inputSearch} placeholder="Search" value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </Box>
            <List className={styles.list}>
                {renderFriendRequest}
            </List>
        </CardContent>
    </Card>
}


const Item: React.FC<IItem> = ({ user }) => {
    const [removeFriendRequestApi, { }] = useRemoveFriendRequestMutation();
    const [acceptFriendRequestApi, { }] = useAcceptFriendRequestMutation();
    const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
    const [openConfirmAccept, setOpenConfirmAccept] = useState(false);
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveFriendRequest = async (id: string) => {

        const data = {
            userId: id
        }

        await removeFriendRequestApi(data).then((res: any) => {
            if (res?.error) {
                toast.error('Đã xảy ra lỗi', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                })
            } else {
                dispatch(removeFriendRequest(data))
                toast.success('Xoá lời mời kết bạn thành công', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                })
            }
        });

    }

    const handleAcceptFriendRequest = async (id: string) => {
        const data = {
            userId: id
        }
        await acceptFriendRequestApi(data).then((res: any) => {
            if (res?.error) {
                toast.error('Đã xảy ra lỗi', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                })
            } else {
                toast.success('Đồng ý lời mời kết bạn thành công', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                })
                dispatch(removeFriendRequest(data))
            }
        });

    }

    const handleConfirmCancel = async () => {
        setOpenConfirmCancel(false)
        setAnchorEl(null);
        await handleRemoveFriendRequest(user._id);
    }

    const handleConfirmAccept = async () => {
        setOpenConfirmAccept(false)
        setAnchorEl(null)
        await handleAcceptFriendRequest(user._id);
    }


    return (
        <>
            <ListItem
                sx={{ padding: 0 }}
                secondaryAction={
                    <IconButton onClick={handleClick}>
                        <MoreHorizOutlinedIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar src={user.avatar || ""} />
                </ListItemAvatar>
                <Tooltip title={user.email}>
                    <ListItemText primary={
                        <Typography
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                            maxWidth={'80%'}
                            component={'p'}>
                            {user.email}
                        </Typography>
                    } />
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
                    <MenuItem onClick={() => setOpenConfirmAccept(true)}>Chấp nhận</MenuItem>
                    <MenuItem onClick={() => setOpenConfirmCancel(true)}>Xoá</MenuItem>
                </Menu>
            </ListItem>
            <DialogConfirmComponent
                open={openConfirmCancel} setOpen={setOpenConfirmCancel} handleConfirm={handleConfirmCancel}
                title={'Xoá lời mời kết bạn'}
                message={'Bạn có chắc chắn muốn xoá lời mời kết bạn này?'}
            />
            <DialogConfirmComponent
                open={openConfirmAccept} setOpen={setOpenConfirmAccept} handleConfirm={handleConfirmAccept}
                title={'Chấp nhận lời mời kết bạn'}
                message={'Bạn có chắc chắn muốn chấp nhận lời mời kết bạn này?'}
            />
        </>
    )
}

export default SidebarFriendRequestComponent;