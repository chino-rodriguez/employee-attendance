import { useState, useEffect } from 'react';
import {
    Stack,
    Typography,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
}
    from '@mui/material';

export default function ShowEntries(props) {
    const [entries, setEntries] = useState(null);
    const [error, setError] = useState(null);

    // Fetch entries by current user from the database
    const fetchEntries = async () => {
        const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/entries/byUser?id=${props.userId}`);
        if (!response.ok) {
            throw new Error(response.message);
        }
        try {
            const json = await response.json();
            setEntries(json.entries);
        } catch (e) {
            setError(e.message);
        }
    }

    // Fetch entries every time props changes
    useEffect(() => {
        fetchEntries();
    }, [props])

    // Setup to display feedback messages
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) setShowError(true);
    }, [error]);

    return (
        <>
            <Stack
                spacing={1}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >

                {/* Heading */}
                <Typography variant="h5">My Entries</Typography>

                {/* Table showing entries TODO limit number of rows, paginate */}
                {
                    entries &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Date
                                </TableCell>
                                <TableCell>
                                    Time In
                                </TableCell>
                                <TableCell>
                                    Time Out
                                </TableCell>
                                <TableCell>
                                    Hours
                                </TableCell>
                                <TableCell>
                                    Position
                                </TableCell>
                                <TableCell>
                                    Salary
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {entries.map((entry) => (
                                <TableRow key={entry.id} >
                                    <TableCell>
                                        {entry.date}
                                    </TableCell>
                                    <TableCell>
                                        {entry.timeIn}
                                    </TableCell>
                                    <TableCell>
                                        {entry.timeOut}
                                    </TableCell>
                                    <TableCell>
                                        {entry.hours}
                                    </TableCell>
                                    <TableCell>
                                        {entry.position}
                                    </TableCell>
                                    <TableCell>
                                        {entry.salary}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                }


                {/* Feedback messages */}
                {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
            </Stack>
        </>
    )
}