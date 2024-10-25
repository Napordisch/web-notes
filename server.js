const express = require('express')
path = require('path')
const app = express()
const port = 3000

app.use(express.static("login-page"));
app.use(express.static("note-page"));
app.use(express.static("common-static"));

app.get('/', (req, res) => {
  res.sendFile("login-page/login.html", { root: __dirname });
  // res.sendFile("note-page/note.html", { root: __dirname });
})

app.listen(port, () => {
  console.log(`Web-notes app listening on port ${port}`)
})