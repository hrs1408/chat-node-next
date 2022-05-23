import "../styles/globals.css";
import type {AppProps} from "next/app";
import 'react-toastify/dist/ReactToastify.css';
import {wrapper} from "../app/store";
import {ToastContainer} from "react-toastify";
import SocketProvider from "../context/SocketProvider";

function MyApp({Component, pageProps}: AppProps) {

    return (
        <SocketProvider>
            <ToastContainer/>
            <Component {...pageProps} />
        </SocketProvider>
    );
}

export default wrapper.withRedux(MyApp);