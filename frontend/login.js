//Validação do campo de matrícula

let matriculaInserida = document.getElementById("campo-matricula");

matriculaInserida.addEventListener("input", function () {
    let numero_matricula = matriculaInserida.value;

    numero_matricula = numero_matricula.replace(/\D/g, "");

    matriculaInserida.value = numero_matricula;
});


//Validação do campo de senha

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

    if (
        senhaInserida.value.length < 8 ||
        !/[A-Z]/.test(senhaInserida.value) ||
        !/[a-z]/.test(senhaInserida.value) ||
        !/[0-9]/.test(senhaInserida.value) ||
        !/[^\p{L}\p{N}\s]/u.test(senhaInserida.value)) {
        event.preventDefault();
        alert("A senha deve ter entre 8 e 16 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.");
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
                window.location.href = "index.html";
            }
        }
    }

    if (matriculaEncontrada == false) {
        alert("Matrícula inexistente ou incorreta.")
    }

    else if (loginValido == false) {
        alert("Matrícula ou senha incorretos.")
    }
});