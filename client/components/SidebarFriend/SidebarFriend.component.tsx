import { Box, Button, Card, CardContent, List, Typography, InputBase, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "../../styles/SidebarFriend.module.scss";
import AddIcon from "@mui/icons-material/Add";
import ItemFriend from "./ItemFriend.component";
import ModalAddFriend from "./ModalAddFriend.component";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/hook";
import { IUser } from "../../app/models/User";

const SidebarFriend = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const { user } = useAppSelector((state: RootState) => state.userSlice)
    const [listFriend, setListFriend] = useState<IUser[]>([]);
    const [keyword, setKeyword] = useState<string>("")

    useEffect(() => {
        setListFriend(user.friends)
    }, [user])


    const renderFriend = useMemo(() => {
        return listFriend.map((friend, index) => {
            if (friend.full_name.toLowerCase().includes(keyword.toLowerCase())) {
                return (
                    <ItemFriend key={index} user={friend} />
                )
            }
        })
    }, [listFriend, keyword])

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    }

    return (
        <Card variant="outlined" className={styles.root}>
            <CardContent className={styles.cardContent}>
                <Box className={styles.cardHeader}>
                    <Typography className={styles.title}>Bạn bè</Typography>
                    <Button className={styles.buttonAddFriend} onClick={() => setOpenAdd(true)} startIcon={<AddIcon />}>Thêm
                        bạn bè</Button>
                    <ModalAddFriend open={openAdd} setOpen={setOpenAdd} />
                </Box>
                <Box mb={2} className={styles.cardSearch}>
                    <InputBase className={styles.inputSearch} value={keyword} onChange={onChangeSearch} placeholder="Search" />
                </Box>
                <List>
                    {renderFriend}
                </List>
            </CardContent>
        </Card>
    );
};

export default SidebarFriend;