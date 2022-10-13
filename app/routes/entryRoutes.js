const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

router.post('/add', async (req, res) => {
    const { date, timein, timeout, position } = req.body;
    const id = uuid();
    const userId = req.user.id;

    let wageQuery = await performQuery(`SELECT wage FROM Wage WHERE position = '${position}'`);
    let wage = wageQuery.rows[0].wage;

    let hours = 0; // timeout - timein
    let salary = hours * wage;

    const query = `INSERT INTO Entry (id, employeeid, date, timein, timeout, hours, position, salary)
        VALUES ('${id}', '${userId}', '${date}', '${timein}', '${timeout}', ${hours}, '${position}', ${salary})`;
    //await performQuery(query);

    res.send("Check console");

})

module.exports = router;