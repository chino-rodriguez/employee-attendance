import { useState, useEffect } from 'react';
import {
    Button,
    Paper,
    Stack,
    Alert,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    TablePagination,
}
    from '@mui/material';
import { DoDisturbOnOutlined } from '@mui/icons-material';
import deleteShift from '../hooks/deleteShift';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export default function ShowShifts(props) {
    const [shifts, setShifts] = useState(null);
    const [editing, setEditing] = useState(false);

    const [open, setOpen] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState(null);

    // Hook to control delete operation
    const { values, handleSubmit, error, setError, success, count } = deleteShift({
        initialValues: {
            id: '',
            userId: ''
        }
    });

    const handleOpenDialog = (shift) => {
        values.id = shift.id;
        values.userId = props.userId;
        setShiftToDelete(shift);
        setOpen(true);
    }

    const handleCloseDialog = () => {
        values.id = '';
        values.userId = '';
        setShiftToDelete(null);
        setOpen(false);
    }

    // Fetch current user's shifts from the database
    const fetchShifts = async () => {
        const response = await fetch(`/api/shifts/byUser?id=${props.userId}`);
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
        if (count === 0) setEditing(false);
        fetchShifts();
    }, [props, count])

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

                {shifts && shifts.length > 0 &&
                    <Button
                        onClick={() => {
                            setEditing(!editing);
                        }}
                        variant="outlined"
                    >
                        {editing ? "Back" : "Edit"}
                    </Button>
                }

                {/* Table showing shifts*/}
                {
                    shifts && shifts.length > 0 &&
                    <TableContainer
                        component={Paper}
                        sx={{ maxWidth: "100vw" }}
                    >
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

                                    {/* Filer cell */}
                                    {
                                        editing ?
                                            <TableCell></TableCell>
                                            : null
                                    }
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
                                        {
                                            editing
                                                ? <TableCell>
                                                    <Button
                                                        sx={{ color: "red" }}
                                                        size="small"
                                                        onClick={() => {
                                                            handleOpenDialog(shift);
                                                        }}
                                                    >
                                                        <DoDisturbOnOutlined
                                                            sx={{ fontSize: "18px" }}
                                                        />
                                                    </Button>
                                                </TableCell>
                                                : null
                                        }
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
                {success && showSuccess && <Alert severity="success" onClose={handleCloseSuccess} sx={{ mb: '1rem' }}>{success}</Alert>}
            </Stack>

            <ConfirmDeleteDialog open={open} setOpen={setOpen} shift={shiftToDelete} onClose={handleCloseDialog} handleSubmit={handleSubmit} />
        </>
    )
}