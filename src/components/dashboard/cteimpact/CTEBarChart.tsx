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
const COLORS = [ colordict.batching,colordict.prioritization,colordict.contention, colordict.unavailability, colordict.extraneous]


const CustBarLabel = (props: { x: any; y:any, value: any; }) => {
    const { x, y, value } = props;
    return (
        <text x={x} y={y} dx={'60%'} dy={20} dominantBaseline="auto" textAnchor="start">
            {(value*100).toFixed(2) + "%"}
        </text>
    );
};

const getIntroOfPage = (label: string) => {
    if (label === "Batching") {
        return "This bar represents the CTE value if all batching waiting time is eliminated";
    }
    if (label === "Prioritization") {
        return "This bar represents the CTE value if all prioritization waiting time is eliminated";
    }
    if (label === "Resource Contention") {
        return "This bar represents the CTE value if all resource contention waiting time is eliminated";
    }
    if (label === "Resource Unavailability") {
        return "This bar represents the CTE value if all resource unavailability waiting time is eliminated";
    }
    if (label === "Extraneous") {
        return "This bar represents the CTE value if all extraneous waiting time is eliminated";
    }
    return "";
};
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="tooltip">
                <p className="label">{`CTE after eliminating ${label} : ${(payload[0].value*100).toFixed(4) + "%"}`}</p>
                <p className="intro">{getIntroOfPage(label)}</p>
            </div>
        );
    }

    return null;
};


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
                <XAxis type={'number'} domain={[0,1]} hide/>
                <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="name" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" label={CustBarLabel}>
                    {data.data.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </>
    )
}

