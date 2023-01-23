import {Cell, Pie, PieChart, Tooltip} from "recharts";
import {Card, CardContent} from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
var moment = require("moment");
require("moment-duration-format");
const _colorDict = {
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
}
const COLORS = [_colorDict.extraneous, _colorDict.batching, _colorDict.unavailability, _colorDict.contention, _colorDict.prioritization]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="tooltip">
                {payload.map((entry: any) => (
                    <p>{entry.name} : {moment.duration(entry.value, 'seconds').format('d[D] HH[H] mm[M]')}</p>
                ))}
            </div>
        );
    }
    return null;
};

export default function PieChartBox(data:any) {
    const processed_data = []
    for (const dataKey in data.data) {
        console.log(data.data[dataKey])
        let out = {
            name:data.data[dataKey].name,
            y: data.data[dataKey].value,
            custom: {label_info: moment.duration(data.data[dataKey].value, 'seconds').format('d[D] HH[H] mm[M]')}

        }
        processed_data.push(out)
    }

    const options = {
        colors: COLORS,
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Waiting time causes',
            align: 'left'
        },
        subtitle: {
            text: 'Total waiting time of the process by its cause',
            align: 'left'
        },
        tooltip: {
            pointFormat: '<b>{point.custom.label_info}</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },

        series: [{
            name: 'Waiting time ',
            colorByPoint: true,
            data: processed_data
        }]
    }

    return(
        <Card sx={{ minWidth: 500, minHeight: 450 }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </Card>
    )
    // return (
    //     <Card sx={{ minWidth: 275 }} style={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //     }}>
    //         <CardContent>
    //             <Typography align={"left"} variant="h5" component="div" sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
    //                 Waiting time causes
    //             </Typography>
    //             <Typography  align={"left"} variant="h6" sx={{ fontSize: 16 }} color="text.secondary" component="div">
    //                 Total waiting time of the process by its cause
    //             </Typography>
    //             <PieChart height={700} width={700} margin={{top: 5, bottom: 5}}>
    //                 <Pie
    //                     data={data.data}
    //                     cx="50%"
    //                     cy="50%"
    //                     outerRadius={120}
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
    //                                 <tspan x={x} y={y} fill="grey" alignmentBaseline="middle" fontSize="14">{(data.data[index].name).toUpperCase()}</tspan>
    //                                 <tspan x={x} y={y + 20} fill="black" alignmentBaseline="middle" fontSize="12">{moment.duration(value, 'seconds').format('d[D] HH[H] mm[M]')}</tspan>
    //                             </text>
    //                         );
    //                     }}
    //                 >
    //                     {data.data.map((entry: any, index: number) => (
    //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //                     ))}
    //                 </Pie>
    //                 <Tooltip content={<CustomTooltip />} />
    //             </PieChart>
    //         </CardContent>
    //     </Card>
    // )
}

