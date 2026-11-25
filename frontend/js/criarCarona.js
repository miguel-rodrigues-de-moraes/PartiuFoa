const formulario = document.querySelector('form');
const inputPartida = document.querySelector('#partida');

inputPartida.addEventListener('blur', async () => {
    const partida = inputPartida.value.trim();

    if (!isCep(partida)) return;

    const resultado = await buscarBairroPorCep(partida);

    if (!resultado.sucesso) {
        alert(resultado.mensagem);
        return;
    }

    inputPartida.value = `${resultado.bairro}, ${resultado.cidade}`;

});



formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formCarona = new FormData(formulario);
    const carona = Object.fromEntries(formCarona);

    const erroPartida = validarPartida(carona.partida)
    if (erroPartida) {
        alert(erroPartida);
        return;
    };

    const resultado = await buscarBairroPorCep(carona.partida);
    if (resultado.sucesso === false) {
        alert(resultado.mensagem);
        return;
    };

    if (resultado.sucesso) {
        carona.partida = `${resultado.bairro}, ${resultado.cidade}`
    }

    console.log(carona.partida)

});


function validarPartida(partidaDigitada) {
    const partida = partidaDigitada.trim();

    if (!partida) {
        return 'O campo partida não pode estar em branco!';
    };

    if (/^\d+$/.test(partida)) {
        if (partida.length < 8) {
            return 'Partida inválida, o CEP deve conter 8 digtos!';
        };

        return null;
    };

    if (partida.length < 4) {
        return 'O ponto de partida deve conter ao menos 4 caracteres!';
    };


    if (/([a-zA-ZÀ-ÿ])\1{2,}/i.test(partida)) {
        return 'Partida inválida! Não use sequência de letras iguais!';
    };

    if (!/^[a-zA-ZÀ-ÿ\s,'-]+$/.test(partida)) {
        return 'Digíte apenas um CEP ou nome do Bairro!';
    };

    return null;
};

async function buscarBairroPorCep(partida) {
    const cep = partida.replace(/\D/g, '');

    if (cep.length !== 8) {
        return partida;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            return {
                sucesso: false,
                mensagem: 'CEP não encontrado!'
            };;
        }

        return {
            sucesso: true,
            bairro: dados.bairro || dados.localidade,
            cidade: dados.localidade
        };

    } catch (erro) {
        return {
            sucesso: false,
            mensagem: 'Erro ao consultar o CEP!'
        };
    };
}

function isCep(valor) {
    return /^\d{5}-?\d{3}$/.test(valor.trim());
}