import {Cell, Pie, PieChart} from "recharts";
import {Card} from "@mui/material";
import * as React from "react";
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");

let colordict = {
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
}
const COLORS = [colordict.extraneous, colordict.batching, colordict.unavailability, colordict.contention, colordict.prioritization]


export default function PieChartBox(data:any) {

    return (
        <Card sx={{ minWidth: 275 }}>
            <PieChart height={500} width={1000} margin={{top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                    data={data.data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                value,
                                index
                            }) => {
                        const RADIAN = Math.PI / 180;
                        // eslint-disable-next-line
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        // eslint-disable-next-line
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        // eslint-disable-next-line
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                                x={x}
                                y={y}
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                className="recharts-text recharts-label"

                            >
                                <tspan x={x} y={y} fill="grey" alignmentBaseline="middle" fontSize="18">{(data.data[index].name).toUpperCase()}</tspan>
                                <tspan x={x} y={y + 20} fill="black" alignmentBaseline="middle" fontSize="16">{moment.duration(value, 'seconds').format('d[D] HH[H] mm[M]')}</tspan>
                            </text>
                        );
                    }}
                >
                    {data.data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </Card>
    )
}

