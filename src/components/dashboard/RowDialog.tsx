import * as React from 'react';
import {Box, Button, Modal, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
var moment = require("moment");
require("moment-duration-format");
export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string[];
    onClose: (values: string[]) => void;
    type: number
}

const transitions_columns: GridColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'source_resource', headerName: 'Source Resource', width: 120},
    { field: 'target_resource', headerName: 'Target Resource', width: 120},
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
const cte_columns: GridColDef[] = [
    { field: 'id', headerName: 'ID'},
    { field: 'source_resource', headerName: 'Source Resource', width: 120},
    { field: 'target_resource', headerName: 'Target Resource', width: 120},
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
        field: 'batching_impact',
        headerName: 'Total Batching',
        width: 150,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.batching_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'contention_impact',
        headerName: 'Total R. Contention',
        width: 150,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.contention_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'prioritization_impact',
        headerName: 'Total Prioritization',
        width: 150,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.prioritization_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"

    },
    {
        field: 'unavailability_impact',
        headerName: 'Total R. Unavailability',
        width: 150,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.unavailability_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'extraneous_impact',
        headerName: 'Total Extraneous',
        width: 150,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.extraneous_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },


];

export default function RowDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open, type } = props;
    const handleClose = () => {
        onClose(selectedValue);
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1550,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 12,
        p: 6,
    };
    if (type === 0) {
        return (
            <Modal onClose={handleClose} open={open}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Row Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        In depth information of selected row
                    </Typography>
                    <div style={{height: 400, width: '100%'}}>
                        <DataGrid columns={transitions_columns} rows={selectedValue}/>
                    </div>
                    <Button onClick={() => handleClose()}>Close</Button>
                </Box>
            </Modal>
        );
    //    Can be expanded to be used in multiple different types
    } else {
        return (
            <Modal onClose={handleClose} open={open}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Row Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        In depth information of selected row
                    </Typography>
                    <div style={{height: 400, width: '100%'}}>
                        <DataGrid columns={cte_columns} rows={selectedValue}/>
                    </div>
                    <Button onClick={() => handleClose()}>Close</Button>
                </Box>
            </Modal>
        );
    }
}