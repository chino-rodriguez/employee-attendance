const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { performQuery } = require('./dbModule');

const verifyPassword = async (password, hash) => {
    let result = false;
    try {
        const res = await bcrypt.compare(password, hash);
        result = res;
    } catch (e) {
    }
    return result;
}

const verifyCallback = async (username, password, done) => {

    try {
        const query = `SELECT * FROM Employee WHERE username = '${username}'`;
        const res = await performQuery(query);
        const user = res.rows[0];

        // Invalid username error handling
        if (!user) {
            return done({ message: 'That user does not exist.' }, false);
        }

        const hash = user.password;

        const isValid = await verifyPassword(password, hash);
        if (isValid) {
            return done(null, user);
        } else {
            // Invalid password error handling
            return done({ message: 'Invalid credentials. Please try again.' }, false);
        }

    } catch (e) {
        return done(e);
    }
}

const strategy = new LocalStrategy({ passReqToCallback: false }, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (userId, done) => {
    const query = `SELECT * FROM Employee WHERE id = '${userId}'`;
    try {
        const res = await performQuery(query);
        done(null, res.rows[0]);
    } catch (e) {
        done(e);
    }
})