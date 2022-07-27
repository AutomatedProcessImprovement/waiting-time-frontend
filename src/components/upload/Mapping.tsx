import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Button, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MappingList from "./MappingList";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string[];
    onClose: (cancel:boolean) => void;
}

export default function SimpleDialog(props: SimpleDialogProps) {


    const { onClose, selectedValue, open } = props;
    const handleClose = (cancel:boolean ) => {
        onClose(cancel);
    };
    console.log(selectedValue)

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Map the event log</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here you can assign the right column names to each column for processing.
                </DialogContentText>
                <MappingList
                 onClose={() => onClose}
                 selectedValue={selectedValue}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(true)}>Cancel</Button>
                <Button onClick={() => handleClose(false)} autoFocus>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}