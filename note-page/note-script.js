let note = {}

function read() {
    if (localStorage.note !== undefined && localStorage.note !== null) {
        note = JSON.parse(localStorage.note);
        document.getElementById("buffer").value = note.content;
    }
}

read()

function catchTags() {
    let tags = document.getElementById("buffer").value.match(/#\w+/g)
    let pureTags = [];
    if (tags != null) {
        pureTags = tags.map(tag => tag.slice(1));
    }
    localStorage.tags = JSON.stringify(pureTags);
    note.tags = pureTags;
}

let saveTriggered = false;

function save() {
    if (!saveTriggered) {
        saveTriggered = true;
        setTimeout(() => {
            catchTags();
            note.content = document.getElementById("buffer").value;
            note.lastEditTime = new Date();
            localStorage.setItem("note", JSON.stringify(note))
            fetch("/save-note", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({note: note, email: localStorage.getItem("email")})
            }).then().catch(err => {
                console.error(err.message);
            })

            saveTriggered = false;
        }, 10)
    }
}