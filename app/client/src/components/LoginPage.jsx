import { useState, useEffect } from 'react';
import loginHook from '../hooks/auth';
import {
    Typography,
    Stack,
    FormLabel,
    Button,
    FormControl,
    TextField,
    Alert
} from '@mui/material';

export default function LoginPage() {
    const { values, handleChange, handleSubmit, handleKeyDown, error, prevError } = loginHook({
        initialValues: {
            username: '',
            password: ''
        },
        slug: 'api/auth/login'
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
                Login
            </Typography>
            {/* Form fields */}
            <Stack spacing={2} sx={{ mb: '1rem' }}>

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
            > Login
            </Button>

            {/* Feedback message -- error */}
            {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}

        </>

    )
}