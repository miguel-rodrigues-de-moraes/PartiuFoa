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

