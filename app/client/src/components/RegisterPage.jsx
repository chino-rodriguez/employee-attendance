import { useState, useEffect } from 'react';
import registerHook from '../hooks/auth';
import {
    Typography,
    Stack,
    FormLabel,
    Button,
    FormControl,
    TextField,
    Alert
} from '@mui/material';

export default function RegisterPage() {
    const { values, handleChange, handleSubmit, handleKeyDown, error, prevError } = registerHook({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: ''
        },
        slug: 'api/auth/register'
    });

    // Setup to display feedback message -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error, prevError]);

    return (
        <>
            {/* Heading */}
            <Typography variant="h3" gutterBottom>
                Register
            </Typography>
            {/* Form fields */}
            <Stack spacing={2} sx={{ mb: '1rem' }}>

                {/* First name */}
                <FormControl>
                    <FormLabel>First name</FormLabel>
                    <TextField
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required >
                    </TextField>
                </FormControl>

                {/* Last name */}
                <FormControl>
                    <FormLabel>Last name</FormLabel>
                    <TextField
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required >
                    </TextField>
                </FormControl>

                {/* Username */}
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <TextField
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required >
                    </TextField>
                </FormControl>

                {/* Password */}
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <TextField
                        name="password"
                        type={'password'}
                        value={values.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required>
                    </TextField>
                </FormControl>
            </Stack>

            {/* Submit button */}
            <Button
                onClick={handleSubmit}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mb: '1rem' }}
            > Register
            </Button>

            {/* Feedback message -- error */}
            {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
        </>

    )
}

