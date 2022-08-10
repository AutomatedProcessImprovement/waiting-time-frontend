import * as React from 'react';
import {useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {AlertColor, Button, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import CustomizedSnackbar from '../CustomizedSnackBar';

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string[];
    onClose: (cancel:boolean, values: string[]) => void;
}


export default function MappingDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;
    const [snackMessage, setSnackMessage] = useState("")
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)

    let headerMapping = selectedValue
    let ogmapping = [...selectedValue]

    const handleChange = (e: SelectChangeEvent, index:number) => {
        ogmapping[index] = e.target.value;
    };

    const setErrorMessage = (value: string) => {
        setSnackColor("error")
        setSnackMessage(value)
        ogmapping = headerMapping
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
        ogmapping = headerMapping
    };

    const handleClose = (cancel:boolean ) => {
        var cidnum = 0;
        var actnum = 0;
        var startnum = 0;
        var endnum = 0;
        var resnum = 0;
        for (const val in ogmapping) {
            switch (ogmapping[val]) {
                case 'case:concept:name':
                    cidnum++;
                    break;
                case 'concept:name':
                    actnum++;
                    break;
                case 'start_timestamp':
                    startnum++;
                    break;
                case 'time:timestamp':
                    endnum++;
                    break;
                case 'org:resource':
                    resnum++;
                    break;
            }
        }
        if (cidnum > 1 || actnum > 1 || startnum > 1 || endnum > 1 || resnum > 1) {
            setErrorMessage('Each type can only be assigned once. Please adjust the mapping and try again.')
        } else if (cidnum < 1 || actnum < 1 || startnum < 1 || endnum < 1 || resnum < 1) {
            setErrorMessage('Each type must be assigned at least once. Please adjust the mapping and try again.');
        } else {
            onClose(cancel, selectedValue);
        }
    };


    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Map the event log</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here you can assign the right column names to each column for processing.
                </DialogContentText>
                <List>

                    {ogmapping.map((columnName, index) => (
                        <ListItem key={columnName}>
                            <ListItemText primary={columnName}/>
                            <FormControl sx={{m: 1, minWidth: 250}}>
                                <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                                <Select
                                    id={columnName}
                                    label="Type"
                                    defaultValue={""}
                                    onChange={(e) => handleChange(e,index)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"case:concept:name"}>Case ID</MenuItem>
                                    <MenuItem value={"concept:name"}>Activity</MenuItem>
                                    <MenuItem value={"start_timestamp"}>Start Timestamp</MenuItem>
                                    <MenuItem value={"time:timestamp"}>End Timestamp</MenuItem>
                                    <MenuItem value={"org:resource"}>Resource</MenuItem>
                                    <MenuItem value={"other"}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(true)}>Cancel</Button>
                <Button onClick={() => handleClose(false)} autoFocus>
                    Continue
                </Button>
            </DialogActions>
            {snackMessage && <CustomizedSnackbar
                message={snackMessage}
                severityLevel={snackColor}
                onSnackbarClose={onSnackbarClose}
            />}
        </Dialog>

    );
}