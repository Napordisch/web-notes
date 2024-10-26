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

/*
function Register() {
    let fields = GetFields();
    if (fields === false) {
        /!*document.getElementById("form-message").innerText = "Напишите электронную почту и пароль.";*!/
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
*/

function Login() {
    let fields = GetFields();
    if (fields === false) {
        ShowProblem("Напишите электронную почту и пароль.");
        /*  window.alert("Напишите электронную почту и пароль.");
          return;*/
    }
    else {
        console.log(JSON.stringify(fields));
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fields)
        }).then(res => {
            if (res.status === 401) {
                throw new Error("nouser");
            }
            localStorage.setItem("email", fields.email);
            localStorage.setItem("password", fields.password);
            window.location.href = "/all-notes";
        }).catch(error => {
            console.log(error);
            if (error.message === "nouser") {
                ShowProblem("Неправильный логин или пароль");
            }
        })
    }
}