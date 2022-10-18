import { useState, useEffect } from 'react';
import {
    Paper,
    Stack,
    Typography,
    Alert,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    TablePagination
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

    // Pagination config
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, value) => {
        setPage(value);
    }

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

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
                    <TableContainer component={Paper}>
                        <Table stickyHeader>

                            {/* Heading */}
                            <TableHead >
                                <TableRow >
                                    <TableCell sx={{ fontWeight: "700" }}>
                                        Date
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>
                                        Time In
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>
                                        Time Out
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>
                                        Hours
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>
                                        Position
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "700" }}>
                                        Salary
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            {/* Body including entries */}
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? entries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : entries
                                ).map((entry) => (
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

                            {/* Footer with pagination options */}
                            <TableFooter>
                                <TableRow>
                                    {/* <TableCell colspan={2}></TableCell> */}
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        colSpan={6}
                                        count={entries.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleRowsPerPageChange}
                                    />
                                </TableRow>
                            </TableFooter>

                        </Table>
                    </TableContainer>
                }


                {/* Feedback messages */}
                {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
            </Stack>
        </>
    )
}