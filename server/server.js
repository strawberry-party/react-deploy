const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect();
  
app.get('/api/customers', (req, res) => {
  connection.query(
    'SELECT * FROM CUSTOMER WHERE isDeleted = 0',
    (err, rows, fields) => {
      res.send(rows);
    }
  )
});

app.post('/api/customers', (req, res) => {
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ? ,?, ?, now(), 0)';
    let name = req.body.userName;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [name, birthday, gender, job];
    connection.query(sql, params, (err, rows, fields) => {
        res.send(rows);
    });
});

app.delete('/api/customers/:id', (req, res) => {
  let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
  let params = [req.params.id];
  connection.query(sql, params, (err, rows, fields) => {
      res.send(rows);
  })
});

app.delete('/api/customers/real/:id', (req, res) => {
  let sql = 'DELETE FROM CUSTOMER WHERE id = ?';
  let params = [req.params.id];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  })

});

app.listen(port, () => console.log(`Listening on port ${port}`));