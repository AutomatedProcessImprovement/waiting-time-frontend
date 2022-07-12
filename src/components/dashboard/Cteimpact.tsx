import {Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Infobox from "./Infobox";
import * as React from "react";
import Row from "./Row";
import Typography from "@mui/material/Typography";
import PieChartBox from "./PieChartBox";

function cteImpactCalculations(data:any) {
    console.log(data)
}

cteImpactCalculations(1)

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

function Cteimpact(data:any) {

    const visData = [
        {name: 'Extraneous', value: data.data.total_extraneous_wt, label: "EXTRANEOUS\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Batching', value: data.data.total_batching_wt, label: "BATCHING\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Resource Unavailability', value: data.data.total_unavailability_wt, label: "UNAVAILABILITY\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Resource Contention', value: data.data.total_contention_wt, label: "CONTENTION\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Prioritization', value: data.data.total_prioritization_wt, label: "PRIORITIZATION\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))}
    ]

    return (
        <Box sx={{
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            mx: "5rem"
        }}>
            <Grid container spacing={3}
                  flexGrow={1}
                  justifyContent="flex-start"
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"stretch"}>
                <Grid item xs={6}>
                    <Grid   container
                            spacing={3}
                            flexGrow={1}
                            justifyContent="flex-start"
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"stretch"}
                    >
                        <Grid item xs={12}>
                            <Infobox data={{title: "Process CTE", subtitle: "Cycle Time Efficiency of the process", value: "123.15"}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Infobox data={{title: "Processing time (PT)", subtitle: "Total processing time", value: data.data.num_cases}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Infobox data={{title: "Waiting time (WT)", subtitle: "Total waiting time", value: dhmToString(secondsToDhm(data.data.total_wt))}}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Typography align={"left"} variant="h5" component="div" sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                            Potential CTE improvement per waiting time cause
                        </Typography>
                        <Typography  align={"left"} variant="h6" sx={{ fontSize: 16 }} color="text.secondary" component="div">
                            Potential CTE values when waiting time causes are eliminated
                        </Typography>
                        <PieChartBox data={visData}/>
                    </Grid>
                </Grid>

            </Grid>
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

export default Cteimpact