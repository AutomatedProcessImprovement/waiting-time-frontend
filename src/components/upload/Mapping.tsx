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
    onClose: (cancel:boolean, values: object) => void;
}


export default function MappingDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;
    const [snackMessage, setSnackMessage] = useState("")
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)

    let headerMapping = selectedValue
    let ogmapping = [...selectedValue]
    let mapping_object = {
        'case': ogmapping[0],
        'activity': ogmapping[0],
        'start_timestamp': ogmapping[0],
        'end_timestamp': ogmapping[0],
        'resource': ogmapping[0],
    }

    const handleChange = (e: SelectChangeEvent, index:number) => {
        // ogmapping[index] = e.target.value;
        let value = e.target.value
        switch (value) {
            case 'case':
                mapping_object.case = ogmapping[index];
                break
            case 'activity':
                mapping_object.activity = ogmapping[index];
                break
            case 'start_timestamp':
                mapping_object.start_timestamp = ogmapping[index];
                break
            case 'end_timestamp':
                mapping_object.end_timestamp = ogmapping[index];
                break
            case 'resource':
                mapping_object.resource = ogmapping[index];
                break
        }
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
        if (cancel) {
            onClose(cancel, selectedValue);
        } else {
            let _cidNum = 0;
            let _actNum = 0;
            let _startNum = 0;
            let _endNum = 0;
            let _resNum = 0;
            for (const val in ogmapping) {
                switch (ogmapping[val]) {
                    case 'case':
                        _cidNum++;
                        break;
                    case 'activity':
                        _actNum++;
                        break;
                    case 'start_timestamp':
                        _startNum++;
                        break;
                    case 'end_timestamp':
                        _endNum++;
                        break;
                    case 'resource':
                        _resNum++;
                        break;
                }
            }
            if (_cidNum > 1 || _actNum > 1 || _startNum > 1 || _endNum > 1 || _resNum > 1) {
                setErrorMessage('Each type can only be assigned once. Please adjust the mapping and try again.')
            } else if (_cidNum < 1 || _actNum < 1 || _startNum < 1 || _endNum < 1 || _resNum < 1) {
                setErrorMessage('Each type must be assigned at least once. Please adjust the mapping and try again.');
            }
            if (!cancel) {
                onClose(cancel, mapping_object);
            }
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
                                    <MenuItem value={"case"}>Case ID</MenuItem>
                                    <MenuItem value={"activity"}>Activity</MenuItem>
                                    <MenuItem value={"start_timestamp"}>Start Timestamp</MenuItem>
                                    <MenuItem value={"end_timestamp"}>End Timestamp</MenuItem>
                                    <MenuItem value={"resource"}>Resource</MenuItem>
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