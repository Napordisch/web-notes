if (localStorage.users == undefined) {
    localStorage.users = JSON.stringify({});
}

function GetUserDB() {
    return JSON.parse(localStorage.users);
}

function GetFields() {
    let emailValue = document.getElementById("email").value;
    let passwordValue = document.getElementById("password").value;
    return {email: emailValue, password: passwordValue};
}

function Register() {
    let users = GetUserDB();
    let fields = GetFields()
    if (users[fields.email] === undefined) {
        users[fields.email] = fields.password;
    } else {
        console.log("Error: user already exists!")
    }
    console.log(users);
    localStorage.users = JSON.stringify(users);
}

function Login() {
    let users = GetUserDB();
    let fields = GetFields();
}