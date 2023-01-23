import {Box, Card, CardContent,} from "@mui/material";
import React from "react";
import TransitionsBarChart from "./TransitionsBarChart";
import TransitionsTable from "./TransitionsTable";

function Transitions(data:any) {
    return (
        <Box sx={{
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            mx: "5rem"
        }}>
            <Card sx={{ minWidth: 550, minHeight: 500 }}>
                <CardContent>
                    <TransitionsBarChart data={data.data.report}/>
                </CardContent>
            </Card>
            <br/>
            <Card sx={{ minWidth: 500 }}>
                <CardContent>
                    <TransitionsTable data={data.data}/>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Transitions