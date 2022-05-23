import { Box, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import withAuth from '../HOC/withAuth'
import MainLayout from "../layouts/MainLayout"

const Home: NextPage = () => {
    const classes = useStyles();

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Welcome to Chat</title>
            </Head>
            <MainLayout>
                <Box className={classes.root}>
                    <Box className={classes.content}>
                        <Image src="/images/Comment-Transparent.png" width={150} height={150} alt="comments" />
                        <Typography>Select a chat read messages</Typography>
                    </Box>
                </Box>
            </MainLayout>
        </>
    )
}

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        textAlign: "center",
    },
});

export default withAuth(Home)
