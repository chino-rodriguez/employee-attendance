const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

// TODO timein and timeout need to be formatted -- work with Date Picker
router.post('/add', async (req, res, next) => {
    const { date, timeIn, timeOut, position } = req.body;
    console.log(date, timeIn, timeOut, position); // NOTE this is working, data flow OK

    const id = uuid();
    const userId = req.user.id;

    let response = {};

    try {
        let wageQuery = await performQuery(`SELECT wage FROM Wage WHERE position = '${position}'`);
        let wage = wageQuery.rows[0].wage;

        let hours = 1; // timeOut - timeIn TODO calculate
        let salary = hours * wage;

        const query = `INSERT INTO Entry (id, employeeid, date, timein, timeout, hours, position, salary)
            VALUES ('${id}', '${userId}', '${date}', '${timeIn}', '${timeOut}', ${hours}, '${position}', ${salary})`;
        console.log(query);
        //await performQuery(query); // TODO make this work with dates

        const entry = await performQuery(`SELECT * FROM Entry WHERE id = '${id}'`);
        if (entry.rows.length === 1) {
            response.success = `Successfully added entry from ${timeIn} to ${timeOut}`;
        } else return next(new Error('Entry was not added, please try again.'));

        const all = await performQuery(`SELECT * FROM Entry`);
        response.wages = all.rows;
    } catch (err) {
        return next(err);
    }

    res.send(response);

})

module.exports = router;