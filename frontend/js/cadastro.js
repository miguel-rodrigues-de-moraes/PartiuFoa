// Troca do tipo do input de "password" -> "text" / "text" -> "password"

const olhos = document.querySelectorAll('.icone-olho')

olhos.forEach(olho => {
    olho.addEventListener("click", function () {

        const inputSenha = olho.parentElement.parentElement.querySelector("input");

        if (inputSenha.type === "password") {
            inputSenha.type = "text"
            olho.classList.remove("fa-eye-slash")
            olho.classList.add("fa-eye")
        } else if (inputSenha.type === "text") {
            inputSenha.type = "password"
            olho.classList.remove("fa-eye")
            olho.classList.add("fa-eye-slash")
        };
    });
});


// Validação da Página de Cadastro

const formulario = document.querySelector("#formulario-cadastro");

const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const matricula = document.querySelector("#matricula");

const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmar-senha");

const termos = document.querySelector("#termos");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    // Inicio da validação

    const erroNome = validarNome(nome.value)
    if (erroNome) {
        alert(erroNome)
        return;
    }

    const erroEmail = validarEmail(email.value)
    if (erroEmail) {
        alert(erroEmail);
        return;
    }

    const erroMatricula = validarMatricula(matricula.value)
    if (erroMatricula) {
        alert(erroMatricula);
        return;
    };


    // Aqui incluir uma validação no futuro para buscar se a matricula já esta cadastrada no banco de dados, caso esteja, impedir o cadastro duplicado

    const erroSenha = validarSenha(senha.value);
    if (erroSenha) {
        alert(erroSenha);
    };

    nome.value =
        nome.value.trim()
            .toLowerCase()
            .split(/\s+/)
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ')


    email.value =
        email.value.trim()
            .toLowerCase()


    matricula.value =
        matricula.value.trim()

    const usuario = {
        nomeCompleto: nome.value,
        email: email.value,
        matricula: matricula.value,
        senha: senha.value,
    };

    console.log(usuario);

});

function validarNome(nome) {
    if (!nome.trim()) {
        return 'O nome não pode estar vazio!';
    };

    if (nome.length < 5) {
        return 'O nome deve conter ao menos 5 caracteres!';
    };

    return null;
};

function validarEmail(email) {
    const emailLimpo = email?.trim().toLowerCase();
    const regex = /^[a-z0-9._-]+@unifoa\.edu\.br$/;

    if (!emailLimpo) {
        return "O email não pode estar vazio!";
    };

    if (!regex.test(emailLimpo)) {
        return "Digite um e-mail institucional valido! (ex: bleno@unifoa.edu.br)";
    };

    // Colocar aqui no futuro uma opção de buscar se o email já existe no banco de dados (ainda não implementado pois não aprendemos banco de dados)

    return null;
};

function validarMatricula(matricula) {

    const regex = /^\d+$/;

    const matriculaLimpa = matricula?.trim()
    if (!matriculaLimpa) {
        return 'A matrícula não pode estar em branco!'
    }

    if (matriculaLimpa.length !== 9) {
        return 'A matrícula deve conter 9 caracteres númericos!';
    };

    if (!regex.test(matriculaLimpa)) {
        return 'A matrícula deve conter apenas números!';
    };

    return null;

};

function validarSenha(senha) {
    const resultado = {
        tamanhoMinimo: senha.length >= 8,
        temMaiuscula: /[A-Z]/.test(senha),
        temMinuscula: /[a-z]/.test(senha),
        temNumero: /\d/.test(senha),
        temEspecial: /[\W_]/.test(senha)
    };

    if (!senha) {
        return 'A senha não pode estar em branco!';
    };

    if (!resultado.tamanhoMinimo) {
        return 'A senha deve conter no mínimo 8 caracteres!';
    };

    if (!resultado.temMaiuscula) {
        return 'A senha deve conter ao menos 1 letra maiúscula!';
    };

    if (!resultado.temMinuscula) {
        return 'A senha deve conter ao menos 1 letra minúscula!';
    };

    if (!resultado.temNumero) {
        return 'A senha deve conter ao menos 1 número!';
    };

    if (!resultado.temEspecial) {
        return 'A senha deve conter ao menos 1 caracter especial!';
    };

    return null;
};

// // Funcionalidade visual do botão de cadastrar

// const botaoCadastrar = document.querySelector(".botao-cadastrar");

// function alterarAparenciaBotao() {
//     const formularioValido =
//         validarNome(nome.value) === null &&
//         validarEmail(email.value) === null &&
//         validarMatricula(matricula.value) === null &&
//         validarSenha(senha.value) === null &&
//         senha.value === confirmarSenha.value &&
//         confirmarSenha.value !== "" &&
//         termos.checked === true;

//     botaoCadastrar.disabled = !formularioValido;
// }

// formulario.addEventListener("input", alterarAparenciaBotao);
// formulario.addEventListener("change", alterarAparenciaBotao);