import React, {useState} from 'react';
import { Grid, Paper, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import {LoadingButton} from '@mui/lab';
// TODO REPLACE LATER
import axios from "axios";
import paths from "../router/paths";
import Papa from 'papaparse'
import MappingDialog from "./upload/Mapping";

// import config from '../owncloud.json'

// const owncloud = require('owncloud-sdk');
// let oc = new owncloud({
//     baseUrl: config.OWNCLOUDURL,
//     auth: {
//         basic: {
//             username: config.USERNAME,
//             password: config.PASSWORD
//         }
//     }
// });
//
// // Login
// oc.login().then((status: any) => {
//     // STUFF
//     console.log(status)
// }).catch((error: any) => {
//     // HANDLE ERROR
//     console.log(error)
// });
//
// // Share File With Link
// oc.shares.shareFileWithLink('linkToYourFile').then((shareInfo: { getLink: () => string; }) => {
//     console.log("Link is : " + shareInfo.getLink());
// }).catch((error: any) => {
//     console.log(error)
//     // HANDLE ERROR
// });
//
// // List all files
// oc.files.list('https://owncloud.ut.ee/owncloud/index.php/s/DAynoadkJJdDWJE').then((files: any) => {
//     console.log(files);
// }).catch((error: any) => {
//     console.log(error);
// });


const Upload = () => {
    const [loading, setLoading] = useState<boolean>(false);
    let [open, setOpen] = React.useState(false);
    const [selectedLogFile, setSelectedLogFile] = useState<File | null>(null);
    const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

    const handleClose = (cancel:boolean, values: string[]) => {
        if (cancel) {
            setLoading(false);
        } else {
            handleValidRequest(values)
        }
        setOpen(false);

    };

    const formData = new FormData()
    if (selectedLogFile) {
        formData.append('event_log', selectedLogFile)
    }

    const navigate = useNavigate();

    const areFilesPresent = () => {
        const isEventLogProvided = !!selectedLogFile
        return isEventLogProvided;
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

        // console.log(loading)
        //
        // if (!loading) {
        //     return;
        // }


    };

    const handleValidRequest = (values: string[]) => {
        console.log(values)
        var config = {
            method: 'post',
            url: 'http://193.40.11.233/jobs',
            headers: {
                'Content-Type': 'text/csv'
            },
            data : new Blob([selectedLogFile as Blob], {type:"text/csv"})
        };
        axios(
            config
        )
            .then(((res:any) => {
                let job = res.data
                console.log(job)
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
            console.log("Need to handle this: " + error)
            setLoading(false)
        })
    }

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '10px' }} className="centeredContent">
                <Grid item xs={12}>
                    <Grid item>
                        <Typography variant="subtitle1">
                            Upload an event log to start the waiting time analysis. (CSV format)
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={2.5}>
                    <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" align="left">
                                    NOTICE:
                                </Typography>
                                <Typography align={"left"}>
                                    Please format your event_log for now like the following example:
                                    <br/>
                                    <br/>
                                    - Case ID ={'>'} case:concept:name
                                    <br/>
                                    - Activity ={'>'} concept:name
                                    <br/>
                                    - Start Timestamp ={'>'} start_timestamp
                                    <br/>
                                    - End Timestamp ={'>'} time:timestamp
                                    <br/>
                                    - Resource ={'>'} org:resource
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
        </>
    );
}

export default Upload;