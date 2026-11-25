import { mostrarAlerta, marcarErro, removerErro } from "./functions/mostrarAlertas.js";

// Funcionalidade do Olho

const olho = document.querySelector('.icone-olho')

olho.addEventListener("click", function () {

    const inputSenha = document.querySelector("#campo-senha");

    if (inputSenha.type === "password") {
        inputSenha.type = "text"
        olho.classList.remove("fa-eye-slash")
        olho.classList.add("fa-eye")
    }
    else if (inputSenha.type === "text") {
        inputSenha.type = "password"
        olho.classList.remove("fa-eye")
        olho.classList.add("fa-eye-slash")
    };
});

// Formatação e limitação do campo de matrícula

let matriculaInserida = document.getElementById("campo-matricula");

matriculaInserida.addEventListener("input", function () {
    let numero_matricula = matriculaInserida.value;

    numero_matricula = numero_matricula.replace(/\D/g, "");

    matriculaInserida.value = numero_matricula;
});


// Formatação e limitação do campo de senha

let senhaInserida = document.getElementById("campo-senha");

senhaInserida.addEventListener("input", function () {
    let senha_value = senhaInserida.value;

    senha_value = senha_value.replace(/\s/g, "");

    senhaInserida.value = senha_value;
});


//Validação de Submit (Botão Entrar)

let formulario = document.getElementById("formulario-login");

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    //Validação da Matrícula

    if (matriculaInserida.value.length !== 9) {
        marcarErro(matriculaInserida);
        mostrarAlerta("A matrícula deve conter exatamente 9 números.", "erro");
        return;

    } else {
        removerErro(matriculaInserida);
    }

    //Validação das Matrículas e Senhas por PARES LIGADOS

    let usuarioArmazenado = {

        matriculaArmazenada: [
            "202610001",
            "202610002",
            "202610003",
            "202610004",
            "202610005"
        ],

        senhaArmazenada: [
            "Senha01!",
            "Senha02!",
            "Senha03!",
            "Senha04!",
            "Senha05!"
        ],

    };

    //Redirecionamento para Homepage + Configuração das Mensagens de Alert caso erro no Login

    let loginValido = false;
    let matriculaEncontrada = false;

    for (let i = 0; i < usuarioArmazenado.matriculaArmazenada.length; i++) {

        if (matriculaInserida.value == usuarioArmazenado.matriculaArmazenada[i]) {

            matriculaEncontrada = true;

            if (senhaInserida.value == usuarioArmazenado.senhaArmazenada[i]) {
                loginValido = true;
                window.location.href = "./frontend/home.html";
            }
        }
    };

    // Verificação da existência da Matrícula

    if (matriculaEncontrada == false) {
        marcarErro(matriculaInserida);
        mostrarAlerta("Matrícula inexistente ou incorreta.", "erro")
        return
    }

    // Validação da senha (Vazia)

    if (senhaInserida.value.length === 0) {
        marcarErro(senhaInserida)
        mostrarAlerta("A senha não pode estar vazia.", "erro");
        return;
    }
    else {
        removerErro(senhaInserida)
    }

    // Verificação da senha (Incorreta)

    if (loginValido == false) {
        marcarErro(senhaInserida)
        mostrarAlerta("Senha incorreta.", "erro")
        return;
    }
});

// !/[A-Z]/.test(senhaInserida.value) ||
// !/[a-z]/.test(senhaInserida.value) ||
// !/[0-9]/.test(senhaInserida.value) ||
// !/[^\p{L}\p{N}\s]/u.test(senhaInserida.value)