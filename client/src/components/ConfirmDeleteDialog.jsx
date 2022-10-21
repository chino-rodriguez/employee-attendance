import { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

export default function ConfirmDeleteDialog(props) {

    const [shift, setShift] = useState(props.shift);
    useEffect(() => {
        setShift(props.shift);
    }, [props]);

    return (
        <Dialog open={props.open}>

            {/* Title */}
            <DialogTitle>
                Confirm delete shift
            </DialogTitle>

            {/* Confirm message */}
            {shift &&
                <DialogContent>
                    Are you sure you want to delete this shift?
                    <p><strong>Date: </strong>{shift.date}</p>
                    <p><strong>Time: </strong> {shift.timeIn} to {shift.timeOut}</p>
                    <p><strong>Position: </strong>{shift.position}</p>
                </DialogContent>
            }

            {/* Two buttons: Back and Delete Shift */}
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
                    sx={{ backgroundColor: "red" }}
                    onClick={(e) => {
                        props.handleSubmit(e);
                        props.onClose();
                    }}
                >
                    Delete shift
                </Button>
            </DialogActions>
        </Dialog>
    )
}