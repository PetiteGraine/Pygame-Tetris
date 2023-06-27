const loginSignUpElement = document.getElementById('login-signup');
const titleElement = document.getElementById('title-login');
const button = document.querySelector('.button-play');
const username = document.getElementById('username');
let isLogin = true;
let accounts = [];

loginSignUpElement.addEventListener("click", createAccountButton)
button.addEventListener("click", handleButtonClick);

function createAccountButton() {
    if (isLogin) {
        titleElement.textContent = "Sign up";
        button.textContent = "Create";
        loginSignUpElement.textContent = "Sign in";
        isLogin = false;
    }

    else {
        titleElement.textContent = "Login";
        button.textContent = "Play";
        loginSignUpElement.textContent = "Create account"
        isLogin = true;
    }
}

function handleButtonClick() {
    const enteredUsername = username.value;

    if (isLogin) {
        // Vérifier si le nom d'utilisateur existe dans la liste des comptes
        const accountExists = accounts.includes(enteredUsername);

        if (accountExists) {
            // Rediriger vers une autre page HTML (remplacez "nom-de-page.html" par votre nom de page réel)
            window.location.href = "../pages/select-mode.html";
        } else {
            alert("Nom d'utilisateur incorrect");
        }
    } else {
        // Ajouter le nom d'utilisateur à la liste des comptes
        accounts.push(enteredUsername);
        alert("Compte créé avec succès");
    }
}
