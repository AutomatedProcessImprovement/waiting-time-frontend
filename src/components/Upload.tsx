import React, {useState} from 'react';
import {AlertColor, Grid, Paper, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import {LoadingButton} from '@mui/lab';
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


    const handleClose = (cancel:boolean, values: object) => {
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
        setInfoMessage("")
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

    const handleValidRequest = (values: any) => {
        let map_string = `case=${values.case}&activity=${values.activity}&resource=${values.resource}&start_timestamp=${values.start_timestamp}&end_timestamp=${values.end_timestamp}`
        try {
            const config = {
                method: 'post',
                url: 'http://193.40.11.233/jobs?' + map_string,
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
                    console.log(job.id)
                    let counter = 0
                    let f = setInterval(() => {
                        axios.get(
                            'http://193.40.11.233/jobs/' + job.id,
                        ).then((r:any)  => {
                            let j = r.data
                            console.log(j.status)
                            if (j.status === 'completed') {
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
                            if (j.status === 'duplicate') {
                                clearInterval(f);
                                if (r.data.error) {
                                    setErrorMessage(r.data.error.split(';')[0]);
                                    setLoading(false);
                                } else {
                                    let logN = selectedLogFile?.name
                                    navigate(paths.DASHBOARD_PATH, {
                                        state: {
                                            jsonLog: j.result,
                                            report: j,
                                            logName: logN
                                        }
                                    })

                                }
                                setLoading(false)
                            }
                            if (j.status === 'failed' || j.status === 'error') {
                                setErrorMessage(r.data.error.split(';')[0]);
                                setLoading(false);
                            }

                            if (j.status === 'running' || j.status === 'pending') {
                                console.log(counter)
                                counter++
                                if (counter === 4) {
                                    setInfoMessage("Analysis still in progress...");
                                    counter = 0
                                }
                            }
                        })
                    }, 30000)
                })).catch((error: any) => {

                setErrorMessage(error)
                setLoading(false)
            })
        } catch (error: any) {
            setErrorMessage(error)
            setLoading(false)
        }

    }

    return (
        <>
            <br/>
            <br/>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '10px' }} className="centeredContent">
                {/*<Grid item xs={2.5}>*/}
                {/*    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>*/}
                {/*        <Grid container spacing={2}>*/}
                {/*            <Grid item xs={12}>*/}
                {/*                <Typography variant="h6" align="left" sx={{color: 'red', fontWeight: 'medium'}}>*/}
                {/*                    NOTICE:*/}
                {/*                </Typography>*/}
                {/*                <Typography align={"left"} sx={{color: 'red'}}>*/}
                {/*                    Please format your event_log for now like the following example:*/}
                {/*                </Typography>*/}
                {/*                <ul className={'noticeList'}>*/}
                {/*                    <li><Typography align={"left"} sx={{color: 'red', fontWeight: 'bold'}}>*/}
                {/*                        Case ID → case:concept:name*/}
                {/*                    </Typography></li>*/}
                {/*                    <li><Typography align={"left"} sx={{color: 'red', fontWeight: 'bold'}}>*/}
                {/*                        Activity → concept:name*/}
                {/*                    </Typography></li>*/}
                {/*                    <li><Typography align={"left"} sx={{color: 'red', fontWeight: 'bold'}}>*/}
                {/*                        Start Timestamp → start_timestamp*/}
                {/*                    </Typography></li>*/}
                {/*                    <li><Typography align={"left"} sx={{color: 'red', fontWeight: 'bold'}}>*/}
                {/*                        End Timestamp → time:timestamp*/}
                {/*                    </Typography></li>*/}
                {/*                    <li><Typography align={"left"} sx={{color: 'red', fontWeight: 'bold'}}>*/}
                {/*                        Resource → org:resource*/}
                {/*                    </Typography></li>*/}
                {/*                </ul>*/}
                {/*            </Grid>*/}
                {/*            <Grid item xs={12}>*/}
                {/*            </Grid>*/}
                {/*        </Grid>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
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