import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

function Transitions(data:any) {
    console.log(data.data.report)
    // TODO REFER TO THIS LATER
    // https://mui.com/material-ui/react-table/

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
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
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.source_activity}</TableCell>
                            <TableCell align="right">{row.target_activity}</TableCell>
                            <TableCell align="right">{row.case_freq}</TableCell>
                            <TableCell align="right">{row.total_freq}</TableCell>
                            <TableCell align="right">{row.total_wt}</TableCell>
                            <TableCell align="right">{row.batching_wt}</TableCell>
                            <TableCell align="right">{row.prioritization_wt}</TableCell>
                            <TableCell align="right">{row.contention_wt}</TableCell>
                            <TableCell align="right">{row.unavailability_wt}</TableCell>
                            <TableCell align="right">{row.extraneous_wt}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Transitions