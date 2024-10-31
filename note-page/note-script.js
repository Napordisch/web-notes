let note = ""
function read() {
    if (localStorage.note != undefined && localStorage.note != null) {
        note = JSON.parse(localStorage.note);
        document.getElementById("buffer").value = note.content;
    }
}

read()

function catchTags() {
    let tags = document.getElementById("buffer").value.match(/#\w+/g)
    if (tags != null) {
        localStorage.tags = JSON.stringify(tags.map(tag => tag.slice(1)));
    } else {
        localStorage.tags = null;
    }
}

saveTriggered = false;
function save() {
    if (!saveTriggered) {
        saveTriggered = true;
        setTimeout(() => {
            note.content = document.getElementById("buffer").value;
            localStorage.setItem("note", JSON.stringify(note))
            saveTriggered = false;
        }, 500)
    }
}