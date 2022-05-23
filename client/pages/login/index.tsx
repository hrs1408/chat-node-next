import React from 'react';
import {Box, ButtonBase, Checkbox, Divider, FormControlLabel, IconButton, Typography} from "@mui/material";
import styles from "../../styles/Login.module.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import Link from 'next/link'
import Head from "next/head";
import {useRouter} from "next/router";
import {NextPage} from "next";
import Image from 'next/image'
import {styled} from "@mui/system";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {SubmitHandler, useForm} from "react-hook-form";
import {usePostLoginMutation} from "../../app/services/Auth.service";
import {toast} from "react-toastify";
import Cookies from "universal-cookie";


interface Props {

}

const schema = yup.object().shape({
    email: yup.string().email('Email chưa đúng định dạng').required('Email không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
});

type Inputs = {
    email: string,
    password: string,
}

const Login: NextPage<Props> = () => {
    const router = useRouter();
    const [postLoginApi] = usePostLoginMutation();
    const [error, setError] = React.useState<string | null>(null);
    const cookies = new Cookies();
    const {register, setValue, handleSubmit, formState: {errors}} = useForm<Inputs>({
        resolver: yupResolver(schema),
    })

    const onLoginGoogle = async () => {
        const URL: string = process.env.URL_LOGIN_GOOGLE || 'http://localhost:4000/auth/google';
        await router.push(URL);
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        await postLoginApi(data).then(async (res: any) => {
            if (res.error?.data.status === 400) {
                setError('Email hoặc mật khẩu không đúng');
                return;
            }

            toast.success('Đăng nhập thành công', {
                position: 'top-right',
                autoClose: 2000,
                pauseOnHover: false,
            });
            console.log(res.data.body)
            const {token, expires_in} = res.data.body;
            await cookies.set('auth', token, {path: '/', expires: new Date(Date.now() + expires_in)});
            await router.push('/');
            setError('')
            setValue('email', '');
        })
        setValue('password', '');

    }

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <title>Login</title>
            </Head>
            <Box className={styles.wrapper}>
                <form className={styles.wrapperForm} onSubmit={handleSubmit(onSubmit)}>
                    <Box className={styles.wrapperLogo}>
                        <Image src='/images/LogoLogin.png' width={50} height={50} alt={'Logo'}/>
                    </Box>
                    <Box className={styles.wrapperTitle}>
                        <Typography fontSize={20} color={'darkslategray'}>Sign In</Typography>
                    </Box>
                    <Box>
                        <Input {...register('email')} type="text" placeholder='Email'/>
                        {errors.email && <Typography mb={'10px'} color={'red'}>{errors.email.message}</Typography>}
                        <Input {...register('password')} type="password" placeholder='Password'/>
                        {errors.password && <Typography color={'red'}>{errors.password.message}</Typography>}
                        {error && <Typography color={'red'}>{error}</Typography>}
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <FormControlLabel label={'Remember Me'} control={<Checkbox color="success"/>}/>
                        <Link href="/login">
                            <a>
                                <Typography>Forgot Password ?</Typography>
                            </a>
                        </Link>
                    </Box>
                    <Box mb={3}>
                        <ButtonBase type={'submit'} className={styles.buttonSubmit}>Sign In</ButtonBase>
                    </Box>
                    <Divider/>
                    <Box my={2}>
                        <Typography fontSize={14} color={'gray'} component={'span'}>
                            Login with your social media account.
                        </Typography>
                        <Box mt={2}>
                            <IconButton onClick={onLoginGoogle} color={'error'}>
                                <GoogleIcon fontSize={'large'}/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider/>
                    <Box mt={1}>
                        <Link href="/register">
                            <a>
                                <Typography fontSize={15} color={'gray'} component={'span'}>
                                    Dont have an account?
                                </Typography>
                            </a>
                        </Link>
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

export default Login;