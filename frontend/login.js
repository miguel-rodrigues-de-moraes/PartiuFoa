document.getElementById("formulario-login").addEventListener("submit", function(event) {
    event.preventDefault();

    var matricula = document.getElementById("campo-matricula").value;
    var senha = document.getElementById("campo-senha").value;

    if (matricula == "123456789" && senha == "aluno123") {
        window.location.href = "index.html";
    } else {
        alert("Matrícula ou senha incorretos.");
    }
});