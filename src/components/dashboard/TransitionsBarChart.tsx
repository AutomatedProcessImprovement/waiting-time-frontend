import data from '../../demo_data/batching_output_example.json'
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

function create_bar_data() {
    return data.report
}

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


const CustEndLabel = (props: { x: any; y: any; value: number;}) => {
    const { x, y, value } = props;

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
            {dhmToString(secondsToDhm(value))}
        </text>
    );
}

const CustBarLabel = (props: { x: any; y:any, value: any; }) => {
    const { x, y, value } = props;

    return (
        <text x={x} y={y} dy={20} fontWeight="bold" dominantBaseline="auto" textAnchor="start">
            {value + "%"}
        </text>
    );
};


function TransitionsBarChart() {
    let bar_data = create_bar_data()
    bar_data = bar_data.sort((f,s) => 0 - (f.total_wt > s.total_wt ? 1 : -1))

    return (
        <>
            <ResponsiveContainer width={"100%"} height={400} min-width={400}>

                <BarChart
                    width={2160}
                    height={500}
                    data={bar_data}
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
                    <XAxis type={'number'} hide />
                    <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="bar_label" />
                    <Tooltip />
                    <Legend />
                    <Bar name={"Batching"} dataKey="batching_wt" stackId="a" fill="#6C8EBF">
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
                    {/*TODO UGLY STUFF -> Should be a better way no?*/}
                    <Bar dataKey="" stackId="a" label={<CustEndLabel x={-10} y={-10} value={1}/>}/>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}
export default TransitionsBarChart
