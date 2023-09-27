import {Box, Card, CardContent, Grid} from "@mui/material";
import Infobox from "../Infobox";
import * as React from "react";
import CTEBarChart from "./CTEBarChart";
import CTETable from "../overview/CTETable";
import CTELineChart from "./CTELineChart";
import CTEHeatmap from "../overview/CTEHeatmap";
import CTETable2 from "./CTETable2";
var moment = require("moment");
require("moment-duration-format");
function Cteimpact(data:any) {
    const visData = [
        {name: 'Current CTE', y: data.data.process_cte},
        {name: 'Batching', y: data.data.cte_impact.batching_impact},
        {name: 'Prioritization', y: data.data.cte_impact.prioritization_impact},
        {name: 'Resource contention', y: data.data.cte_impact.contention_impact},
        {name: 'Resource unavailability', y: data.data.cte_impact.unavailability_impact},
        {name: 'Extraneous', y: data.data.cte_impact.extraneous_impact}
    ]

    let per_case_wt = [...data.data.per_case_wt]
    let sorted_cases_per_wt = per_case_wt.sort(
        (p1: any, p2:any) => (p1.cte_impact < p2.cte_impact ? 1 : (p1.cte_impact > p2.cte_impact) ? -1: 0)
    )

    let significant_data = sorted_cases_per_wt.reverse().slice(0,50)
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
                            <Infobox data={{title: "Process CTE", subtitle: "Cycle time efficiency of the process", value: (data.data.process_cte* 100).toFixed(2) + '%'}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Infobox data={{title: "Processing time", subtitle: "Total processing time", value: moment.duration(data.data.total_pt, 'seconds').format('d[D] HH[H] mm[M]')}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Infobox data={{title: "Waiting time", subtitle: "Total waiting time of the process", value: moment.duration(data.data.total_wt, 'seconds').format('d[D] HH[H] mm[M]')}}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <CTEBarChart data={visData}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {/*<Grid item xs={12}>*/}
                {/*    <Card>*/}
                {/*        <CardContent>*/}
                {/*            <CTEHeatmap data={data.data}/>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}
                {/*</Grid>*/}
            </Grid>
            <br/>
            {/*<Card>*/}
            {/*    <CardContent>*/}
            {/*        <CTETable data={data.data}/>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
            <br/>
            <Card>
                <CardContent>
                    <CTELineChart data={significant_data}/>
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <CTETable2 data={significant_data}/>
                </CardContent>
            </Card>

        </Box>

    )

}

export default Cteimpact