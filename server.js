const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const path = require('path');

// ---------- EXPRESS SERVER SETUP ----------
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------- CORS SETUP ----------
const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
const whitelist = [homeUrl, process.env.REACT_APP_HOME_URL_SECURE, "http://localhost:3000", "http://localhost:5000"];
const corsConfig = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsConfig));

// ---------- SESSION SETUP ----------
const secret = process.env.SECRET || "aBadSecret";
const sessionConfig = {
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
};

if (process.env.NODE_ENV === "production") {
    const { pool } = require('./utils/dbModule')
    const store = new pgSession({
        pool,
        createTableIfMissing: true,
        pruneSessionInterval: false
    });
    app.set('trust proxy', 1); // trust first proxy
    sessionConfig.cookie.secure = true; // serve secure cookies
    sessionConfig.store = store; // use Postgres for Session storage
}
app.use(session(sessionConfig));

// ---------- PASSPORT (AUTH) SETUP ----------
require("./utils/passportLocal");
app.use(passport.initialize());
app.use(passport.session());

// ---------- ROUTES AND ERROR HANDLER SETUP  ----------
const authRoutes = require("./routes/authRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const wageRoutes = require("./routes/wageRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/wages", wageRoutes);

const errorController = require("./utils/errorController");
app.use(errorController);

// ---------- SERVE BUILD FOLDER TO DISPLAY UI ON PROD  ----------
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
}

// ---------- CATCH-ALL ROUTE TO ALWAYS DISPLAY index.html  ----------
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// ---------- START SERVER  ----------
const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
    //console.log(`Listening on port ${port}`);
});

