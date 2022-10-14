import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage';
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import { useEffect, useState } from "react";

function App() {
  const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";
  const fetchUserUrl = `${baseUrl}/api/auth/getUser`;

  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const response = await fetch(fetchUserUrl, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    try {
      const json = await response.json();
      setMessage(json.message);
      setUser(json.user);
      setIsFetching(false);
    } catch (e) {
      setMessage(`API call failed: ${e}`);
      setIsFetching(false);
    }
  }

  const debugText = (
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
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={<HomePage user={user} />}
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
        {debugText}
      </div>
    </Router>
  );
}

export default App;
