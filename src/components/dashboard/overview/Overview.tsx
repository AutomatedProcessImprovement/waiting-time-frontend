import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Infobox from "../Infobox";
import PieChartBox from "../PieChartBox";
import Typography from "@mui/material/Typography";

var moment = require("moment");
require("moment-duration-format");
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



function Dashboard(data: any) {

    const visData = [
        {name: 'Extraneous', value: data.data.total_extraneous_wt, label: "EXTRANEOUS\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Batching', value: data.data.total_batching_wt, label: "BATCHING\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Resource Unavailability', value: data.data.total_unavailability_wt, label: "UNAVAILABILITY\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Resource Contention', value: data.data.total_contention_wt, label: "CONTENTION\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))},
        {name: 'Prioritization', value: data.data.total_prioritization_wt, label: "PRIORITIZATION\n" + dhmToString(secondsToDhm(data.data.total_extraneous_wt))}
    ]


    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            mx: "5rem"
        }}>
            <Grid container
                  spacing={3}
                  flexGrow={1}
                  justifyContent="flex-start"
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"stretch"}
            >
                <Grid item xs={6}>
                    <Grid   container
                            spacing={3}
                            flexGrow={1}
                            justifyContent="flex-start"
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"stretch"}
                    >
                        <Grid item xs={6}>
                            <Infobox data={{title: "Cases", subtitle: "Total number of cases", value: data.data.num_cases}}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Infobox data={{title: "Waiting time (WT)", subtitle: "Total waiting time of the process", value: moment.duration(data.data.total_wt, 'seconds').format('d[D] HH[H] mm[M]')}}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Infobox data={{title: "Activities", subtitle: "Total number of activities", value: data.data.num_activities}}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Infobox data={{title: "Activity instances", subtitle: "Total number of activity executions", value: data.data.num_activity_instances}}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Infobox data={{title: "Activity transitions", subtitle: "Total number of activity pairs where transitions occur", value: data.data.num_transitions}}/>
                        </Grid>
                        <Grid item xs={6}>
                            <Infobox data={{title: "Activity instance transitions", subtitle: "Total number of transition executions between activities", value: data.data.num_transition_instances}}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Typography align={"left"} variant="h5" component="div" sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                            Waiting time causes
                        </Typography>
                        <Typography  align={"left"} variant="h6" sx={{ fontSize: 16 }} color="text.secondary" component="div">
                            Total waiting time of the process by its cause
                        </Typography>
                        <PieChartBox data={visData}/>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )

}

export default Dashboard

// <Grid direction={"row"} container alignItems="center" justifyContent="center" spacing={0} style={{ paddingTop:'15px', paddingLeft: '15%', paddingRight: '15%' }}>
// <Grid item xs={4}>
//     <Grid container spacing={0}>
//     <Grid item xs={6}>
//     <Box
// sx={{
//     bgcolor: 'background.paper',
//         boxShadow: 1,
//         borderRadius: 2,
//         p: 2,
//
// }}
// >
// <Box sx={{ color: 'text.primary'}} className="leftContent">Cases</Box>
// <Box sx={{ color: 'text.secondary', fontSize: 14 }} className="leftContent">
//     Total number of cases
// </Box>
// <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
//     {data.num_cases}
// </Box>
// </Box>
//
// </Grid>
// <Grid item xs={6}>
//     <Box
//         sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             borderRadius: 2,
//             p: 2,
//         }}
//     >
//         <Box sx={{ color: 'text.primary' }} className="leftContent">Waiting time (WT)</Box>
//         <Box sx={{ color: 'text.secondary', fontSize: 14 }} className="leftContent">
//             Total waiting time of the process
//         </Box>
//         <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
//             {dhmToString(secondsToDhm(data.total_wt))}
//         </Box>
//     </Box>
//
// </Grid>
// <Grid item xs={6}>
//     <Box
//         sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             borderRadius: 2,
//             p: 2,
//         }}
//     >
//         <Box sx={{ color: 'text.primary' }} className="leftContent">Activities</Box>
//         <Box sx={{ color: 'text.secondary', fontSize: 14 }} className="leftContent">
//             Total number of activites
//         </Box>
//         <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
//             {data.num_activities}
//         </Box>
//     </Box>
//
// </Grid>
// <Grid item xs={6}>
//     <Box
//         sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             borderRadius: 2,
//             p: 2,
//         }}
//     >
//         <Box sx={{ color: 'text.primary' }} className="leftContent">Activity instances</Box>
//         <Box sx={{ color: 'text.secondary', fontSize: 14 }} className="leftContent">
//             Total number of activity executions
//         </Box>
//         <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
//             {data.num_activity_instances}
//         </Box>
//     </Box>
//
// </Grid>
// <Grid item xs={6}>
//     <Box
//         sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             borderRadius: 2,
//             p: 2,
//         }}
//     >
//         <Box sx={{ color: 'text.primary' }} className="leftContent">Activity transitions</Box>
//         <Box sx={{ color: 'text.secondary',fontSize: 14 }} className="leftContent">
//             Total number of activity pairs where transactions occur
//         </Box>
//         <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
//             {data.num_transitions}
//         </Box>
//     </Box>
//
// </Grid>
// <Grid item xs={6}>
//     <Box
//         sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             borderRadius: 2,
//             p: 2,
//         }}
//     >
//         <Box sx={{ color: 'text.primary' }} className="leftContent">Activity instance transitions</Box>
//         <Box sx={{ color: 'text.secondary', fontSize: 14 }} className="leftContent">
//             Total number of transition executions between activities
//         </Box>
//         <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
//             {data.num_transition_instances}
//         </Box>
//     </Box>
//
// </Grid>
// </Grid>
// </Grid>
// <Grid item xs={8}>
//     <Box
//         sx={{
//             bgcolor: 'background.paper',
//             boxShadow: 1,
//             borderRadius: 2,
//             p: 2,
//         }}
//     >
//         <Box sx={{ color: 'text.primary' }} className="leftContent">Waiting time causes</Box>
//         <Box sx={{ color: 'text.secondary', fontSize: 14 }} className="leftContent">
//             Total waiting time of the process by its cause
//         </Box>
//         <Box>
//             <PieChart height={500}>
//                 <Pie
//                     data={visData}
//                     cx="50%"
//                     cy="50%"
//                     // outerRadius={120}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({
//                                 cx,
//                                 cy,
//                                 midAngle,
//                                 innerRadius,
//                                 outerRadius,
//                                 value,
//                                 index
//                             }) => {
//                         console.log("handling label?");
//                         const RADIAN = Math.PI / 180;
//                         // eslint-disable-next-line
//                         const radius = 25 + innerRadius + (outerRadius - innerRadius);
//                         // eslint-disable-next-line
//                         const x = cx + radius * Math.cos(-midAngle * RADIAN);
//                         // eslint-disable-next-line
//                         const y = cy + radius * Math.sin(-midAngle * RADIAN);
//
//                         return (
//                             <text
//                                 x={x}
//                                 y={y}
//                                 textAnchor={x > cx ? "start" : "end"}
//                                 dominantBaseline="central"
//                                 className="recharts-text recharts-label"
//
//                             >
//                                 <tspan x={x} y={y} fill="grey" alignmentBaseline="middle" fontSize="18">{(visData[index].name).toUpperCase()}</tspan>
//                                 <tspan x={x} y={y + 20} fill="black" alignmentBaseline="middle" fontSize="16">{dhmToString(secondsToDhm(value))}</tspan>
//                             </text>
//                         );
//                     }}
//                 >
//                     {visData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                 </Pie>
//             </PieChart>
//         </Box>
//     </Box>
// </Grid>
// </Grid>