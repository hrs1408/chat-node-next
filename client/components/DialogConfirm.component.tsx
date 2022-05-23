import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Alert} from "@mui/material";

interface IProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleConfirm: () => void;
    message: string;
    title: string;
}

const DialogConfirmComponent = ({open, setOpen, handleConfirm, message, title}: IProps) => {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={'outlined'} color={'error'} onClick={handleClose}>Cancel</Button>
                <Button variant={'outlined'} color={'success'} onClick={() => {
                    handleConfirm();
                    handleClose();
                }} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogConfirmComponent;