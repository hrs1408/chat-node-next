import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    Alert,
    Box, Button,
    FormControl,
    IconButton,
    InputLabel,
    Modal,
    TextField,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styles from '../../styles/ModalAddFriend.module.scss'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import * as yup from 'yup';
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useAddFriendMutation} from "../../app/services/User.service";
import {toast} from "react-toastify";

interface IModalAddFriend {
    setOpen: (open: boolean) => void;
    open: boolean;
}

const schema = yup.object().shape({
    email: yup.string().email('Email is invalid').required('Email is required'),
});

type Inputs = {
    email: string;
}

const ModalAddFriendComponent: React.FC<IModalAddFriend> = ({open, setOpen}) => {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm<Inputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const [addFriendApi, {data, error}] = useAddFriendMutation();

    const [notify, setNotify] = useState<any>(null);

    useLayoutEffect(() => {
        if (error) {
            // @ts-ignore
            toast.error(error.data.message, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: false,
            });
        }

        if (data) {
            toast.success('Gửi lời mời kết bạn thành công', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }

        setTimeout(() => {
            setNotify(null);
        }, 5000);

    }, [error, data])

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await addFriendApi(data)
        setValue("email", "")
    }

    return <Modal
        open={open}
        onClose={() => setOpen(false)}
    >
        <Box className={styles.root}>
            <Box className={styles.header}>
                <Box className={styles.title}>
                    <PersonOutlineIcon/>
                    <Typography className={styles.text}>Thêm bạn bè</Typography>
                </Box>
                <IconButton className={styles.buttonClose} onClick={() => setOpen(false)}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Box className={styles.content}>
                <Alert severity="info" className={styles.alert}>Gửi lời mời kết bạn</Alert>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth={true}>
                        <InputLabel shrink className={styles.label}>
                            Email addresses
                        </InputLabel>
                        <TextField {...register('email')} type="text" className={styles.formInput}
                                   placeholder={"Email Address"}/>
                    </FormControl>
                    {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
                    {notify && <Alert severity={notify.severity}>{notify.message}</Alert>}
                    <Box sx={{display: 'flex', justifyContent: 'center', marginTop: "20px"}}>
                        <Button type={'submit'} variant={"outlined"} className={styles.buttonMakeFriend}>Gửi lời mời</Button>
                    </Box>
                </form>
            </Box>
        </Box>
    </Modal>
}

export default ModalAddFriendComponent