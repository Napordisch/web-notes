const express = require('express')
path = require('path')
const fs = require("fs");
const app = express()
const port = 3000;

// app.use(express.text());
app.use(express.json());
app.use(express.static("login-page"));
app.use(express.static("note-page"));
app.use(express.static("common-static"));
app.use(express.static("notes-viewer-page"));

// users = JSON.parse(fs.readFileSync('test-users.json', 'utf8'));
// console.log("Users:")
// console.log(users);


UsersDB = {
    users: JSON.parse(fs.readFileSync('test-users.json', 'utf8')),
    AddUser(email, passwordValue) {
        this.users[email] = {"password": passwordValue};
        fs.writeFile("test-users.json", JSON.stringify(this.users, null, 4), err => {
            if (err) {console.error(err);}
        })
        console.log(this.users);
    }
}

NotesDB = {
    notes: JSON.parse(fs.readFileSync('test-notes.json', 'utf8'))
}
console.log(NotesDB);



app.get('/login', (req, res) => {
    res.sendFile("login-page/login.html", {root: __dirname});
})

app.get('/all-notes', (req, res) => {
    res.sendFile("notes-viewer-page/all-notes.html", {root: __dirname});
})

app.get('/note', (req, res) => {
    res.sendFile("note-page/note.html", {root: __dirname});
})

app.get('/', (req, res) => {
    res.redirect(req.baseUrl + '/login');
})

app.post('/login', (req, res) => {
    let users = UsersDB.users;
    console.log(users);
    console.log(req.body);
    let fields = req.body;
    if (fields.email in users && fields.password === users[fields.email].password) {
        res.status(400);
        res.send();
        return;
    }
    let errorMessage = "no-such-user";
    res.status(401).send(errorMessage);
    console.error("no-such-user");
})

app.post("/register", (req, res) => {
    console.log(UsersDB);
    console.log (req.body);
    let fields = req.body;
    if (fields.email in UsersDB.users) {
        let errorMessage = "email-already-exists";
        console.error(errorMessage);
        res.status(409).send(errorMessage);
        return;
    }
    UsersDB.AddUser(fields.email, fields.password);
    res.status(201).send("account-created");
})

app.listen(port, () => {
    console.log(`Web-notes app listening on port ${port}`)
})