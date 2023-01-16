import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage';
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import { useEffect, useState } from "react";

const basename = document.querySelector('base')?.getAttribute('href') ?? '/';

function App() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null)

  const fetchUser = async () => {
    const response = await fetch('/api/auth/getUser', { credentials: "include" });
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    try {
      const json = await response.json();
      setMessage(json.message);
      setUser(json.user);
      setUserId(json.id);
      setIsFetching(false);
    } catch (e) {
      setMessage(`API call failed: ${e}`);
      setIsFetching(false);
    }
  }

  const apiAndEnvStatus = (
    <div>
      <p>
        {"« "}
        <strong>{isFetching ? "Fetching user " : message}</strong>
        {" »"}
      </p>
      {process.env.NODE_ENV === "production" ? (
        <p>This is a production build.</p>
      ) : (
        <p>You're not on PROD.</p>
      )}
    </div>
  );

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Router basename={basename}>
      <div className="App">

        <h1>Employee Attendance</h1>

        <Routes>
          <Route
            exact
            path="/"
            element={<HomePage user={user} userId={userId} />}
          />

          <Route
            exact
            path="/login"
            element={<LoginPage />}
          />

          <Route
            exact
            path="/register"
            element={<RegisterPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
