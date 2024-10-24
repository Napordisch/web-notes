saveTriggered = false;
function save() {
    if (!saveTriggered || saveTriggered == undefined) {
        saveTriggered = true;
        setTimeout(() => {
            localStorage.note = document.getElementById("buffer").value;
            saveTriggered = false;
        }, 500)
    }
}