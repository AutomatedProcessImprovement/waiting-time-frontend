import * as React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    Brush
} from 'recharts';
var moment = require("moment");
require("moment-duration-format");

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        let case_data = payload[0].payload
        return (
            <div className="tooltip">
                <div className="label">{`Case ID:`} <strong>{label}</strong></div>
                <div className="label">{`Case CTE:`} <strong>{(case_data.cte_impact*100).toFixed(2) + "%"}</strong></div>
                <div className="label">{`Processing time:`} <strong>{` ${ moment.duration(case_data.pt_total, 'seconds').format('d[D] HH[H] mm[M]')}`}</strong></div>
                <div className="label">{`Waiting time:`} <strong>{`${ moment.duration(case_data.wt_total, 'seconds').format('d[D] HH[H] mm[M]')}`}</strong></div>
            </div>
        );
    }
    return null;
};

const YAxisFormatter = (number: number) => {

    var Days=Math.floor(number/60/60/24);
    var Remainder=number % 24;
    var Hours=Math.floor(Remainder);
    var Minutes=Math.floor(60*(Remainder-Hours));
    if (Days >= 1) {
        return Days+"d"
    }
    if (Hours >= 1) {
        return Hours + "h"
    }
    if (Minutes >= 1) {
        return Minutes+"m";
    }
    // console.log(Math.floor(number / 60 / 60 / 24))
    // console.log(Math.floor(number / 24 / 60))
    // console.log(Math.floor(number / 60))
    // if (Math.floor(number / 60 / 60 / 24) > 1) {
    //     return (number / 60 / 60 / 24).toFixed(2).toString() + "d"
    // }
    // if (Math.floor(number / 24 / 60) > 60) {
    //     return (number/ 24 / 60).toFixed(2).toString() + "h";
    // }
    // if (Math.floor(number / 60) > 60) {
    //     return (number/ 60).toFixed(2).toString() + "m";
    // }
    return (number/ 60).toFixed(0).toString() + "m";
}

export default function CTELineChart(data: any) {
    let chart_data = data.data
    return (
        <>
            <ResponsiveContainer width={"100%"} height={400} min-width={400}>
                <LineChart width={730} height={250} data={chart_data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Brush dataKey="name" height={30} stroke="#8884d8"/>
                    <XAxis dataKey="case_id" padding={{ left: 30, right: 30 }}>
                        <Label
                            style={{
                                textAnchor: "middle",
                                fontSize: "110%",
                                fill: "black",
                            }}
                            dy={27}
                            dx={0}
                            value={"Case ID"} />
                    </XAxis>
                    <YAxis type={"number"} domain={['dataMin', 'dataMax']} tickFormatter={YAxisFormatter} tickCount={8}>
                        <Label
                            style={{
                                textAnchor: "middle",
                                fontSize: "110%",
                                fill: "black",
                                fontWeight:'bold'
                            }}
                            dy={20}
                            dx={-40}
                            angle={270}
                            value={"Time"} />
                    </YAxis>
                    <Tooltip content={CustomTooltip}/>
                    <Legend />
                    <Line type="monotone" dataKey="pt_total" stroke="#fb5607" strokeWidth={'2px'} name={'Processing time'}/>
                    <Line type="monotone" dataKey="wt_total" stroke="#0077b6" strokeWidth={'2px'} name={'Waiting time'}/>
                </LineChart>
            </ResponsiveContainer>
        </>
    )
};