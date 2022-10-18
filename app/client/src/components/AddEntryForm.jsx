import { useState, useEffect } from 'react';
import {
    Typography,
    Stack,
    Button,
    FormControl,
    TextField,
    Alert
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { isBefore, isFuture } from 'date-fns';
import addEntry from '../hooks/addEntry';
import Dropdown from './Dropdown';
import ConfirmAddDialog from './ConfirmAddDialog';

export default function AddEntryForm(props) {

    const validateInputs = (values, positions) => {
        const { date, timeIn, timeOut, position } = values;

        if (!date || !timeIn || !timeOut || position === ''
            || isBefore(timeOut, timeIn)
            || isFuture(date)
            || positions.indexOf(position) === -1
        ) {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
        }

        if (!date || !timeIn || !timeOut || position === '') {
            setError("Please fill out empty fields.");
            return false;
        } else if (isBefore(timeOut, timeIn)) {
            setError("Time Out must be later than Time In.");
            return false;
        } else if (isFuture(date)) {
            setError("Cannot add an entry for a future date.");
            return false;
        } else if (positions.indexOf(position) === -1) {
            setError("Invalid position.");
            return false;
        }
        return true;
    }

    const [positions, setPositions] = useState(null);
    useEffect(() => {
        setPositions(props.positions);
    }, [props]);

    // Confirm add dialog
    const [open, setOpen] = useState(false);

    // Add Entry hook
    let { values, setValues, handleChange, handleKeyDown, handleSubmit, error, setError, prevError, setPrevError, success, prevSuccess } = addEntry({
        initialValues: {
            date: null,
            timeIn: null,
            timeOut: null,
            position: ''
        }
    });

    const resetValues = () => {
        setValues({
            date: null,
            timeIn: null,
            timeOut: null,
            position: ''
        })
    };

    // Setup to display feedback messages
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }
    const handleCloseSuccess = () => {
        setShowSuccess(false);
    }

    useEffect(() => {
        if (success) setShowSuccess(true);
    }, [success, prevSuccess]);

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return <>
        <Stack
            spacing={1}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >

            {/* Heading */}
            <Typography variant="h5">Add Entry</Typography>

            {/* Form */}
            <Stack spacing={2} sx={{ mb: '1rem' }}>

                {/* Date and time pickers */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                    {/* Date */}
                    <FormControl>
                        <DatePicker
                            id="date"
                            views={["day"]}
                            label="Date"
                            value={values.date}
                            onChange={(newValue) => {
                                let event = {
                                    target: {
                                        value: newValue,
                                        name: "date",
                                    },
                                };
                                handleChange(event);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} />
                            )}
                            onKeyDown={handleKeyDown}
                            required
                        />
                    </FormControl>

                    {/* Time In */}
                    <FormControl>
                        <TimePicker
                            label="Time In"
                            value={values.timeIn}
                            onChange={(newValue) => {
                                let event = {
                                    target: {
                                        value: newValue,
                                        name: "timeIn"
                                    },
                                };
                                handleChange(event);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </FormControl>

                    {/* Time Out */}
                    <FormControl>
                        <TimePicker
                            label="Time Out"
                            value={values.timeOut}
                            onChange={(newValue) => {
                                let event = {
                                    target: {
                                        value: newValue,
                                        name: "timeOut"
                                    },
                                };
                                handleChange(event);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </FormControl>

                </LocalizationProvider>

                {/* Position */}
                {
                    positions &&
                    <FormControl>
                        <Dropdown
                            name="position"
                            value={values.position}
                            label="Position"
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            options={positions}
                            required>
                        </Dropdown>
                    </FormControl>
                }

            </Stack>

            {/* Submit button */}
            <Button
                onClick={() => {
                    if (validateInputs(values, positions)) {
                        setOpen(true);
                        handleCloseError();
                    }
                    handleCloseSuccess();
                }}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mb: '1rem' }}
            > Add
            </Button>

            <ConfirmAddDialog open={open} setOpen={setOpen} values={values} handleSubmit={handleSubmit} resetValues={resetValues} />

            {/* Feedback messages */}
            {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
            {success && showSuccess && <Alert severity="success" onClose={handleCloseSuccess} sx={{ mb: '1rem' }}>{success}</Alert>}
        </Stack>
    </>

}