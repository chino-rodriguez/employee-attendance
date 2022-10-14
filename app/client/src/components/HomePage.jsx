import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import AddEntryForm from './AddEntryForm';
import LoginPage from './LoginPage';

function HomePage(props) {
    console.log(props);
    const [user, setUser] = useState(props.user);

    const handleLogout = async (e) => {
        e.preventDefault();
        const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/auth/logout`, { credentials: "include" });
        if (res.ok) {
            window.location = '/';
        }
    }

    useEffect(() => {
        setUser(props.user);
    }, [props]);

    if (user) {
        return (
            <>
                <h1>Home page</h1>

                <Button
                    onClick={handleLogout}
                    variant="contained">
                    Logout
                </Button>

                <AddEntryForm user={user} />

            </>
        )
    } else {
        return (
            <LoginPage />
        )
    }
}

export default HomePage;