let notes = []
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
        res.text().then(notes_string => {
            localStorage.setItem("notes", notes_string);
            notes = JSON.parse(localStorage.getItem("notes"));
            FillPage([]);
        })
    }).catch(error => {
        if (error.message === "no-such-user") {
            console.error(error.message);
        }
    })
}

function AddNote(noteStructure, note) {
    let newNote = document.createElement("div");
    newNote.classList.add("note");
    newNote.id = note.id;
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
    document.querySelector("main").appendChild(newNote);
}

function ClearPage() {
    let main = document.getElementById("notes-container");
    let displayedNotes = main.getElementsByClassName("note");
    while (displayedNotes.length > 0) {
        main.removeChild(displayedNotes[0]);
    }
}


function FillPageWithFetch(tags) {
    ClearPage();
    fetch('/note-element.html').then(res => res.text().then(text => {
        // let noteElement = text;
        let noteElement = '<p class="note-text">\n</p>\n<ul class="tags">\n</ul>'
        if (tags.length === 0) {
            for (let note in notes) {
                AddNote(noteElement, notes[note]);
            }
        } else {
            for (let note in notes)  {
                if (containsAllItems(notes[note].tags, tags)) {
                    AddNote(noteElement, notes[note]);
                }
            }
        }
    })).catch(error => {
        console.error(error.message);
    });
}

function FillPage(tags) {
    ClearPage();
    let noteElement = '<p class="note-text">\n</p>\n<ul class="tags">\n</ul>'
    if (tags.length === 0) {
        for (let note in notes) {
            AddNote(noteElement, notes[note]);
        }
    } else {
        for (let note in notes)  {
            if (containsAllItems(notes[note].tags.map(tag => tag.toLowerCase()), tags)) {
                AddNote(noteElement, notes[note]);
            }
        }
    }
}

function containsAllItems(arr1, arr2) { // if everything from arr2 is in arr1
    return arr2.every(item => arr1.includes(item));
}

function FillByTags() {
    setTimeout(() => {
        let tags = document.getElementById("searchbox").value.split(" ");
        tags = tags.map(tag => tag.toLowerCase());
        for (let tag in tags) {
            if (tags[tag] === "") {
                tags.pop(tag);
            }
        }
        if (tags.length === 1 && tags[0] === "") tags = [];
        FillPage(tags)
    }, 100)
}

function Logout() {
    localStorage.clear();
    document.location.href = "/login";
}

GetAllNotes();