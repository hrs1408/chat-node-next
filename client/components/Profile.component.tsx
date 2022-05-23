import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, ButtonBase, IconButton, Modal, Typography} from "@mui/material";
import styles from '../styles/Profile.module.scss';
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CloseIcon from '@mui/icons-material/Close';
import {InputCustomBase} from '../commons/InputCustom';
import {useAppSelector} from "../app/hook";
import {RootState} from "../app/store";
import {SubmitHandler, useForm} from "react-hook-form";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {TextError} from '../commons/TextCustom';
import {useUpdateUserMutation} from "../app/services/User.service";
import {toast} from "react-toastify";

interface IProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

type Inputs = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
}

const schema = yup.object().shape({
    email: yup.string().email('Email chưa đúng định dạng').required('Trường này bắt buộc'),
    fullName: yup.string().required('Trường này bắt buộc'),
    phone: yup.string(),
    address: yup.string(),
})

const ProfileComponent: React.FC<IProps> = ({open, setOpen}) => {
    const {user} = useAppSelector((state: RootState) => state.userSlice)
    const [updateUserApi] = useUpdateUserMutation();
    const {register, setValue, handleSubmit, formState: {errors}} = useForm<Inputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    })
    const [avatar, setAvatar] = useState(user.avatar)
    const avatarRef = useRef<any>(null);

    useEffect(() => {
        setValue('fullName', user.full_name)
        setValue('email', user.email)
        setValue('phone', user.phone || "")
        setValue('address', user.address || "")
        setValue('avatar', user.avatar || "")
    }, [user])

    const changeAvatar = (e: any) => {
        const file = e.target.files[0];
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = (event: any) => {
            setAvatar(event.target.result)
        }
    }

    const onUpdateUser: SubmitHandler<Inputs> = async (data) => {
        const request = {
            full_name: data.fullName,
            number_phone: data.phone,
            address: data.address,
            avatar,
        }

        await updateUserApi(request).then((res: any) => {
            if (!res?.error) {
                toast.success('Update profile successfully', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
            } else {
                toast.error('Update profile failed', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
            }
        });

    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box className={styles.root}>
                <Box className={styles.header}>
                    <Box display={'flex'} alignItems={'center'} gap={1}>
                        <ModeEditOutlineOutlinedIcon/>
                        <Typography color={'#212529'} fontSize={20} fontWeight={'bold'} variant="h5">Chỉnh sửa hồ sơ</Typography>
                    </Box>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
                <form className={styles.content} onSubmit={handleSubmit(onUpdateUser)}>

                    <Box className={styles.inputGroup}>
                        <label>Email</label>
                        <InputCustomBase {...register('email')} readOnly type={'email'}/>
                        {errors.email && <TextError>{errors.email.message}</TextError>}
                    </Box>
                    <Box className={styles.inputGroup}>
                        <label>Họ và tên</label>
                        <InputCustomBase {...register('fullName')} placeholder={"Tran Huu Tai"}/>
                    </Box>
                    {errors.fullName && <TextError>{errors.fullName.message}</TextError>}
                    <Box className={styles.inputGroup}>
                        <label>Ảnh đại diện</label>
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                            <Avatar src={avatar}/>
                            <InputCustomBase onChange={changeAvatar} ref={avatarRef} type={'file'}/>
                        </Box>
                    </Box>
                    <Box className={styles.inputGroup}>
                        <label>Địa chỉ</label>
                        <InputCustomBase {...register('address')} placeholder={"Thanh Pho Hue"}/>
                    </Box>
                    {errors.address && <TextError>{errors.address.message}</TextError>}

                    <Box className={styles.inputGroup}>
                        <label>Số điện thoại</label>
                        <InputCustomBase {...register('phone')} placeholder={'(555) 555 55 55'}/>
                    </Box>
                    {errors.phone && <TextError>{errors.phone.message}</TextError>}
                    <Box className={styles.footer}>
                        <ButtonBase type={'submit'} className={styles.button}>Lưu</ButtonBase>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}

export default ProfileComponent;