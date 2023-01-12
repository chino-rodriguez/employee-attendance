const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/register', async (req, res, next) => {
    const { firstName, lastName, username, password } = req.body;

    if (username === '') return next(new Error('Username cannot be empty'));
    if (password === '') return next(new Error('Password cannot be empty'));

    // Password requirements: at least 8 characters
    if (password.length < 8) return next(new Error('Password is not long enough'));

    try {
        const salt = await bcrypt.genSalt(9);
        const hash = await bcrypt.hash(password, salt);
        const id = uuid();

        const query = `INSERT INTO Employee(id, firstname, lastname, username, password) VALUES ('${id}', '${firstName}', '${lastName}', '${username}', '${hash}')`;
        await performQuery(query);

        const allUsers = await performQuery('SELECT id, firstname, lastname, username FROM Employee')
        const last = allUsers.rows[allUsers.rows.length - 1];

        // LOGIN NEWLY REGISTERED USER
        req.login(last, (err, user) => {
            if (err) return next(err);
            let response = { redirect: "/", user: last };
            return res.json(response);
        })

    } catch (err) {
        return next(err);
    }
})

router.post('/login', passport.authenticate('local', { successRedirect: '/api/auth/login-success', failWithError: true }), (err, req, res, next) => {
    if (err) {
        let msg = err.message;
        let status = err.status || 401;
        if (err.message === "Bad Request" && err.name === "AuthenticationError") msg = 'Invalid credentials. Please try again.';
        return res.status(status).send({ message: msg, err }); // Error is sent to client
    }
    return res.json({ redirect: '/' });
})

router.get('/logout', (req, res) => {
    if (req.user) {
        const username = req.user.username;
        req.logout((err, next) => {
            if (err) return next(err);
        });
        return res.send({ message: `Logged out user ${username}` });
    }
    return res.send({ redirect: '/login' });
})

// Redirect user to home page on login success.
router.get('/login-success', (req, res) => {
    res.json({
        redirect: '/',
        user: {
            id: req.user.id,
            firstName: req.user.firstname,
            lastName: req.user.lastname,
            username: req.user.username
        }
    });
})

router.get('/getUser', (req, res) => {
    const data = {
        message: "No user logged in",
        user: null
    }
    if (req.user) {
        data.message = `Logged in user is ${req.user.username}`;
        data.user = req.user.username;
        data.id = req.user.id;
    }
    return res.json(data);
});

module.exports = router;