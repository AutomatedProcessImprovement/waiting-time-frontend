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
        field: 'total_wt_converted',
        headerName: 'Total Batching',
        width: 150
    },
    {
        field: 'total_wt_converted',
        headerName: 'Total R. Contention',
        width: 150
    },
    {
        field: 'total_wt_converted',
        headerName: 'Total Prioritization',
        width: 150
    },
    {
        field: 'total_wt_converted',
        headerName: 'Total R. Unavailability',
        width: 150
    },
    {
        field: 'total_wt_converted',
        headerName: 'Total Extraneous',
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
    }
    return data
}

export default function CTETable(data:any) {
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