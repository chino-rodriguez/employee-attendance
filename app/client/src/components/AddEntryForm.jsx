import { useState, useEffect } from 'react';
import {
    Typography,
    Stack,
    FormLabel,
    Button,
    FormControl,
    TextField,
    Alert
} from '@mui/material';
import addEntry from '../hooks/addEntry';

export default function AddEntryForm(props) {

    // Confirm add popup TODO implement
    const [open, setOpen] = useState(false);

    // Add Entry hook
    const { values, setValues, handleChange, handleKeyDown, handleSubmit, error, prevError, success } = addEntry({
        initialValues: {
            date: '',
            timeIn: '',
            timeOut: '',
            position: ''
        }
    });

    const resetFormFields = () => {
        setValues({
            date: '',
            timeIn: '',
            timeOut: '',
            position: ''
        })
    };

    // Setup to display feedback message -- error
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }
    const handleCloseSuccess = () => {
        setShowSuccess(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return <>
        {/* Heading */}
        <h2>
            Add Entry
        </h2>
        {/* Form fields */}
        <Stack spacing={2} sx={{ mb: '1rem' }}>

            {/* Date */}
            <FormControl>
                <FormLabel>Date</FormLabel>
                <TextField
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required >
                </TextField>
            </FormControl>

            {/* Time In */}
            <FormControl>
                <FormLabel>Time In</FormLabel>
                <TextField
                    name="timeIn"
                    value={values.timeIn}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required >
                </TextField>
            </FormControl>

            {/* Time Out */}
            <FormControl>
                <FormLabel>Time Out</FormLabel>
                <TextField
                    name="timeOut"
                    value={values.timeOut}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required>
                </TextField>
            </FormControl>

            {/* Position */}
            <FormControl>
                <FormLabel>Position</FormLabel>
                <TextField
                    name="position"
                    value={values.position}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required>
                </TextField>
            </FormControl>
        </Stack>

        {/* Submit button */}
        <Button
            onClick={(e) => {
                handleSubmit(e);
                resetFormFields();
            }}
            type="submit"
            color="primary"
            variant="contained"
            sx={{ mb: '1rem' }}
        > Add
        </Button>

        {/* TODO  Dialog with confirm button onCLick = handleSubmit */}

        {/* Feedback messages */}
        {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
        {success && showSuccess && <Alert severity="success" onClose={handleCloseSuccess} sx={{ mb: '1rem' }}>{success}</Alert>}
    </>

}