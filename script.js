// Definindo as Variáveis pegando os elementos dos inputs que serão utilizados

const input = document.querySelector(".input-item-novo");
const botaoAdicionar = document.querySelector(".btn-adicionar");
const lista = document.querySelector("#lista-de-compras");
const notificacaoProduto = document.getElementById("notificacao");
const botaoNotificacao = document.getElementById("botao-X");

let temporizador;

// Criando uma função que atribuirá a função de remover item
function configurarRemocao(item) {
    const botaoRemover = item.querySelector("button");

    botaoRemover.addEventListener("click", function () {
        item.remove();
        notificacaoProduto.style.display = "block";

        temporizador = setTimeout(function () {
            notificacaoProduto.style.display = "none";
        }, 3000);
    });
};

// Adicionando a função de remover item aos itens pré adicinados na lista
const itensIniciais = lista.querySelectorAll('li');

itensIniciais.forEach(function (item) {
    configurarRemocao(item);
    configurarCheckbox(item);
});


// Adicionando uma função ao botão adicionar
botaoAdicionar.addEventListener("click", function () {

    const nomeItem = input.value;

    // Evitando criação de produto vazio
    if (nomeItem.trim() === "") {
        alert("Digite o nome de um produto!");
        return;
    }

    // Formatando produto para começar com letra maúscula
    const nomeFormatado = nomeItem.charAt(0).toUpperCase() + nomeItem.slice(1);

    const item = document.createElement("li")

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const texto = document.createElement("span");
    texto.textContent = nomeFormatado;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "🗑️";

    // Adicionndo as configurações adjacentes aos novos itens cadastrados
    item.appendChild(checkbox);
    item.appendChild(texto);
    item.appendChild(botaoRemover);

    configurarRemocao(item);
    configurarCheckbox(item);

    lista.appendChild(item);

    // Resentando o conteúdo do input após criar o novo produto
    input.value = "";
});

function configurarCheckbox(item) {
    const verificarCheckbox = item.querySelector('input[type="checkbox"]')

    verificarCheckbox.addEventListener("change", function () {
        if (verificarCheckbox.checked) {
            item.classList.add("marcado")
        }
        else if (verificarCheckbox.checked === false) {
            item.classList.remove("marcado")
        }
    });
};

// Colocando função no botão de X da notificação
botaoNotificacao.addEventListener("click", function () {
    clearTimeout(temporizador);
    notificacaoProduto.style.display = "none";
});