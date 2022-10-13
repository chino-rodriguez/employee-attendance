const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { v4: uuid } = require('uuid');
const { performQuery } = require('./utils/dbModule');

// ---------- EXPRESS SERVER SETUP ----------
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------- CORS SETUP ----------
const homeUrl = process.env.HOMEPAGE_URL || "http://localhost:3000";
const whitelist = [homeUrl, "http://localhost:3000", "http://localhost:5000"];
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
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
};
app.use(session(sessionConfig));

// ---------- PASSPORT (AUTH) SETUP ----------
require("./utils/passportLocal");
app.use(passport.initialize());
app.use(passport.session());

// ---------- ROUTES AND ERROR HANDLER SETUP  ----------
const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");
const errorController = require("./utils/errorController");
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);
app.use(errorController);

// ---------- START SERVER  ----------

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
});

