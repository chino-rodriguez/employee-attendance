import { useState, useEffect } from 'react';
import {
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
import { isBefore, isEqual, isFuture } from 'date-fns';
import addShift from '../hooks/addShift';
import Dropdown from './Dropdown';
import ConfirmAddDialog from './ConfirmAddDialog';

export default function AddShift(props) {

    // Form validation function
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
        } else if (isBefore(timeOut, timeIn) || isEqual(timeOut, timeIn)) {
            setError("Time Out must be later than Time In.");
            return false;
        } else if (isFuture(date)) {
            setError("Cannot add a shift for a future date.");
            return false;
        } else if (positions.indexOf(position) === -1) {
            setError("Invalid position.");
            return false;
        }
        return true;
    }

    // Populate positions state variable (used for Dropdown options)
    const [positions, setPositions] = useState(null);
    useEffect(() => {
        setPositions(props.positions);
    }, [props]);

    // Confirm add dialog
    const [open, setOpen] = useState(false);

    // Add Shift hook
    let { values, setValues, handleChange, handleKeyDown, handleSubmit, error, setError, prevError, setPrevError, success, prevSuccess } = addShift({
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

            {/* Form */}
            <Stack
                spacing={2} sx={{ mb: '1rem' }}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >

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
                    <FormControl fullWidth>
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
                > Add
                </Button>

            </Stack>


            {/* Feedback messages */}
            {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
            {success && showSuccess && <Alert severity="success" onClose={handleCloseSuccess} sx={{ mb: '1rem' }}>{success}</Alert>}
        </Stack>


        {/* Popup that appears when "Add" button is clicked. Prompts the user to confirm the add operation */}
        <ConfirmAddDialog open={open} setOpen={setOpen} values={values} handleSubmit={handleSubmit} resetValues={resetValues} />
    </>

}