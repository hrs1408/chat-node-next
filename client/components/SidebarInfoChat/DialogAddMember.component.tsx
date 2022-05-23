import React, {useEffect, useState} from 'react';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    InputLabel,
    TextField
} from "@mui/material";
import styles from "../../styles/ModalCreateRoom.module.scss";
import {RootState} from "../../app/store";
import {useAppSelector} from "../../app/hook";
import {IUser} from "../../app/models/User";
import {IRoom} from "../../app/models/Room";

interface IProps {
    open: boolean
    handleClose: () => void
    onConfirm: (members: IUser[]) => void
    room: IRoom
}

const DialogAddMemberComponent: React.FC<IProps> = ({open, handleClose, onConfirm, room}) => {
    const {user} = useAppSelector((state: RootState) => state.userSlice);
    const [friends, setFriends] = useState<IUser[]>([]);
    const [members, setMembers] = useState<IUser[]>([]);

    useEffect(() => {
        if (user) {
            const listTemp = user.friends.filter(friend => !room.members.some(member => member._id === friend._id));
            setFriends([...listTemp]);
        }
    }, [user]);

    const handleChange = async (event: any, values: any) => {
        setMembers(values)
    }

    const handleConfirm = () => {
        onConfirm(members);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Thêm thành viên </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{marginBottom: '20px'}}>
                    Mọi người đều biết khi tên thành viên nhóm chat thay đổi.
                </DialogContentText>
                <FormControl fullWidth={true}>
                    <Autocomplete
                        multiple
                        options={friends}
                        getOptionLabel={(user) => user.email}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined"/>
                        )}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Huỷ</Button>
                <Button onClick={handleConfirm}>Lưu</Button>
            </DialogActions>
        </Dialog>
    )
}
export default DialogAddMemberComponent;