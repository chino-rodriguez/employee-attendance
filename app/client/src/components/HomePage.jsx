import { useState, useEffect } from 'react';
import { Button, Stack, ButtonGroup } from '@mui/material';
import AddEntryForm from './AddEntryForm';
import ShowEntries from './ShowEntries';
import LoginPage from './LoginPage';

function HomePage(props) {
    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [positions, setPositions] = useState(null);
    const [showEntries, setShowEntries] = useState(false);

    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
    }, [props]);

    // Logout function that sends a logout API request
    const handleLogout = async (e) => {
        e.preventDefault();
        const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/auth/logout`, { credentials: "include" });
        if (res.ok) {
            window.location = '/';
        }
    }

    // Fetch positions
    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    const fetchPositions = async () => {
        const response = await fetch(`${baseUrl}/api/wages/all`, { credentials: "include" });
        if (!response.ok) {
            throw new Error(`status ${response.status}`);
        }
        try {
            const json = await response.json();
            setPositions(json.positions);
        } catch (e) {
            console.log(`API call failed: ${e}`);
        }
    }

    useEffect(() => {
        fetchPositions();
    }, []);

    if (user) {
        return (
            <>
                <Stack spacing={2} direction="column" justifyContent="center" alignItems="center">


                    {/* TODO Fix the way this stack is organized; ideally push Logout button to the right while heading is centered */}
                    <Stack spacing={3} direction="row" justifyContent="center" alignItems="center">

                        {/* Page heading */}
                        <h1>Employee Attendance</h1>

                        {/* Logout button */}
                        <Button
                            onClick={handleLogout}
                            size="small"
                            variant="outlined"
                        >
                            Logout | {user}
                        </Button>

                    </Stack>

                    {/* Button group to toggle between Add / Show */}
                    <ButtonGroup aria-label="primary button group">
                        <Button
                            onClick={() => {
                                setShowEntries(false);
                            }}
                            variant={showEntries ? "outlined" : "contained"}
                        >
                            Add Entry
                        </Button>

                        <Button
                            onClick={() => {
                                setShowEntries(true);
                            }}
                            variant={showEntries ? "contained" : "outlined"}
                        >
                            My Entries</Button>
                    </ButtonGroup>

                    {/* Main content: AddEntry or ShowEntries, depending on state variable */}
                    {showEntries ? <ShowEntries user={user} userId={userId} /> : <AddEntryForm user={user} positions={positions} />}

                </Stack>
            </>
        )
    } else {
        return (
            <LoginPage />
        )
    }
}

export default HomePage;