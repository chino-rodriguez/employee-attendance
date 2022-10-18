const express = require('express');
const router = express.Router();
const { performQuery } = require('../utils/dbModule');
const { v4: uuid } = require('uuid');

router.post('/add', async (req, res, next) => {
    let { position, wage } = req.body;
    position = position.charAt(0).toUpperCase() + position.slice(1);

    const id = uuid();
    let wages = {};

    try {
        const query = `INSERT INTO Wage (id, position, wage) VALUES ('${id}', '${position}', ${wage})`;
        await performQuery(query);

        wages = await performQuery('SELECT * FROM Wage');
    } catch (e) {
        return next(e);
    }
    res.send({ wages: wages.rows });
});

router.get('/all', async (req, res) => {
    const wages = await performQuery('SELECT * FROM Wage');
    console.log(wages.rows);
    let positions = [];
    for (let row of wages.rows) {
        positions.push(row.position);
    }
    res.send({ wages: wages.rows, positions });
});

module.exports = router;