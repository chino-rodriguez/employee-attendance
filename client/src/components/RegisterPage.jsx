import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import registerHook from '../hooks/auth';
import {
    Typography,
    Stack,
    FormLabel,
    Button,
    FormControl,
    TextField,
    Alert,
    Tooltip
} from '@mui/material';

export default function RegisterPage() {

    // Hook to control form
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
            <Stack
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: "5%" }}
            >
                {/* Heading */}
                <Typography variant="h4">
                    Register
                </Typography>

                {/* Form */}
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
                    <Tooltip title="Password must be at least 8 characters long." arrow>
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
                    </Tooltip>
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

                {/* Link to Login page */}
                <Typography>Already have an account? <Link to="/login">Login</Link></Typography>

            </Stack>
        </>

    )
}

