import React, {useState} from 'react';
import {Box, List, ListItem, ListItemButton, Tab, Tabs, Tooltip} from "@mui/material";
import Image from "next/image";
import styles from "../styles/Navigation.module.scss";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../app/hook";
import {RootState} from "../app/store";
import {changeTab} from "../app/features/Tab.slice";
import ProfileComponent from "./Profile.component";
import Cookies from "universal-cookie";
import Router from "next/router";

type Props = {}

const NavigationComponent: React.FC<Props> = () => {
    const {value} = useAppSelector((state: RootState) => state.tabSlice);
    const dispatch = useAppDispatch();
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const cookies = new Cookies();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        dispatch(changeTab(newValue));
    };

    const onLogout = async () => {
        cookies.remove('auth', {path: '/', expires: new Date(new Date().getTime() - 1)});
        await Router.replace('/login');
    }

    return <>
        <Box className={styles.root}>
            <Box>
                <Link href="/">
                    <a className={styles.logo}>
                        <Image src="/images/Logo.png" alt="Logo" width={70} height={70}/>
                    </a>
                </Link>
                <Tabs orientation="vertical" value={value} onChange={handleChange}>
                    <Tooltip title="Chat" placement="right">
                        <Tab className={styles.tabItem} icon={<MessageOutlinedIcon/>}/>
                    </Tooltip>
                    <Tooltip title="Bạn bè" placement="right">
                        <Tab className={styles.tabItem} icon={<PersonOutlinedIcon/>}/>
                    </Tooltip>
                    <Tooltip title="Lời mời kết bạn" placement="right">
                        <Tab className={styles.tabItem} icon={<StarBorderOutlinedIcon/>}/>
                    </Tooltip>
                </Tabs>
            </Box>

            <List>
                <Tooltip title="Chỉnh sửa hồ sơ" placement="right">
                    <ListItemButton onClick={() => setOpenProfile(true)} className={styles.listItem}>
                        <ModeEditOutlineOutlinedIcon/>
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Cài đặt" placement="right">
                    <ListItemButton className={styles.listItem}>
                        <SettingsOutlinedIcon/>
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="Đăng xuất" placement="right">
                    <ListItemButton onClick={onLogout} className={styles.listItem}>
                        <PowerSettingsNewOutlinedIcon/>
                    </ListItemButton>
                </Tooltip>
            </List>
            <ProfileComponent open={openProfile} setOpen={setOpenProfile}/>
        </Box>
    </>
}
export default NavigationComponent;