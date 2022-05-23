import React, {useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    Modal,
    TextField,
    Typography
} from "@mui/material";
import styles from '../../styles/ModalCreateRoom.module.scss';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import {IUser} from "../../app/models/User";
import {toast} from "react-toastify";
import {useCreateRoomMutation} from "../../app/services/Room.service";

interface IModalCreateRoom {
    setOpen: (open: boolean) => void;
    open: boolean;
    friends: IUser[];
    user: IUser;
}


const ModalCreateRoomComponent: React.FC<IModalCreateRoom> = (
    {open, setOpen, friends, user}) => {
    const [members, setMembers] = useState<IUser[]>([]);
    const [roomName, setRoomName] = useState('');
    const [createRoomApi] = useCreateRoomMutation();

    const handleChange = async (event: any, values: any) => {
        setMembers(values)
    }

    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!roomName) {
            toast.warning('Tên phòng không được để trống', {
                position: 'top-right',
                autoClose: 2000,
                pauseOnHover: false
            });
            return;
        }

        if (members.length <= 0) {
            toast.warning('Vui lòng chọn thành viên', {
                position: 'top-right',
                autoClose: 2000,
                pauseOnHover: false
            });
            return;
        }
        const request = {
            name: roomName,
            members: members.map(member => member._id)
        }
        await createRoomApi(request).then((res: any) => {
            if (!res.error) {
                toast.success('Tạo phòng thành công', {
                    position: 'top-right',
                    autoClose: 2000,
                    pauseOnHover: false
                });
                setOpen(false);
            } else {
                toast.error('Tạo phòng thất bại', {
                    position: 'top-right',
                    autoClose: 2000,
                    pauseOnHover: false
                });
            }
        });
    }


    return <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={styles.root}>
            <Box className={styles.header}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <GroupsIcon/>
                    <Typography sx={{fontSize: '18px'}}>New Group</Typography>
                </Box>
                <IconButton onClick={() => setOpen(false)}><CloseIcon/></IconButton>
            </Box>
            <Box className={styles.content}>
                <form onSubmit={onSubmit}>
                    <FormControl fullWidth={true}>
                        <InputLabel shrink className={styles.label}>
                            Group Name
                        </InputLabel>
                        <TextField type="text"
                                   value={roomName}
                                   onChange={(e) => setRoomName(e.target.value)}
                                   className={styles.formInput}
                                   placeholder={"Group Name"}/>
                    </FormControl>
                    <FormControl fullWidth={true}>
                        <InputLabel shrink className={styles.label}>
                            The Group Members
                        </InputLabel>
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
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button type="submit" variant="contained" color={"success"}>Create Group</Button>
                    </Box>
                </form>
            </Box>
        </Box>
    </Modal>
}

export default ModalCreateRoomComponent;