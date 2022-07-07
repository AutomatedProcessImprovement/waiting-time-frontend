import { AlertType, DropzoneArea } from "material-ui-dropzone";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        color: "gray"
    }
});

interface CustomDropzoneAreaProps {
    acceptedFiles: string[];
}

const CustomDropzoneArea = (props: CustomDropzoneAreaProps) => {
    const classes = useStyles();
    const { acceptedFiles} = props
    const onAlert = () => {
    };

    const onChange = (files: File[]) => {
        // only one file is allowed
        const file = files[0]
    };

    const onDelete = (_file: File) => {
    };
    return (
        <DropzoneArea
            classes={{
                root: classes.root
            }}
            // Icon={<FileUploadIcon />}
            acceptedFiles={acceptedFiles}
            filesLimit={1}
            showPreviews={true}
            previewText={"Uploaded file:"}
            showPreviewsInDropzone={false}
            showFileNamesInPreview={true}
            showFileNames={true}
            useChipsForPreview={true}
            showAlerts={false}
            clearOnUnmount={true}
            disableRejectionFeedback={true}
            onDelete={onDelete}
            onChange={onChange}
            onAlert={onAlert}
        />
    )
}

export default CustomDropzoneArea;