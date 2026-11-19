// Troca do tipo do input de "password" -> "text" / "text" -> "password"

const olhos = document.querySelectorAll('.icone-olho')

olhos.forEach(olho => {
    olho.addEventListener("click", function () {
        
        const inputSenha = olho.parentElement.querySelector("input");
        
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

    // Validação do campo nome

    if (!nome.value.trim()) {
        alert("O campo nome não pode estar vazio!");
    } else if (nome.value.trim().length < 5) {
        alert("O campo nome deve ter no mínimo 5 caracteres!");
    } 

    nome.value = nome.value.trim()
    .toLowerCase()
    .split(/\s+/) // Divide pelas palavras, mesmo se houver espaços duplos
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");

    // Validar campo de email

    if (!email.value.trim()) {
        alert("O campo email não pode estar em branco!");
    }

    if (!validar_email(email.value)) {
        alert("Email Inválido! Digite um email institucional válido!")
    }

    // Colocar aqui no futuro uma opção de buscar se o email já existe no banco de dados (ainda não implementado pois não aprendemos banco de dados)

    // Validaçãao de matricula
    matricula.value = matricula.value.trim();
    if (!matricula.value) {
        alert("A matricula não pode estar em branco!")
        
    } else if (!/^\d+$/.test(matricula.value)) {
        alert("A matricula deve conter apenas números!")
    } else if (matricula.value < 9 && matricula.value > 10) {
        alert("A matricula deve conter 9 caracteres númericos!")
    }

});

function validar_email(email) {
    const emailLimpo = email.trim().toLowerCase();
    const regex = /^[a-z0-9._-]+@unifoa\.edu\.br$/;

    return regex.test(emailLimpo);
}
