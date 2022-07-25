import {useState } from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import {LoadingButton} from '@mui/lab';
// TODO REPLACE LATER
import axios from "axios";
import paths from "../router/paths";
import data from '../demo_data/batching_output_example.json'
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
        let analysisJson = {
            // TODO REPLACE WITH SELECTEDLOGFILE
            event_log: selectedLogFile,
            callback_endpoint: "http://example.com/callback"
        }
        console.log(analysisJson.event_log)
        axios.post(
            'http://193.40.11.233/jobs',
            selectedLogFile as Blob,
            {
                headers: {'Content-Type': 'text/csv', "Access-Control-Allow-Origin": "*"}
            }
        )
            .then(((res:any) => {
                console.log(res.data)
                let job = res.data
                let f = setInterval(() => {
                    axios.get(
                        'http://193.40.11.233/jobs/949dc6ee-09d1-11ed-95fe-0242c0a85002',
                        //TODO REPLACE WITH THIS ONCE WORKING 'http://193.40.11.233/jobs/' + job.id,
                    ).then((r:any)  => {
                        let j = r.data
                        if (j.status === 'completed') {
                            console.log('ok')
                            clearInterval(f)
                            const result = j.result
                            navigate(paths.DASHBOARD_PATH, {
                                state: {
                                    jsonLog: result
                                }
                            })
                            setLoading(false)
                        }
                    })
                }, 60000)
                // const jsonString = JSON.stringify(res.data)
                // const blob = new Blob([jsonString], {type: "application/json"});
                // const analysedEventLog = new File([blob], "name", { type: "application/json" })
                //
            })).catch((error: any) => {
            console.log("Need to handle this: " + error)
            setLoading(false)
        })
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