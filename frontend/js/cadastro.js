// Troca do tipo do input de "password" -> "text" / "text" -> "password"

const olhos = document.querySelectorAll('.icone-olho')

olhos.forEach(olho => {
    olho.addEventListener("click", function () {

        const inputSenha = olho.parentElement.querySelector("input");

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

const formulario = document.querySelector("#formulario-cadastro");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const matricula = document.querySelector("#matricula");
    const senha = document.querySelector("#senha");
    const confirmarSenha = document.querySelector("#confirmar-senha");
    const termos = document.querySelector("#termos");

    if (!nome.value.trim()) {
        alert("O campo nome não pode estar vazio!");
        return;
    } else if (nome.value.trim().length < 5) {
        alert("O campo nome deve ter no mínimo 5 caracteres!");
        return;
    }

    nome.value = nome.value.trim()
        .toLowerCase()
        .split(/\s+/) // Divide pelas palavras, mesmo se houver espaços duplos
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" ");


    if (!email.value.trim()) {
        alert("O campo email não pode estar em branco!");
        return;
    }

    if (!validar_email(email.value)) {
        alert("Email Inválido! Digite um email institucional válido!");
        return;
    }

    // Colocar aqui no futuro uma opção de buscar se o email já existe no banco de dados (ainda não implementado pois não aprendemos banco de dados)

    matricula.value = matricula.value.trim();
    if (!matricula.value) {
        alert("A matricula não pode estar em branco!");
        return;

    } else if (!/^\d+$/.test(matricula.value)) {
        alert("A matricula deve conter apenas números!");
        return;
    } else if (matricula.value.length < 9 || matricula.value.length > 10) {
        alert("A matricula deve conter 9 caracteres númericos!");
        return;
    }

    // Aqui incluir uma validação no futuro para buscar se a matricula já esta cadastrada no banco de dados, caso esteja, impedir o cadastro duplicado

    senha.value.trim();
    const senhaValidada = checarRequisitos(senha.value);

    if (!senha.value) {
        alert("A senha não pode estar em branco!");
        return;
    } else if (!senhaValidada.tamanhoMinimo) {
        alert("A senha deve conter ao menos 8 caracteres!");
        return;
    } else if (!senhaValidada.temMaiuscula) {
        alert("A senha deve conter ao menos uma letra maiúscula!");
        return;
    } else if (!senhaValidada.temMinuscula) {
        alert("A senha deve conter ao menos uma letra minúscula!");
        return;
    } else if (!senhaValidada.temNumero) {
        alert("A senha deve conter ao menos um número!");
        return;
    } else if (!senhaValidada.temEspecial) {
        alert("A senha deve conter ao menos um caracter especial!");
        return;
    }

    if (!confirmarSenha.value) {
        alert("O campo confirmar senha não pode estar em branco!");
        return;
    } else if (confirmarSenha.value !== senha.value) {
        alert("A confirmação de senha deve ser igual à senha digitada.");
        return;
    }

    if(!termos.checked){
        alert("Você precisa aceitar os termos de uso e privacidade para poder criar a sua conta!")
        return;
    }

    usuario = {
        nomeCompleto: nome.value,
        email: email.value,
        matricula: matricula.value,
        senha: senha.value,
    }

    console.log(usuario)

});

function validar_email(email) {
    const emailLimpo = email.trim().toLowerCase();
    const regex = /^[a-z0-9._-]+@unifoa\.edu\.br$/;

    return regex.test(emailLimpo);
}

function checarRequisitos(senha) {
    return {
        tamanhoMinimo: senha.length >= 8,
        temMaiuscula: /[A-Z]/.test(senha),
        temMinuscula: /[a-z]/.test(senha),
        temNumero: /\d/.test(senha),
        temEspecial: /[\W_]/.test(senha)
    };
}