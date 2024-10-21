const express = require('express')
const app = express()
const port = 3000

app.use(express.static("login-page"));

app.get('/', (req, res) => {
  res.sendFile("login.html");
})

app.listen(port, () => {
  console.log(`Web-notes app listening on port ${port}`)
})