import React from "react";
import {Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function secondsToDhm(seconds: number) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let res: [number, number, number] = [d,h,m]
    return res
}

function dhmToString(time: [number, number, number]) {
    return time[0] + "D " + time[1] + "H " + time[2] + "M"
}

function Row(props: { row: any }) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell align="right">{row.source_activity}</TableCell>
                <TableCell align="right">{row.target_activity}</TableCell>
                <TableCell align="right">{row.case_freq}</TableCell>
                <TableCell align="right">{row.total_freq}</TableCell>
                <TableCell align="right">{dhmToString(secondsToDhm(row.total_wt))}</TableCell>
                <TableCell align="right">{dhmToString(secondsToDhm(row.batching_wt))}</TableCell>
                <TableCell align="right">{dhmToString(secondsToDhm(row.prioritization_wt))}</TableCell>
                <TableCell align="right">{dhmToString(secondsToDhm(row.contention_wt))}</TableCell>
                <TableCell align="right">{dhmToString(secondsToDhm(row.unavailability_wt))}</TableCell>
                <TableCell align="right">{dhmToString(secondsToDhm(row.extraneous_wt))}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Table aria-label="per_resource" style={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow >
                                    <TableCell/>
                                    <TableCell align="right">Source resource</TableCell>
                                    <TableCell align="right">Target Resource</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.wt_by_resource.map((historyRow: any) => (
                                    <TableRow key={historyRow.date}>
                                        <TableCell/>
                                        <TableCell align="right">{historyRow.source_resource}</TableCell>
                                        <TableCell align="right">{historyRow.target_resource}</TableCell>
                                        <TableCell align="right">{historyRow.case_freq}</TableCell>
                                        <TableCell align="right">{historyRow.total_freq}</TableCell>
                                        <TableCell align="right">{historyRow.total_wt}</TableCell>
                                        <TableCell align="right">{historyRow.batching_wt}</TableCell>
                                        <TableCell align="right">{historyRow.prioritization_wt}</TableCell>
                                        <TableCell align="right">{historyRow.contention_wt}</TableCell>
                                        <TableCell align="right">{historyRow.unavailability_wt}</TableCell>
                                        <TableCell align="right">{historyRow.extraneous_wt}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
export default Row