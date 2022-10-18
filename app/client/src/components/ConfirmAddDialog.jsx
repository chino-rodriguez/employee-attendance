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
            <DialogTitle>
                Confirm add entry
            </DialogTitle>

            {values &&
                <DialogContent>
                    Are you sure you want to add this entry?
                    <p><strong>Date: </strong>{formatDateSlashes(values.date)}</p>
                    <p><strong>Time: </strong> {formatTime(values.timeIn)} to {formatTime(values.timeOut)}</p>
                    <p><strong>Position: </strong>{values.position}</p>
                </DialogContent>
            }



            <DialogActions>
                <Button
                    onClick={() => { props.setOpen(false) }}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    sx={{ backgroundColor: "green" }}
                    onClick={(e) => {
                        props.handleSubmit(e);
                        props.setOpen(false);
                        props.resetValues();
                    }}
                >
                    Add entry
                </Button>
            </DialogActions>
        </Dialog>
    )
}