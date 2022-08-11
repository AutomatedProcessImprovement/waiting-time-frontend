import React, {useState} from 'react';
import {AlertColor, Grid, Paper, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import {LoadingButton} from '@mui/lab';
// TODO REPLACE LATER
import axios from "axios";
import paths from "../router/paths";
import Papa from 'papaparse'
import MappingDialog from "./upload/Mapping";
import CustomizedSnackbar from "./CustomizedSnackBar";


const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    let [open, setOpen] = React.useState(false);
    const [selectedLogFile, setSelectedLogFile] = useState<File | null>(null);
    const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

    const [snackMessage, setSnackMessage] = useState("")
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)


    const handleClose = (cancel:boolean, values: string[]) => {
        if (cancel) {
            setLoading(false);
        } else {
            setInfoMessage('Analysis in progress...')
            handleValidRequest(values)
        }
        setOpen(false);

    };

    const setInfoMessage = (value: string) => {
        setSnackColor("info")
        setSnackMessage(value)
    };

    const setErrorMessage = (value: string) => {
        setSnackColor("error")
        setSnackMessage(value)
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
    };

    const formData = new FormData()
    if (selectedLogFile) {
        formData.append('event_log', selectedLogFile)
    }

    const navigate = useNavigate();

    const areFilesPresent = () => {
        return !!selectedLogFile;
    }


    const onContinueClick = () => {

        setLoading(true)
        if (!areFilesPresent()) {
            setLoading(false)
            return
        }
        Papa.parse(selectedLogFile!, {
            preview: 1,
            complete: function (results) {
                setOpen(true)
                setSelectedValue(results.data[0] as string[])
            }
        });
    };

    const handleValidRequest = (values: string[]) => {
        // TODO values => mapping of header of csv.
        //  needs to be passed along or need to update file before sending request.
        console.log(values)
        const config = {
            method: 'post',
            url: 'http://193.40.11.233/jobs',
            headers: {
                'Content-Type': 'text/csv'
            },
            data: new Blob([selectedLogFile as Blob], {type: "text/csv"})
        };
        axios(
            config
        )
            .then(((res:any) => {
                let job = res.data
                let f = setInterval(() => {
                    axios.get(
                        'http://193.40.11.233/jobs/' + job.id,
                    ).then((r:any)  => {
                        let j = r.data
                        if (j.status === 'completed' || j.status === 'duplicate') {
                            clearInterval(f)
                            let logN = selectedLogFile?.name
                            navigate(paths.DASHBOARD_PATH, {
                                state: {
                                    jsonLog: j.result,
                                    report: j,
                                    logName: logN
                                }
                            })
                            setLoading(false)
                        }
                    })
                }, 30000)
            })).catch((error: any) => {
                setErrorMessage(error)
            setLoading(false)
        })
    }

    return (
        <>
            <br/>
            <br/>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '10px' }} className="centeredContent">
                <Grid item xs={2.5}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="left" sx={{color: 'red', fontWeight: 'medium'}}>
                                    NOTICE:
                                </Typography>
                                <Typography align={"left"} sx={{color: 'red'}}>
                                    Please format your event_log for now like the following example:
                                    <ul className={'noticeList'}>
                                        <li>Case ID → case:concept:name</li>
                                        <li>Activity → concept:name</li>
                                        <li>Start Timestamp → start_timestamp</li>
                                        <li>End Timestamp → time:timestamp</li>
                                        <li>Resource → org:resource</li>
                                    </ul>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center">
                                    Upload an event log
                                </Typography>
                                <br/>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <Typography variant="body1" align="left" sx={{fontWeight: 'bold'}}>
                                                    Supported extension:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="body1" align="left">
                                                    CSV
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <Typography variant="body1" align="left" sx={{fontWeight: 'bold'}}>
                                                    Required data:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography variant="body1" align="left">
                                                    Case ID, Activity, Start time, End time, Resource
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
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
                <MappingDialog
                    open={open}
                    onClose={handleClose}
                    selectedValue={selectedValue}
                />
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
            {snackMessage && <CustomizedSnackbar
                message={snackMessage}
                severityLevel={snackColor}
                onSnackbarClose={onSnackbarClose}
            />}
        </>
    );
}

export default Upload;