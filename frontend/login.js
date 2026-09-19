// document.getElementById("formulario-login").addEventListener("submit", function (event) {
//     event.preventDefault();

//     var matricula = document.getElementById("campo-matricula").value;
//     var senha = document.getElementById("campo-senha").value;

//     if (matricula == "123456789" && senha == "aluno123") {
//         window.location.href = "index.html";
//     } else {
//         alert("Matrícula ou senha incorretos.");
//     }
// });


//Validação do campo de matrícula

let matricula = document.getElementById("campo-matricula");

matricula.addEventListener("input", function () {
    let numero_matricula = matricula.value;

    numero_matricula = numero_matricula.replace(/\D/g, "");

    matricula.value = numero_matricula;
});


//Validação do campo de senha

let senha = document.getElementById("campo-senha");

senha.addEventListener("input", function () {
    let senha_value = senha.value;

    senha_value = senha_value.replace(/\s/g, "");

    senha.value = senha_value;
});


//Validação de Formulário (Botão Entrar)

let formulario = document.getElementById("formulario-login");



formulario.addEventListener("submit", function (event) {


    event.preventDefault();

    if (senha.value.length < 8 ||
        !/[A-Z]/.test(senha.value) ||
        !/[a-z]/.test(senha.value) ||
        !/[0-9]/.test(senha.value) ||
        !/[^\p{L}\p{N}\s]/u.test(senha.value)) {
        event.preventDefault();
        alert("A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.");
    }

    //Armazenamento de Dados via JSON 
    //Dentro do botão de Enviar

    const usuario = {
        matricula: document.getElementById("campo-matricula"),
        senha: document.getElementById("campo-senha")
    }

    //Transformando o vetor de informações do usario em string com JSON
    let informacoes_usuario = JSON.stringify(usuario);

    console.log(informacoes_usuario);
    console.log(typeof informacoes_usuario);
    console.log('-'.repeat(50))

    //Releitura da String do Usuario em JSON.parse
    const usuario2 = JSON.parse(informacoes_usuario);

    console.log('-'.repeat(50))
    console.log(usuario2.matricula)
    console.log(usuario2.senha)

});