import {
    Bar,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    ResponsiveContainer, Cell
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

export default function CTEBarChart(data:any) {
    console.log(data.data)
    return (
        <>
            <ResponsiveContainer width={"100%"} height={400} min-width={400}>
            <BarChart
                width={2160}
                height={300}
                data={data.data}
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
                <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" label={{ position: 'right' }}>
                    {data.data.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </>
    )
}

