import * as React from 'react';
import {DataGrid, GridColDef, GridEventListener, GridToolbar} from '@mui/x-data-grid';
import RowDialog from "../RowDialog";
var moment = require("moment");
require("moment-duration-format");
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'source_activity', headerName: 'Source Activity', width: 120},
    { field: 'target_activity', headerName: 'Target activity', width: 120},
    {
        field: 'case_freq',
        headerName: 'Case Frequency',
        type: 'number',
        width: 150,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2) ) + "%"
    },
    {
        field: 'total_freq',
        headerName: 'Total Frequency',
        type: 'number',
        width: 150
    },
    {
        field: 'total_wt',
        headerName: 'Total Waiting Time',
        width: 150,
        type: 'number',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },
    {
        field: 'batching_wt',
        headerName: 'Batching',
        width: 150,
        type: 'number',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },
    {
        field: 'contention_wt',
        headerName: 'R. Contention',
        width: 150,
        type: 'number',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },
    {
        field: 'prioritization_wt',
        headerName: 'Prioritization',
        width: 150,
        type: 'number',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },
    {
        field: 'unavailability_wt',
        headerName: 'R. Unavailability',
        width: 150,
        type: 'number',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },
    {
        field: 'extraneous_wt',
        headerName: 'Extraneous',
        width: 150,
        type: 'number',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },

];

const add_index = (data:any) => {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        data[i].id = i+1
    }
    return data
}

export default function TransitionsTable(data:any) {
    let table_data = add_index(data.data.report)

    let [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

    const handleClose = () => {
        setOpen(false);

    };

    const onEvent: GridEventListener<'rowDoubleClick'> = (
        params, // GridRowParams
    ) => {
        setOpen(true)
        setSelectedValue(params.row.wt_by_resource as string[])

    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={table_data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{ Toolbar: GridToolbar }}
                onRowDoubleClick={onEvent}
            />
            <RowDialog
                open={open}
                onClose={handleClose}
                selectedValue={add_index(selectedValue)}
                type={0}/>
        </div>
    );
}