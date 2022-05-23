import React from 'react';
import styles from '../styles/MainLayout.module.scss'
import {Box} from "@mui/material";
import TabPanelComponent from "../components/TabPanel.component";
import {RootState} from "../app/store";
import {useAppSelector} from "../app/hook";
import NavigationComponent from "../components/Navigation.component";
import SidebarChatComponent from "../components/SidebarChat/SidebarChat.component";
import SidebarFriendComponent from "../components/SidebarFriend/SidebarFriend.component";
import SidebarFriendRequestComponent from "../components/SidebarFriendRequest.component";

interface IProps {
}

const MainLayout: React.FC<IProps> = ({children}) => {
    const {value} = useAppSelector((state: RootState) => state.tabSlice);

    return <>
        <Box className={styles.root}>
            <Box className={styles.navigation}>
                <NavigationComponent/>
            </Box>
            <Box className={styles.wrapperContent}>
                <Box className={styles.sidebar}>
                    <TabPanelComponent value={value} index={0}>
                        <SidebarChatComponent/>
                    </TabPanelComponent>
                    <TabPanelComponent value={value} index={1}>
                        <SidebarFriendComponent />
                    </TabPanelComponent>
                    <TabPanelComponent value={value} index={2}>
                        <SidebarFriendRequestComponent />
                    </TabPanelComponent>
                </Box>
                <Box className={styles.content}>{children}</Box>
            </Box>
        </Box>
    </>
}
export default MainLayout;