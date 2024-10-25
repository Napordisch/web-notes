function read() {
    if (localStorage.note != undefined && localStorage.note != null) {
        document.getElementById("buffer").value = localStorage.note;
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
            localStorage.note = document.getElementById("buffer").value;
            saveTriggered = false;
        }, 500)
    }
}