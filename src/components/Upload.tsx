import { useState } from 'react';
import {Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import paths from '../router/paths'
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import { LoadingButton } from '@mui/lab';

// enum Source {
//     empty,
//     existing,
//     logs
// }

const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate()

    const onContinueClick = () => {
        setLoading(true)
        navigate(paths.DASHBOARD_PATH, {})
        setLoading(false)
    };

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '10px' }} className="centeredContent">
                <Grid item xs={9}>
                    <Grid item>
                        <Typography variant="subtitle1">
                            Upload an event log to start the waiting time analysis. (CSV format)
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="left">
                                    Process Model
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomDropzoneArea
                                    acceptedFiles={[".csv"]}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton
                        variant="contained"
                        onClick={onContinueClick}
                        loading={loading}
                    >
                        Specify Scenario Parameters
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    );
}

export default Upload;