const express = require('express')
path = require('path')
const fs = require("fs");
const {set} = require("express/lib/application");
const app = express()
const port = 3000;

// app.use(express.text());
app.use(express.json());
app.use(express.static("login-page"));
app.use(express.static("note-page"));
app.use(express.static("common-static"));
app.use(express.static("notes-viewer-page"));

UsersDB = {
    users: JSON.parse(fs.readFileSync('test-users.json', 'utf8')),
    WriteToFile() {
        fs.writeFile("test-users.json", JSON.stringify(this.users, null, 4), err => {
            if (err) console.error(err);
        })
    }
}

NotesDB = {
    notes: JSON.parse(fs.readFileSync('test-notes.json', 'utf8')),
    WriteToFile() {
        fs.writeFile("test-notes.json", JSON.stringify(this.notes, null, 4), err => {
            if (err) {console.error(err);}
        })
    }
}

UsersDB.AddUser = (email, passwordValue) => {
    UsersDB.users[email] = {"password": passwordValue};
    NotesDB.notes[email] = {};
    console.log(UsersDB);
    console.log(NotesDB);
    UsersDB.WriteToFile();
    NotesDB.WriteToFile();
}

NotesDB.AddNote = (email) => {
    if (!(email in NotesDB.notes)) {
        console.error("no-such-user");
        return;
    }
    let noteID = crypto.randomUUID();
    console.log(noteID);
    NotesDB.notes[email][noteID] = {
        content: "",
        creationTime: new Date(),
        lastEditTime: new Date(),
        tags: []
    };
    console.log(NotesDB.notes);
    NotesDB.WriteToFile();
}

app.get('/login', (req, res) => {
    res.sendFile("login-page/login.html", {root: __dirname});
})

app.get('/notes', (req, res) => {
    res.sendFile("notes-viewer-page/all-notes.html", {root: __dirname});
})

app.put('/edit', (req, res) => {
    let credentials = req.body;
    console.log(credentials);
    if (NotesDB.notes[credentials.email][credentials.noteID] === undefined) {
        res.status(404).send("no-note-with-such-id");
        return;
    }
    let notes = NotesDB.notes[credentials.email];
    let noteID = credentials.noteID;
    let sentNote = notes[noteID]
    sentNote.id = noteID;
    console.log(sentNote);
    res.send(JSON.stringify(sentNote));
})

app.post('/save-note')

app.get('/edit', (req, res) => {
    res.sendFile("note-page/note.html", {root: __dirname});
})

app.get('/', (req, res) => {
    res.redirect(req.baseUrl + '/login');
})

app.post('/login', (req, res) => {
    console.log(req.body);
    let fields = req.body;
    if (fields.email in UsersDB.users && fields.password === UsersDB.users[fields.email].password) {
        res.status(200);
        res.send();
        return;
    }
    let errorMessage = "no-such-user";
    res.status(401).send(errorMessage);
    console.error("no-such-user");
})

app.post('/get-all-notes', (req, res) => {
    let credentials = req.body;
    if (!(credentials.email in UsersDB.users) && credentials.password !== UsersDB.users[credentials.email].password) {
        let errorMessage = "no-such-user";
        res.status(401).send(errorMessage);
        console.error(errorMessage);
        return;
    }
    let notes = [];
    for (let note in NotesDB.notes[credentials.email]) {
        let appended_note = NotesDB.notes[credentials.email][note]
        appended_note.id = note;
        notes.push(appended_note);
    }
    notes.sort((a, b) => new Date(b.lastEditTime) - new Date(a.lastEditTime));
    console.log("Login")
    console.log(JSON.stringify(notes, null, 4))
    res.status(200).send(JSON.stringify(notes));
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

NotesDB.AddNote("f");
NotesDB.AddNote("e");
