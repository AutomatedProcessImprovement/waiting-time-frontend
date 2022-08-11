import {Box, Card, CardContent, Grid} from "@mui/material";
import Infobox from "../Infobox";
import * as React from "react";
import Typography from "@mui/material/Typography";
import CTEBarChart from "./CTEBarChart";
import CTETable from "./CTETable";

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
        {name: 'Batching', value: data.data.cte_impact.batching_impact},
        {name: 'Prioritization', value: data.data.cte_impact.prioritization_impact},
        {name: 'Resource Contention', value: data.data.cte_impact.contention_impact},
        {name: 'Resource Unavailability', value: data.data.cte_impact.unavailability_impact},
        {name: 'Extraneous', value: data.data.cte_impact.extraneous_impact}
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
                        <Card>
                            <CardContent>
                                <Typography align={"left"} variant="h5" component="div" sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                                    Potential CTE improvement per waiting time cause
                                </Typography>
                                <Typography  align={"left"} variant="h6" sx={{ fontSize: 16 }} color="text.secondary" component="div">
                                    Potential CTE values when waiting time causes are eliminated
                                </Typography>
                                <CTEBarChart data={visData}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <br/>
            <Card>
                <CardContent>
                    <CTETable data={data.data}/>
                </CardContent>
            </Card>
        </Box>

    )

}

export default Cteimpact