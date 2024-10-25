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
    if (emailValue === "" || passwordValue === "") {
        return false;
    }
    return {email: emailValue, password: passwordValue};
}

function ShowProblem(ProblemText) {
   document.getElementById("form-message").innerHTML = ProblemText;
}

function ClearProblem() {
    ShowProblem("");
}

function Register() {
    let users = GetUserDB();
    let fields = GetFields();
    if (fields === false) {
        /*document.getElementById("form-message").innerText = "Напишите электронную почту и пароль.";*/
        ShowProblem("Напишите электронную почту и пароль.")
        return;
    }
    if (users[fields.email] !== undefined) {

        ShowProblem("Эта почта уже использована для создания аккаунта. Если вы знаете пароль, можете войти.");
        return;
    }
    if (users[fields.email] === undefined) {
        users[fields.email] = fields.password;
    }
    console.log(users);
    WriteToUserDB(users);
}

function Login() {
    let users = GetUserDB();
    let fields = GetFields();
    if (fields === false) {
       ShowProblem("Напишите электронную почту и пароль.");
        /*  window.alert("Напишите электронную почту и пароль.");
          return;*/
    } else if (users[fields.email] === fields.password) {
      ShowProblem("Доступ получен.");

    } else if (users[fields.email] === undefined) {
       ShowProblem("Сначала зарегистрируйтесь.");

    } else {
       ShowProblem("Неверный пароль");

    }
}