if (localStorage.users === undefined) {
    localStorage.users = JSON.stringify({});
}

function GetUserDB() {
    return JSON.parse(localStorage.users);
}

function WriteToUserDB(users) {
    localStorage.users = JSON.stringify(users);
}

function GetFields() {
    let emailValue = document.getElementById("email").value;
    let passwordValue = document.getElementById("password").value;
    return { email: emailValue, password: passwordValue };
}

function Register() {
    let users = GetUserDB();
    let fields = GetFields();
    if (users[fields.email] === undefined) {
        users[fields.email] = fields.password;
    } else {
        console.log("Error: user already exists!")
    }
    console.log(users);
    WriteToUserDB(users);
}

function Login() {
    let users = GetUserDB();
    let fields = GetFields();
    if (users[fields.email] == fields.password) {
        window.alert("Доступ получен.");
    } else if (users[fields.email] === undefined) {
        window.alert("Сначала зарегистрируйтесь.");
    }
    else {
        window.alert("Неверный пароль");
    }
}