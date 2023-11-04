const express = require("express")

const app = express()
const port = 3123

app.get("/", (req, res) => {
    res.send(`r2 a id = ${process.env.R2_SECRET_ACCESS_KEY}`)
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})