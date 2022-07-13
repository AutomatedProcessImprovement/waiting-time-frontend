import {useState} from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import paths from '../router/paths'
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import {LoadingButton} from '@mui/lab';
// TODO REPLACE LATER
import axios from "axios";


// Stream big file in worker thread




const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLogFile, setSelectedLogFile] = useState<File | null>(null);

    const navigate = useNavigate()

    const areFilesPresent = () => {
        const isEventLogProvided = !!selectedLogFile
        return isEventLogProvided;
    }

    const onContinueClick = () => {

        setLoading(true)
        if (!areFilesPresent()) {
            return
        }
        const formData = {
            'event_log': "http://localhost:8090/assets/samples/PurchasingExample.csv",
            'callback_endpoint': "http://example.com/callback"
        }


        // TODO AXIOS STUFF - CSV MAPPING?
        axios.post(
            'http://localhost:8080/jobs',
            formData)
            .then(((res:any) => {
            const jsonString = JSON.stringify(res.data)
            const blob = new Blob([jsonString], {type: "application/json"});
            const analysedEventLog = new File([blob], "name", { type: "application/json" })

            navigate(paths.DASHBOARD_PATH, {
                state: {
                    jsonLog: analysedEventLog
                }
            })
        })).catch((error: any) => {
            console.log("Need to handle this: " + error)
            setLoading(false)
        })
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
                                    Event log
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomDropzoneArea
                                    acceptedFiles={[".csv"]}
                                    setSelectedLogFile={setSelectedLogFile}
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
                        Upload event log
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    );
}

export default Upload;