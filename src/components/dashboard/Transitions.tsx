import {
    Box, Card,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from "react";
import TransitionsBarChart from "./TransitionsBarChart";


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
function Transitions(data:any) {
    // TODO - REPLACE WITH DATATABLE INSTEAD OF TABLE
    return (
        <Box sx={{
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            mx: "5rem"
        }}>
            <Card sx={{ minWidth: 500 }}>
                <TransitionsBarChart data={data.data.report}/>
            </Card>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">#</TableCell>
                            <TableCell align="right">Source Activity</TableCell>
                            <TableCell align="right">Target Activity</TableCell>
                            <TableCell align="right">Case frequency</TableCell>
                            <TableCell align="right">Total frequency</TableCell>
                            <TableCell align="right">Total wt</TableCell>
                            <TableCell align="right">Batching</TableCell>
                            <TableCell align="right">R. contention</TableCell>
                            <TableCell align="right">Prioritization</TableCell>
                            <TableCell align="right">R. unavailability</TableCell>
                            <TableCell align="right">Extraneous</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.data.report.map((row: any) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Transitions