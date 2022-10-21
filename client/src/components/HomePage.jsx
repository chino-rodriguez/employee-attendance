import { useState, useEffect } from 'react';
import { Button, Stack, ButtonGroup } from '@mui/material';
import AddShift from './AddShift';
import ShowShifts from './ShowShifts';
import LoginPage from './LoginPage';

function HomePage(props) {
    const [user, setUser] = useState(props.user);
    const [userId, setUserId] = useState(props.userId);
    const [positions, setPositions] = useState(null);
    const [showShifts, setShowShifts] = useState(false);

    useEffect(() => {
        setUser(props.user);
        setUserId(props.userId);
    }, [props]);

    // Logout function that sends a logout API request
    const handleLogout = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/logout', { credentials: "include" });
        if (res.ok) {
            window.location = '/';
        }
    }

    // Fetch positions
    const fetchPositions = async () => {
        const response = await fetch('/api/wages/all', { credentials: "include" });
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

                    {/* Logout button */}
                    <Button
                        onClick={handleLogout}
                        size="small"
                        variant="outlined"
                    >
                        Logout | {user}
                    </Button>

                    {/* Button group to toggle between Add / Show */}
                    <ButtonGroup aria-label="primary button group">
                        <Button
                            onClick={() => {
                                setShowShifts(false);
                            }}
                            variant={showShifts ? "outlined" : "contained"}
                        >
                            Add Shift
                        </Button>

                        <Button
                            onClick={() => {
                                setShowShifts(true);
                            }}
                            variant={showShifts ? "contained" : "outlined"}
                        >
                            My shifts</Button>
                    </ButtonGroup>

                    {/* Main content: AddShift or ShowShifts, depending on state variable */}
                    {showShifts ? <ShowShifts user={user} userId={userId} setShowShifts={setShowShifts} /> : <AddShift user={user} positions={positions} />}

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