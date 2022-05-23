import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import React from 'react';

interface IProps {
    open: boolean;
    handleClose: () => void;
    onConfirm: (name: string) => void;
}

const DialogChangeNameRoomComponent: React.FC<IProps> = ({open, handleClose, onConfirm}) => {
    const [name, setName] = React.useState('');

    const handleConfirm = () => {
        onConfirm(name);
        setName('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Đổi tên đoạn chat
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Mọi người đều biết khi tên nhóm chat thay đổi.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Tên phòng"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Huỷ</Button>
                <Button onClick={handleConfirm}>Lưu</Button>
            </DialogActions>
        </Dialog>
    )
}
export default DialogChangeNameRoomComponent;