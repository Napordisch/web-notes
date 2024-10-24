function read() {
    if (localStorage.note != undefined && localStorage.note != null) {
        document.getElementById("buffer").value = localStorage.note;
    }
}

read()

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