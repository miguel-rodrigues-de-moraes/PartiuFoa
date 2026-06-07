document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const matricula = document.getElementById("matricula").value;
    const senha = document.getElementById("senha").value;

    if (matricula === "202610123" && senha === "Aluno456#") {
        window.location.href = "index.html";
    } else {
        alert("Matrícula ou senha incorretas!");
    }
});