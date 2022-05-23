import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {checkUserAuthentication} from "../api/CheckUserAuthentication.api";
import Cookies from "universal-cookie";
import LoadingComponent from "../components/Loading.component";
import {useGetUserQuery} from "../app/services/User.service";
import {useAppSelector} from "../app/hook";
import {RootState} from "../app/store";

const withAuth = (WrappedComponent: any) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const router = useRouter();
        // we call the api that verifies the token.
        const {user} = useAppSelector((state: RootState) => state.userSlice);
        const {refetch} = useGetUserQuery();
        const cookie = new Cookies();

        useEffect(() => {
            (async () => {
                const accessToken = cookie.get('auth');
                // if no accessToken was found,then we redirect to "/login" page.
                if (!accessToken) {
                    await router.replace("/login");
                } else {
                    if (!user?._id) {
                        refetch();
                    }
                    setTimeout(() => {
                        if (!user) {
                            router.replace("/login");
                        }
                    }, 3000)
                }
            })()
        }, [cookie, refetch, router, user]);

        return <>
            {!user?._id ? <LoadingComponent/> : <WrappedComponent {...props} />}
        </>
    };
};

export default withAuth;
