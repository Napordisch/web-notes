const express = require('express')
path = require('path')
const app = express()
const port = 3000;

// app.use(express.text());
app.use(express.json());
app.use(express.static("login-page"));
app.use(express.static("note-page"));
app.use(express.static("common-static"));
app.use(express.static("notes-viewer-page"));

users = {a: {
  password:  "s",
    id: "1"
}
}


app.get('/login', (req, res) => {
  res.sendFile("login-page/login.html", { root: __dirname });
})

app.get('/all-notes', (req, res) => {
  res.sendFile("notes-viewer-page/all-notes.html", { root: __dirname });
})

app.get('/note', (req, res) => {
  res.sendFile("note-page/note.html", { root: __dirname });
})

app.get('/', (req, res) => {
  res.redirect(req.baseUrl + '/login');
})

app.post('/login', (req, res) => {
  console.log(req.body)
  let fields = req.body;
  if (fields.email in users && fields.password === users[fields.email].password) {
    res.status(400);
    res.send();
    return;
  }
  res.status(401).json({message: "Login failed"});
  res.send();
})

app.listen(port, () => {
  console.log(`Web-notes app listening on port ${port}`)
})