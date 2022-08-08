import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Button, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string[];
    onClose: (cancel:boolean, values: string[]) => void;
}

export default function MappingDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;

    let headerMapping = selectedValue

    const handleChange = (e: SelectChangeEvent, index:number) => {
        const newvalue = e.target.value;
        if (newvalue === "other") {
            alert("This is not yet implemented. Please select a valid column name")
        }
        headerMapping[index] = newvalue

    };

    const handleClose = (cancel:boolean ) => {
        onClose(cancel, selectedValue);
    };


    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Map the event log</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here you can assign the right column names to each column for processing.
                </DialogContentText>
                <List>

                    {selectedValue.map((columnName, index) => (
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
        </Dialog>
    );
}