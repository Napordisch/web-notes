const express = require('express')
path = require('path')
const app = express()
const port = 3000

app.use(express.static("login-page"));

app.get('/', (req, res) => {
  res.sendFile("login-page/login.html", { root: __dirname });
})

app.listen(port, () => {
  console.log(`Web-notes app listening on port ${port}`)
})