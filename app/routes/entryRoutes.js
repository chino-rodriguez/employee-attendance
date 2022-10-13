const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

// TODO timein and timeout need to be formatted -- work with Date Picker
router.post('/add', async (req, res) => {
    const { date, timein, timeout, position } = req.body;
    const id = uuid();
    const userId = req.user.id;

    try {
        let wageQuery = await performQuery(`SELECT wage FROM Wage WHERE position = '${position}'`);
        let wage = wageQuery.rows[0].wage;

        let hours = 1; // timeout - timein
        let salary = hours * wage;

        const query = `INSERT INTO Entry (id, employeeid, date, timein, timeout, hours, position, salary)
            VALUES ('${id}', '${userId}', '${date}', '${timein}', '${timeout}', ${hours}, '${position}', ${salary})`;
        console.log(query);
        //await performQuery(query);

        const all = await performQuery('SELECT * FROM Entry');
        console.log(all.rows);
    } catch (err) {
        return next(err);
    }

    res.send("Check console");

})

module.exports = router;