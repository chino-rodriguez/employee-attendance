import { useState, useEffect } from 'react';
import {
    Button,
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

export default function ShowShifts(props) {
    const [shifts, setShifts] = useState(null);
    const [error, setError] = useState(null);

    // Fetch entries by current user from the database
    const fetchShifts = async () => {
        const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/shifts/byUser?id=${props.userId}`);
        if (!response.ok) {
            throw new Error(response.message);
        }
        try {
            const json = await response.json();
            setShifts(json.shifts);
        } catch (e) {
            setError(e.message);
        }
    }

    // Fetch shifts every time props changes
    useEffect(() => {
        fetchShifts();
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
                {/* <Typography variant="h5">My Shifts</Typography> */}

                {/* Table showing entries*/}
                {
                    shifts && shifts.length > 0 &&
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

                            {/* Body including shifts */}
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? shifts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : shifts
                                ).map((shift) => (
                                    <TableRow key={shift.id} >
                                        <TableCell>
                                            {shift.date}
                                        </TableCell>
                                        <TableCell>
                                            {shift.timeIn}
                                        </TableCell>
                                        <TableCell>
                                            {shift.timeOut}
                                        </TableCell>
                                        <TableCell>
                                            {shift.hours}
                                        </TableCell>
                                        <TableCell>
                                            {shift.position}
                                        </TableCell>
                                        <TableCell>
                                            {shift.salary}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                            {/* Footer with pagination options */}
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        colSpan={6}
                                        count={shifts.length}
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

                {
                    shifts && shifts.length === 0 &&
                    <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
                        <span>You have not logged any shifts. </span>
                        <Button
                            onClick={() => {
                                props.setShowShifts(false);
                            }}
                            size="small"
                        >Add a shift</Button>
                    </Stack>
                }


                {/* Feedback messages */}
                {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ mb: '1rem' }}>{error}</Alert>}
            </Stack>
        </>
    )
}