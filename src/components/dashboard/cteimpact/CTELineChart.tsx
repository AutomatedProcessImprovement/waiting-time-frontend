import * as React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        let case_data = payload[0].payload
        console.log(case_data)
        return (
            <div className="tooltip">
                <p style={{fontWeight: 'bold'}} className="label">{`${case_data.pt_total} mins`}</p>
                <p className="label">{`Case ID:`} <strong>{label}</strong></p>
                <p className="label">{`Case CTE:`} <strong>{(case_data.cte_impact*100).toFixed(2) + "%"}</strong></p>
            </div>
        );
    }
    return null;
};

export default function CTELineChart(data: any) {
    let chart_data = data.data
    return (
        <>
            <ResponsiveContainer width={"100%"} height={400} min-width={400}>
                <LineChart width={730} height={250} data={chart_data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="case_id" padding={{ left: 30, right: 30 }}>
                        <Label
                            style={{
                                textAnchor: "middle",
                                fontSize: "110%",
                                fill: "black",
                            }}
                            dy={10}
                            value={"Case ID"} />
                    </XAxis>
                    <YAxis type={"number"}>
                        <Label
                            style={{
                                textAnchor: "middle",
                                fontSize: "110%",
                                fill: "black",
                                fontWeight:'bold'
                            }}
                            dx={-30}
                            angle={270}
                            value={"Time (min.)"} />
                    </YAxis>
                    <Tooltip content={CustomTooltip}/>
                    <Legend />
                    <Line type="monotone" dataKey="pt_total" stroke="#fb5607" strokeWidth={'2px'} name={'PT'}/>
                    <Line type="monotone" dataKey="wt_total" stroke="#0077b6" strokeWidth={'2px'} name={'WT'}/>
                </LineChart>
            </ResponsiveContainer>
        </>
    )
};