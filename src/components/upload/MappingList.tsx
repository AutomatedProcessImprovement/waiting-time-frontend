import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import * as React from "react";
import {useEffect, useState} from "react";

export interface SimpleDialogProps {
    selectedValue: string[];
    onClose: () => void;
}

export default function MappingList(props: SimpleDialogProps) {
    const { onClose, selectedValue } = props;
    const headerMapping = {
        'case_id': 0,
        "activity": 1,
        "start_timestamp": 2,
        "end_timestamp": 3,
        "resource": 4
    }
    const handleChange = (e: SelectChangeEvent) => {
        const value = e.target.value;
        Object.entries(headerMapping).find(([key,value]) => {
            // DO SMT
        })
    };



    return (
        <List>
            {selectedValue.map((columnName) => (
                <ListItem key={columnName}>
                    <ListItemText primary={columnName}/>
                    <FormControl sx={{m: 1, minWidth: 250}}>
                        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                        <Select
                            id="demo-simple-select-helper"
                            label="Type"
                            defaultValue={""}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"case_id"}>Case ID</MenuItem>
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
    )
}