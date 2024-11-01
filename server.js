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
    UsersDB.WriteToFile();
    NotesDB.WriteToFile();
}

NotesDB.AddNote = (email) => {
    if (!(email in NotesDB.notes)) {
        console.error("no-such-user");
        return;
    }
    let noteID = crypto.randomUUID();
    NotesDB.notes[email][noteID] = {
        content: "",
        creationTime: new Date(),
        lastEditTime: new Date(),
        tags: []
    };
    NotesDB.WriteToFile();
    return noteID;
}

NotesDB.EditNote = (email, updatedNote) => {

    let noteID = updatedNote.id;
    if (!(email in NotesDB.notes)) {
        console.error("no-such-user");
        return "no-such-user";
    }
    if (NotesDB.notes[email][noteID] === undefined) {
        console.error("no-note-with-such-id");
        return "no-note-with-such-id";
    }
    NotesDB.notes[email][noteID].content = updatedNote.content;
    NotesDB.notes[email][noteID].tags = updatedNote.tags;
    NotesDB.notes[email][noteID].lastEditTime = updatedNote.lastEditTime;
    NotesDB.WriteToFile();
    return 0;
}

NotesDB.DeleteNote = (email, NoteID) => {
   delete(NotesDB.notes[email][NoteID]);
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
    if (NotesDB.notes[credentials.email][credentials.noteID] === undefined) {
        res.status(404).send("no-note-with-such-id");
        return;
    }
    let notes = NotesDB.notes[credentials.email];
    let noteID = credentials.noteID;
    let sentNote = JSON.parse(JSON.stringify(notes[noteID]));
    sentNote.id = noteID;
    res.status(200).send(JSON.stringify(sentNote));
})

app.post('/save-note', (req, res) => {
    let result = NotesDB.EditNote(req.body.email, req.body.note);
    if (result !== 0) {
        console.error(result);
        res.status(500).send(result);
        return;
    }
    res.status(200).send();
})

app.get('/edit', (req, res) => {
    res.sendFile("note-page/note.html", {root: __dirname});
})

app.get('/', (req, res) => {
    res.redirect(req.baseUrl + '/login');
})

app.post('/login', (req, res) => {
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
        let appended_note = JSON.parse(JSON.stringify(NotesDB.notes[credentials.email][note]));
        appended_note.id = note;
        notes.push(appended_note);
    }
    notes.sort((a, b) => new Date(b.lastEditTime) - new Date(a.lastEditTime));
    res.status(200).send(JSON.stringify(notes));
})

app.post("/register", (req, res) => {
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

app.post('/create-note', (req, res) => {
    if (!(req.body.email in NotesDB.notes)) {
        res.status(401).send("no-such-user");
        return;
    }
    if (req.body.password !== UsersDB.users[req.body.email].password){
        res.status(401).send("incorrect-password");
        return;
    }
    let noteID = NotesDB.AddNote(req.body.email);
    res.status(200).send(noteID);
})

app.delete('/delete-note', (req, res) => {
    if (!(req.body.email in NotesDB.notes) || req.body.password !== UsersDB.users[req.body.email].password) {
        res.status(401).send("no-such-user");
        return;
    }
    if (!(req.body.NoteID in NotesDB.notes[req.body.email])) {
        console.error("no-note-with-such-id");
        res.status(404).send("no-note-with-such-id");
        return;
    }
    NotesDB.DeleteNote(req.body.email, req.body.NoteID);
    res.status(200).send("deleted");
})

app.post("/reset-password", (req, res) => {
    let email = req.body.email;
    if (!(email in UsersDB.users)) {
        let errorMessage = "no-such-user";
        res.status(401).send(errorMessage);
        console.error(errorMessage);
        return;
    }
    console.log("Your password: " + UsersDB.users[email].password);
    res.status(200).send("password-restored");
})
