const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');
const { isLoggedIn } = require('../utils/middleware');
const { differenceInMinutes } = require('date-fns');
const formatTime = require('../utils/formatTime');
const { formatDateSlashes } = require('../utils/formatDate');

const calcHours = (timeIn, timeOut) => {

    const diff = differenceInMinutes(timeOut, timeIn);
    const hourDifference = Math.floor(diff / 60);
    const minuteDifference = diff % 60;
    let frac = Math.abs(minuteDifference) / 60;

    // Round minutes to closest quarter hour
    if (frac === 0) {
    } else if ((0 < frac) && (frac <= 0.25)) {
        frac = 0.25;
    } else if ((0.25 < frac) && (frac <= 0.5)) {
        frac = 0.5;
    } else if ((0.5 < frac) && (frac <= 0.75)) {
        frac = 0.75;
    } else {
        frac = 1;
    }

    return (hourDifference + frac).toFixed(2);
};

router.post('/add', isLoggedIn, async (req, res, next) => {
    const { date, timeIn, timeOut, position } = req.body;
    const timeInDate = new Date(timeIn);
    const timeOutDate = new Date(timeOut);

    const id = uuid();
    const userId = req.user.id;

    let response = {};

    try {
        let wageQuery = await performQuery(`SELECT wage FROM Wage WHERE position = '${position}'`);
        let wage = wageQuery.rows[0].wage;

        let hours = calcHours(timeInDate, timeOutDate);
        let salary = (hours * wage).toFixed(2);

        const query = `INSERT INTO Entry (id, employeeid, date, timein, timeout, hours, position, salary)
            VALUES ('${id}', '${userId}', '${date}', '${timeIn}', '${timeOut}', ${hours}, '${position}', ${salary})`;
        await performQuery(query);

        const entry = await performQuery(`SELECT * FROM Entry WHERE id = '${id}'`);

        if (entry.rows.length === 1) {
            response.success = `Successfully added entry from ${formatTime(timeInDate)} to ${formatTime(timeOutDate)} on ${formatDateSlashes(timeOutDate)}.`;
        } else return next(new Error('Entry was not added, please try again.'));

        const all = await performQuery(`SELECT * FROM Entry`);
        response.entries = all.rows;
    } catch (err) {
        return next(err);
    }

    res.send(response);

});

router.get('/byUser', async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        throw new Error("Invalid id");
    }

    const verifyUserId = `SELECT * FROM Employee WHERE id = '${id}'`;
    const user = await performQuery(verifyUserId);
    if (user.rows.length !== 1) throw new Error("Invalid user id");

    const query = `SELECT * FROM Entry WHERE employeeId = '${id}' ORDER BY date, timeout`;
    const all = await performQuery(query);

    const entries = [];
    for (let entry of all.rows) {
        const obj = {
            id: entry.id,
            date: formatDateSlashes(entry.date),
            timeIn: formatTime(entry.timein),
            timeOut: formatTime(entry.timeout),
            hours: entry.hours,
            position: entry.position,
            salary: entry.salary
        }
        entries.push(obj);
    }

    res.send({ entries })

})

module.exports = router;