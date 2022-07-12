import {
    Box, Card,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";
import TransitionsBarChart from "./TransitionsBarChart";
import Row from "./Row";





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