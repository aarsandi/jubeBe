require('dotenv').config()
const port = process.env.PORT
const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const morgan = require("morgan");
const toobusy = require('toobusy-js');

const app = express()

// const {
//     StartingCron
// } = require("./cronjob");
// StartingCron();

app.use(cors())
app.use(express.json())
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

app.use(function (req, res, next) {
    if (toobusy()) {
        res.status(503).json({
            message: `Server is busy right now, Please try again later`,
            status: 503
        });
    } else {
        next();
    }
});

app.use('/', routes)

app.use(errorHandler)

// if route doesnt exist
app.use((req, res, next) => {
    res.status(404).json({
        message: `Oops, the url you are looking for does not exist.`,
        status: 404
    })
})

app.listen(port, () => {
    console.log(`Server Listen at : ${port}`)
})
