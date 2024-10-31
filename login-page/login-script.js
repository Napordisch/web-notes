const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
function GetFields() {
    let emailValue = document.getElementById("email").value;
    let passwordValue = document.getElementById("password").value;
    if (!emailPattern.test(emailValue)) {
        return false;
    }
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
    let fields = GetFields();
    if (fields === false) {
        ShowProblem("Напишите электронную почту и пароль.")
        return;
    }
    fetch("/register", {
        method: "POST", headers: {
            "Content-Type": "Application/json",
        }, body: JSON.stringify(fields)
    }).then(res => {
        if (res.status === 409) {
            return res.text().then(text => {
                console.error(text);
                throw new Error(text);
            })
        }
        if (res.status === 201) {
            window.alert("Вы зарегистрировались");
        }
    }).catch(error => {
        if (error.message === "email-already-exists") {
            ShowProblem("Аккаунт на такую почту уже зарегистрирован");
        }
    })
}

function Login() {
    let fields = GetFields();
    if (fields === false) {
        ShowProblem("Напишите электронную почту и пароль.");
        return;
    }
    console.log(JSON.stringify(fields));
    fetch("/login", {
        method: "POST", headers: {
            "Content-Type": "Application/json",
        }, body: JSON.stringify(fields)
    }).then(res => {
        if (res.status === 401) {
            return res.text().then(text => {
                console.error(text);
                throw new Error(text)
            });
        }
        localStorage.clear();
        localStorage.setItem("email", fields.email);
        localStorage.setItem("password", fields.password);
        window.location.href = "/notes";
    }).catch(error => {
        console.log(error);
        if (error.message === "no-such-user") {
            ShowProblem("Неправильный логин или пароль");
        }
    })
}

function ForgotPassword() {
    let email = document.getElementById("email").value;
    if (email === undefined || email === "" || !emailPattern.test(email)) {
        ShowProblem("Напишите электронную почту.");
        return
    }
    fetch("/reset-password", {
        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({email: email})
    }).then(res => {
        if (res.status === 201) {
            window.alert("Пароль отправлен")
        }
        return res.text().then(text => {
            console.error(text);
            throw new Error(text)
        });
    }).catch(error => {
        console.log(error);
        if (error.message === "no-such-user") {
            ShowProblem("Нет аккаунта с такой почтой. Можете зарегистрироваться.");
        }
    })
}