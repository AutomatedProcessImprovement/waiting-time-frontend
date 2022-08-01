import {
    Bar,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    LabelList,
    ResponsiveContainer
} from "recharts";
import * as React from "react";

let colordict = {
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
}
const COLORS = [colordict.extraneous, colordict.batching, colordict.unavailability, colordict.contention, colordict.prioritization]

export default function CTEPiechart(data:any) {

    return (
        <>
            <ResponsiveContainer width={"100%"} height={400} min-width={400}>
            <BarChart
                width={2160}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                barGap={'5%'}
                layout={'vertical'}
                barSize={30}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type={'number'} hide/>
                <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="bar_label" />
                <Tooltip />
                <Legend />
                <Bar name={"Batching"} dataKey="batching_wt"  fill="#6C8EBF">
                </Bar>
                <Bar name={"Prioritization"} dataKey="prioritization_wt"  fill="#B8544F">
                </Bar>
                <Bar name={"R. Contention"} dataKey="contention_wt"  fill="#D7B500">
                </Bar>
                <Bar name={"R. Unavailability"} dataKey="unavailability_wt"  fill="#63B7B0" >
                </Bar>
                <Bar name={"Extraneous"} dataKey="extraneous_wt"  fill="#B3B3B3">
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </>
    )
}

