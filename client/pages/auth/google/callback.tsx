import React, {useEffect, useState} from 'react';
import Cookies from "universal-cookie";
import LoadingComponent from "../../../components/Loading.component";
import {googleCallbackApi} from "../../../api/GoogleCallback.api";
import {useRouter} from 'next/router';

type Props = {}

const GoogleLogin: React.FC<Props> = (props) => {
    const router = useRouter();

    useEffect(() => {
        const query = window.location.search;
        const cookies = new Cookies();

        (async () => {
            try {
                // const data = await googleCallbackApi(query);
                await fetch(`${process.env.URL_LOGIN_GOOGLE_CALLBACK}${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(response => response.json())
                    .then(async (data) => {
                        if (data?.status === 200) {
                            const {token, expires_in, user} = data.body;
                            await cookies.set('auth', token, {path: '/', expires: new Date(Date.now() + expires_in)});
                            if (user.is_first_login) {
                                await router.push('/new-password');
                            } else {
                                await router.push('/');
                            }
                        } else {
                            await router.replace('/login');
                        }
                    })
            } catch (e) {
                console.log(e);
            }
        })()
    }, []);

    return <>
        <LoadingComponent/>
    </>
}

export default GoogleLogin;
