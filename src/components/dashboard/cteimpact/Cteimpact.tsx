import {Box, Grid} from "@mui/material";
import Infobox from "../Infobox";
import * as React from "react";
import Typography from "@mui/material/Typography";
import CTEBarChart from "./CTEBarChart";
import CTETable from "./CTETable";

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
        {name: 'Extraneous', value: data.data.cte_impact.extraneous_impact},
        {name: 'Batching', value: data.data.cte_impact.batching_impact},
        {name: 'Resource Unavailability', value: data.data.cte_impact.unavailability_impact},
        {name: 'Resource Contention', value: data.data.cte_impact.contention_impact},
        {name: 'Prioritization', value: data.data.cte_impact.prioritization_impact}
    ]
    console.log(visData)

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
                            <Infobox data={{title: "Process CTE", subtitle: "Cycle Time Efficiency of the process", value: (data.data.process_cte* 100).toFixed(2) + '%'}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Infobox data={{title: "Processing time (PT)", subtitle: "Total processing time", value: dhmToString(secondsToDhm(data.data.total_pt))}}/>
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
                        <CTEBarChart data={visData}/>
                    </Grid>
                </Grid>

            </Grid>
            <CTETable data={data.data}/>
            {/*<TableContainer component={Paper}>*/}
            {/*    <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ tableLayout: 'fixed' }}>*/}
            {/*        <TableHead>*/}
            {/*            <TableRow>*/}
            {/*                <TableCell align="right">#</TableCell>*/}
            {/*                <TableCell align="right">Source Activity</TableCell>*/}
            {/*                <TableCell align="right">Target Activity</TableCell>*/}
            {/*                <TableCell align="right">Case frequency</TableCell>*/}
            {/*                <TableCell align="right">Total frequency</TableCell>*/}
            {/*                <TableCell align="right">Total wt</TableCell>*/}
            {/*                <TableCell align="right">Batching</TableCell>*/}
            {/*                <TableCell align="right">R. contention</TableCell>*/}
            {/*                <TableCell align="right">Prioritization</TableCell>*/}
            {/*                <TableCell align="right">R. unavailability</TableCell>*/}
            {/*                <TableCell align="right">Extraneous</TableCell>*/}
            {/*            </TableRow>*/}
            {/*        </TableHead>*/}
            {/*        <TableBody>*/}
            {/*            {data.data.report.map((row: any) => (*/}
            {/*                <Row key={row.name} row={row} />*/}
            {/*            ))}*/}
            {/*        </TableBody>*/}
            {/*    </Table>*/}
            {/*</TableContainer>*/}
        </Box>

    )

}

export default Cteimpact