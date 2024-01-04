const express = require('express')
var cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
const connectToMongo = require('./db');
connectToMongo();

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/tasks', require('./routes/tasks'));

app.listen(port, () => {
    console.log(`TMS listening on port ${port}`)
})