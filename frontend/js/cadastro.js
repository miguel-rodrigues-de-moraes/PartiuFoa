import { mostrarAlerta, marcarErro, removerErro } from "./functions/mostrarAlertas.js"

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

window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            const form = document.querySelector("#formulario-cadastro");
            if (form) {
                form.reset();
            }
        }
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

    // Inicio da validação

    const erroNome = validarNome(nome.value)
    if (erroNome) {
        marcarErro(nome);
        mostrarAlerta(erroNome, 'erro')
        return;
    } else {
        removerErro(nome);
    };

    const erroEmail = validarEmail(email.value)
    if (erroEmail) {
        marcarErro(email);
        mostrarAlerta(erroEmail, 'erro');
        return;
    } else {
        removerErro(email);
    };

    const erroMatricula = validarMatricula(matricula.value)
    if (erroMatricula) {
        marcarErro(matricula);
        mostrarAlerta(erroMatricula, 'erro');
        return;
    } else {
        removerErro(matricula);
    };

    const erroSenha = validarSenha(senha.value, confirmarSenha.value, matricula.value);
    if (erroSenha) {
        marcarErro(senha);
        marcarErro(confirmarSenha);
        mostrarAlerta(erroSenha, 'erro');
        return;
    } else {
        removerErro(senha);
        removerErro(confirmarSenha);
    };

    const erroTermo = validarTermos(termos)
    if (erroTermo) {
        marcarErro(termos)
        mostrarAlerta(erroTermo, 'erro');
        return;
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

    mostrarAlerta("Cadastro realizado com sucesso!", 'sucesso')
    setTimeout(() => {
        window.location.href = './home.html';
    }, 820)
});


function validarNome(nome) {
    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
        return 'O nome não pode estar vazio!';
    };

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nomeLimpo)) {
        return 'O nome deve conter apenas letras!';
    };
    
    const partes = nomeLimpo.split(/\s+/);

    if (partes.length < 2) {
        return 'Digite seu nome completo! (Nome e Sobrenome)';
    };  

    if (partes[0].length < 3 || partes[1].length < 2) {
        return 'Digite seu nome completo! (Nome e Sobrenome)';
    };

    return null;
};


function validarEmail(email) {
    const emailLimpo = email?.trim().toLowerCase();
    const regex = /^[a-z0-9._-]+@unifoa\.edu\.br$/;

    if (!emailLimpo) {
        return 'O email não pode estar vazio!';
    };

    if (!regex.test(emailLimpo)) {
        return 'Digite um e-mail institucional valido! (ex: bleno@unifoa.edu.br)';
    };

    if (usuarioArmazenado.emailArmazenados.includes(emailLimpo)) {
        return 'Email já cadastrado por outro usuário! Tente um email diferente!';
    };

    return null;
};


function validarMatricula(matricula) {

    const regex = /^\d+$/;
    const sequenciaNumeros = /^(\d)\1+$/

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

    if (sequenciaNumeros.test(matriculaLimpa) || matriculaLimpa === '123456789') {
        return 'Matrícula inváida!'
    }

    if (usuarioArmazenado.matriculaArmazenada.includes(matriculaLimpa)) {
        return 'A matricula informada já esta cadastrada! Tente uma matrícula diferente!';
    };

    return null;
};


function validarSenha(senha, confirmarSenha, matricula) {
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

    if (/\s+/.test(senha)) {
        return 'A senha não pode conter espaços!';
    };

    if (matricula && senha.includes(matricula)) {
        return 'A senha não pode conter o número da sua matrícula!';
    };

    if (senha !== confirmarSenha) {
        return 'A confirmação de senha deve ser igual à senha digitada!';
    };

    return null;
};

function validarTermos(termos) {
    if (!termos.checked) {
        return 'Para continuar, é necessário ler e aceitar os nossos Termos de Uso. Sem o aceite, não é possível concluir o cadastro.'
    }
}

// Usuarios Ficticios para simular erro de validação

let usuarioArmazenado = {

    matriculaArmazenada: [
        "202610001",
        "202610002",
        "202610003",
        "202610004",
        "202610005"
    ],

    emailArmazenados: [
        "email1@unifoa.edu.br",
        "email2@unifoa.edu.br",
        "email3@unifoa.edu.br",
        "email4@unifoa.edu.br",
        "email5@unifoa.edu.br",
    ],

    senhaArmazenada: [
        "Senha01!",
        "Senha02!",
        "Senha03!",
        "Senha04!",
        "Senha05!"
    ],

};