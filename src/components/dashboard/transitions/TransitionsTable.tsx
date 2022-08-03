import * as React from 'react';
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'source_activity', headerName: 'Source Activity', width: 120},
    { field: 'target_activity', headerName: 'Target activity', width: 120},
    {
        field: 'case_freq',
        headerName: 'Case Frequency',
        type: 'number',
        width: 150
    },
    {
        field: 'total_freq',
        headerName: 'Total Frequency',
        type: 'number',
        width: 150
    },
    {
        field: 'total_wt_converted',
        headerName: 'Total Waiting Time',
        width: 150
    },
    {
        field: 'total_batch_converted',
        headerName: 'Batching',
        width: 150
    },
    {
        field: 'total_cont_converted',
        headerName: 'R. Contention',
        width: 150
    },
    {
        field: 'total_prio_converted',
        headerName: 'Prioritization',
        width: 150
    },
    {
        field: 'total_unav_converted',
        headerName: 'R. Unavailability',
        width: 150
    },
    {
        field: 'total_extra_converted',
        headerName: 'Extraneous',
        width: 150
    },

];

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

const add_index = (data:any) => {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        data[i].id = i+1
        data[i].total_wt_converted = dhmToString(secondsToDhm(data[i].total_wt))
        data[i].total_batch_converted = dhmToString(secondsToDhm(data[i].batching_wt))
        data[i].total_prio_converted = dhmToString(secondsToDhm(data[i].prioritization_wt))
        data[i].total_cont_converted = dhmToString(secondsToDhm(data[i].contention_wt))
        data[i].total_extra_converted = dhmToString(secondsToDhm(data[i].extraneous_wt))
        data[i].total_unav_converted = dhmToString(secondsToDhm(data[i].unavailability_wt))
    }
    return data
}

export default function TransitionsTable(data:any) {
    let table_data = add_index(data.data.report)
    console.log(table_data)
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={table_data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    );
}