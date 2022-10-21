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

        const query = `INSERT INTO Shift (id, employeeid, date, timein, timeout, hours, position, salary)
            VALUES ('${id}', '${userId}', '${date}', '${timeIn}', '${timeOut}', ${hours}, '${position}', ${salary})`;
        await performQuery(query);

        const shift = await performQuery(`SELECT * FROM Shift WHERE id = '${id}'`);

        if (shift.rows.length === 1) {
            response.success = `Successfully added shift from ${formatTime(timeInDate)} to ${formatTime(timeOutDate)} on ${formatDateSlashes(timeOutDate)}.`;
        } else return next(new Error('Shift was not added, please try again.'));

        const all = await performQuery(`SELECT * FROM Shift`);
        response.shifts = all.rows;
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

    const query = `SELECT * FROM Shift WHERE employeeId = '${id}' ORDER BY date, timeout`;
    const all = await performQuery(query);

    const shifts = [];
    for (let shift of all.rows) {
        const obj = {
            id: shift.id,
            date: formatDateSlashes(shift.date),
            timeIn: formatTime(shift.timein),
            timeOut: formatTime(shift.timeout),
            hours: shift.hours,
            position: shift.position,
            salary: shift.salary
        }
        shifts.push(obj);
    }

    res.send({ shifts })

});

router.delete('/', isLoggedIn, async (req, res, next) => {
    const { id, userId } = req.body;
    const response = {};

    try {
        const shift = await performQuery(`SELECT * FROM Shift WHERE id = '${id}'`);
        if (shift.rows.length !== 1) return next(new Error('Invalid Shift id.'));
        if (shift.rows[0].employeeid !== userId) return next(new Error('You do not have permission to do that.'));

        await performQuery(`DELETE FROM Shift WHERE id = '${id}'`);

        const count = await performQuery(`SELECT count(id) FROM Shift WHERE employeeid = '${userId}'`);
        response.count = count.rows[0].count;

        const deleted = shift.rows[0];
        response.success = `Successfully deleted shift on ${deleted.date} from ${deleted.timein} to ${deleted.timeout}`
    } catch (err) {
        return next(err);
    }

    res.send(response);
});

module.exports = router;