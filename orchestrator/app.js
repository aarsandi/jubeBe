const port = 3000
const express = require('express')
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
app.use(errorHandler)

app.use((req, res) => {
    res.status(404).json({
        message: `Oops, the url you are looking for does not exist.`,
        status: 404
    })
})

app.listen(port, () => {
    console.log(`Server Orchestrator Listen at : ${port}`)
})
