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

    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            const form = document.querySelector("#formulario-cadastro");
            if (form) {
                form.reset();
            }
        }
    });

    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const matricula = document.querySelector("#matricula");
    const senha = document.querySelector("#senha");
    const confirmarSenha = document.querySelector("#confirmar-senha");
    const termos = document.querySelector("#termos");

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

    const erroSenha = validarSenha(senha.value, confirmarSenha.value);
    if (erroSenha) {
        alert(erroSenha);
        return;
    };

    const erroTermo = validarTermos(termos)
        if (erroTermo) {
            alert(erroTermo);
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

    window.location.href = 'home.html'
});


function validarNome(nome) {
    if (!nome.trim()) {
        return 'O nome não pode estar vazio!';
    };

    if (nome.trim().length < 5) {
        return 'O nome deve conter ao menos 5 caracteres!';
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

    if (usuarioArmazenado.matriculaArmazenada.includes(matriculaLimpa)) {
        return 'A matricula informada já esta cadastrada! Tente uma matrícula diferente!';
    };

    return null;
};


function validarSenha(senha, confirmarSenha) {
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

    if (!senha) {
        return 'O campo confirmar senha não pode estar em branco!';
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