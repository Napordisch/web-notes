function GetAllNotes() {
    fetch("/get-all-notes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: localStorage.getItem("email"), password: localStorage.getItem("password")})
    }).then(res => {
        if (res.status === 401) {
            return res.text().then(text => {
                console.error(text);
                throw new Error(text)
            });
        }
        res.text().then(notes => {
            localStorage.setItem("notes", notes);
        })
    }).catch(error => {
        if (error.message === "no-such-user") {
            console.error(error.message);
        }
    })
    return JSON.parse(localStorage.getItem("notes"));
}

function AddNote(noteStructure, note) {
    let newNote = document.createElement("div");
    newNote.classList.add("note");
    newNote.innerHTML = noteStructure;
    newNote.querySelector("p").innerText = note.content;
    if (note.tags !== []) {
        for (tag in note.tags) {
            let newTag =  document.createElement("li")
            newTag.classList.add("tag");
            let tagLink = document.createElement("a");
            tagLink.innerText = note.tags[tag];
            tagLink.href = "";
            newTag.appendChild(tagLink);
            newNote.getElementsByClassName("tags")[0].appendChild(newTag);
            if (tag !== note.tags.length - 1) {
                newNote.getElementsByClassName("tags")[0].innerHTML += "\n";
            }
        }
    }
    console.log(newNote);
    document.querySelector("main").appendChild(newNote);
}

function FillPage(elem) {
    console.log(elem);
    let newNote = document.createElement("div");
    newNote.classList.add("note");
    newNote.innerHTML = elem;
    console.log(newNote);
}


notes = GetAllNotes();

for (note in notes) {
    console.log(notes[note]);
}

let noteElement;
fetch('/note-element.html').then(res => res.text().then(text => {
   noteElement = text;
   for (note in notes) {
       AddNote(noteElement, notes[note]);
   }
   AddNote(noteElement, note);
})).catch(error => {
    console.error(error.message);
});
