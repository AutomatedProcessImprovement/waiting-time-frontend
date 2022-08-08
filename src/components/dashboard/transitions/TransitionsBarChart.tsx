import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';
var moment = require("moment");
require("moment-duration-format");
const CustEndLabel = (props: { x: any; y: any; value: number;}) => {
    const { x, y, value } = props;


    if (value < 1) {
        return (
            <text
                x={x}
                y={y}
                dx={"1%"}
                dy={20}
                fontSize="15"
                fontWeight="bold"
                fill={"#181818"}
                textAnchor="start"
            >
                No Waiting Time
            </text>
        );
    }
    return (
        <text
            x={x}
            y={y}
            dx={"1%"}
            dy={20}
            fontSize="15"
            fontWeight="bold"
            fill={"#181818"}
            textAnchor="start"
        >
            {moment.duration(value, 'seconds').format('d[D] HH[H] mm[M]')}
        </text>
    );
}

const CustBarLabel = (props: { x: any; y:any, value: any; }) => {
    const { x, y, value } = props;
    if (value === "0.00" || isNaN(value)) {
        return (
            <text>

            </text>
        );
    }
    return (
        <text x={x} y={y} dy={20} dominantBaseline="auto" textAnchor="start">
            {value + "%"}
        </text>
    );
};

function AdditionalData(data: any) {
//    Calculate the percentage of respective waiting_times in each report entry
    for (var entry of data) {
        entry.batch_wt_perc = (entry.batching_wt / entry.total_wt * 100).toFixed(2)
        entry.prio_wt_perc = (entry.prioritization_wt / entry.total_wt * 100).toFixed(2)
        entry.cont_wt_perc = (entry.contention_wt / entry.total_wt * 100).toFixed(2)
        entry.unav_wt_perc = (entry.unavailability_wt / entry.total_wt * 100).toFixed(2)
        entry.extr_wt_perc = (entry.extraneous_wt / entry.total_wt * 100).toFixed(2)
        entry.bar_label = entry.source_activity + " - " + entry.target_activity
    }
    return data.sort((f: { total_wt: number; }, s: { total_wt: number; }) => 0 - (f.total_wt > s.total_wt ? 1 : -1))

}

function TransitionsBarChart(data: any) {
    let data_copy = [...data.data]
    const bar_data = AdditionalData(data_copy)

    return (
        <>
            <ResponsiveContainer width={"100%"} height={400} min-width={400}>

                <BarChart
                    width={1920}
                    height={500}
                    data={bar_data}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 10,
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
                    <Bar name={"Batching"} dataKey="batching_wt" stackId="a" fill="#6C8EBF" >
                        <LabelList dataKey="batch_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>
                    </Bar>
                    <Bar name={"Prioritization"} dataKey="prioritization_wt" stackId="a" fill="#B8544F">
                        <LabelList dataKey="prio_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>
                    </Bar>
                    <Bar name={"R. Contention"} dataKey="contention_wt" stackId="a" fill="#D7B500">
                        <LabelList dataKey="cont_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>
                    </Bar>
                    <Bar name={"R. Unavailability"} dataKey="unavailability_wt" stackId="a" fill="#63B7B0" >
                        <LabelList dataKey="unav_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>
                    </Bar>
                    <Bar name={"Extraneous"} dataKey="extraneous_wt" stackId="a" fill="#B3B3B3">
                        <LabelList dataKey="extr_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>
                    </Bar>
                    {/*TODO Create second custom label that contains all the total values of the row. to replace BLACK colored label at end of bar*/}
                    <Bar dataKey="" stackId="a" label={<CustEndLabel x={-10} y={-10} value={1}/>}/>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}
export default TransitionsBarChart
