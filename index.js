const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// غير البيانات دي ببياناتك من freesqldatabase.com
const db = mysql.createConnection({
    host: 'sql11.freesqldatabase.com',
    user: 'Ahmed Technology',
    password: 'Ahmed@2022',
    database: 'sql1177xxxx',
    port: 3306
});

app.get('/games', (req, res) => {
    db.query('SELECT * FROM games', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/add-game', (req, res) => {
    const { name, category, quantity, price } = req.body;
    const sql = 'INSERT INTO games (name, category, quantity, price) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, category, quantity, price], (err) => {
        if (err) throw err;
        res.send('تمت الإضافة');
    });
});

app.delete('/delete/:id', (req, res) => {
    db.query('DELETE FROM games WHERE id=?', [req.params.id], (err) => {
        if (err) throw err;
        res.send('تم الحذف');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});