import React from 'react';
import {Box, ButtonBase, Typography} from "@mui/material";
import styles from "../../styles/Login.module.scss";
import Link from 'next/link'
import Head from "next/head";
import {useRouter} from "next/router";
import {NextPage} from "next";
import Image from 'next/image'
import {styled} from "@mui/system";
import * as yup from "yup";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import withAuth from "../../HOC/withAuth";
import {RootState} from "../../app/store";
import {useAppSelector} from "../../app/hook";
import {useChangePasswordMutation} from "../../app/services/User.service";
import {toast} from "react-toastify";

interface Props {

}

const schema = yup.object().shape({
    password: yup.string().required('Mật khẩu không được để trống')
        .test('is-password', 'Mật khẩu phải có ít nhất 8 ký tự', (value: any) => {
            return value.length >= 8;
        }),
    confirmPassword: yup.string().required('Nhập lại mật khẩu không được để trống')
        .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không chính xác')
});

type Inputs = {
    password: string,
    confirmPassword: string
}

const Index: NextPage<Props> = () => {
    const router = useRouter();
    const [changePasswordApi] = useChangePasswordMutation()
    const {user} = useAppSelector((state: RootState) => state.userSlice);
    const {register, handleSubmit, setValue, formState: {errors}} = useForm<Inputs>({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    console.log(user)

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const request = {
            password: data.password,
            confirm_password: data.confirmPassword,
            is_first_login: user.is_first_login
        }
        await changePasswordApi(request).then(async (res: any) => {
            if (!res.error) {
                await router.replace('/');
                toast.success('Đổi mật khẩu thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                })
            }
        })
        setValue('password', '')
        setValue('confirmPassword', '')
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <title>New Password</title>
            </Head>
            <Box className={styles.wrapper}>
                <form className={styles.wrapperForm} onSubmit={handleSubmit(onSubmit)}>
                    <Box className={styles.wrapperLogo}>
                        <Image src='/images/LogoLogin.png' width={50} height={50} alt={'Logo'}/>
                    </Box>
                    <Box className={styles.wrapperTitle}>
                        <Typography fontSize={20} color={'darkslategray'}>Nhập mật khẩu mới</Typography>
                    </Box>
                    <Box>
                        <Input type="password" {...register('password')} placeholder='Mật khẩu'/>
                        {errors.password &&
                            <Typography mb={'10px'} color={'red'}>{errors.password.message}</Typography>}
                        <Input type="password" {...register('confirmPassword')} placeholder='Nhập lại mật khẩu'/>
                        {errors.confirmPassword &&
                            <Typography color={'red'}>{errors.confirmPassword.message}</Typography>}
                    </Box>
                    <Box mb={3}>
                        <ButtonBase type={'submit'} className={styles.buttonSubmit}>Nhập mật khẩu</ButtonBase>
                    </Box>
                </form>
            </Box>
        </>
    );
};

const Input = styled('input')({
    width: '100%',
    height: '50px',
    borderRadius: '5px',
    border: '1px solid #dcdcdc',
    paddingLeft: '10px',
    marginBottom: '20px',
    fontSize: '16px',
    '&:focus': {
        outline: 'none',
        border: '2px solid #3DB16B'
    }
})

export default withAuth(Index);