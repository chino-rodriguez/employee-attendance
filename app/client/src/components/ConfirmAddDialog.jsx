import { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { formatDateSlashes } from '../helpers/formatDate';
import formatTime from '../helpers/formatTime';

export default function ConfirmAddDialog(props) {

    const [values, setValues] = useState(props.values);
    useEffect(() => {
        setValues(props.values);
    }, [props]);

    return (
        <Dialog open={props.open}>

            {/* Title */}
            <DialogTitle>
                Confirm add shift
            </DialogTitle>

            {/* Confirm message */}
            {values &&
                <DialogContent>
                    Are you sure you want to add this shift?
                    <p><strong>Date: </strong>{formatDateSlashes(values.date)}</p>
                    <p><strong>Time: </strong> {formatTime(values.timeIn)} to {formatTime(values.timeOut)}</p>
                    <p><strong>Position: </strong>{values.position}</p>
                </DialogContent>
            }

            {/* Two buttons: Back and Add Shift */}
            <DialogActions>

                {/* Back button */}
                <Button
                    onClick={() => { props.setOpen(false) }}
                >
                    Back
                </Button>

                {/* Confirm button */}
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "green" }}
                    onClick={(e) => {
                        props.handleSubmit(e);
                        props.setOpen(false);
                        props.resetValues();
                    }}
                >
                    Add shift
                </Button>
            </DialogActions>
        </Dialog>
    )
}