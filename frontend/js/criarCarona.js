import {
    mostrarAlerta,
    marcarErro,
    removerErro
} from "./functions/mostrarAlertas.js"

const formCriarCarona = document.querySelector('form');

formCriarCarona.elements.partida.addEventListener('blur', async () => {
    const partida = formCriarCarona.elements.partida.value.trim();

    const erroPartida = validarPartida(partida)
    if (!erroPartida.sucesso) {
        marcarErro(formCriarCarona.elements.partida);
        mostrarAlerta(erroPartida.mensagem, 'erro');

        return;
    } else {
        removerErro(formCriarCarona.elements.partida)
    }

    if (!isCep(partida)) return;

    const resultado = await buscarBairroPorCep(partida);

    if (!resultado.sucesso) {
        marcarErro(formCriarCarona.elements.partida)
        mostrarAlerta(resultado.mensagem, 'erro');

        return;
    } else {
        removerErro(formCriarCarona.elements.partida)
    };

    formCriarCarona.elements.partida.value = `${resultado.bairro}, ${resultado.cidade}`;

});

formCriarCarona.elements.destino.addEventListener('blur', async () => {
    const erroDestino = validarDestino(formCriarCarona.elements.destino.value);

    if (!erroDestino.sucesso) {
        marcarErro(formCriarCarona.elements.destino);
        mostrarAlerta(erroDestino.mensagem, 'erro');

        return;
    } else {
        removerErro(formCriarCarona.elements.destino);
    };
});

formCriarCarona.elements.pontoReferencia.addEventListener('blur', async () => {
    const erroPontoReferencia = validarPontoReferencia(formCriarCarona.elements.pontoReferencia.value);

    if (!erroPontoReferencia.sucesso) {
        marcarErro(formCriarCarona.elements.pontoReferencia);
        mostrarAlerta(erroPontoReferencia.mensagem, 'erro');

        return;
    } else {
        removerErro(formCriarCarona.elements.pontoReferencia);
    };
});

formCriarCarona.elements.campoData.addEventListener('blur', async () => {
    const erroDataCarona = validarData(formCriarCarona.elements.campoData.value);

    if (!erroDataCarona.sucesso) {
        marcarErro(formCriarCarona.elements.campoData);
        mostrarAlerta(erroDataCarona.mensagem, 'erro');

        return;
    } else {
        removerErro(formCriarCarona.elements.campoData);
    };
});


formCriarCarona.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formCarona = new FormData(formCriarCarona);
    const carona = Object.fromEntries(formCarona);

    if (!validarForms()) {
        mostrarAlerta('Verifique os campos do formulário!', 'erro');

        return;
    };

    console.log(carona.partida);
    console.log(carona.destino);
    console.log(carona.pontoReferencia);
    console.log(carona.tipoCarona);
    console.log(carona.campoData);


});

function validarPartida(partidaDigitada) {
    const partida = partidaDigitada.trim();

    if (!partida) {
        return {
            sucesso: false,
            mensagem: 'O campo partida não pode estar em branco!'
        };
    };

    if (/^\d+$/.test(partida)) {
        if (partida.length < 8) {
            return {
                sucesso: false,
                mensagem: 'Partida inválida, o CEP deve conter 8 digtos!',
            };
        };

        return {
            sucesso: true
        };
    };

    if (partida.length < 4) {
        return {
            sucesso: false,
            mensagem: 'O ponto de partida deve conter ao menos 4 caracteres!',
        };
    };

    if (/([a-zA-ZÀ-ÿ])\1{2,}/i.test(partida)) {
        return {
            sucesso: false,
            mensagem: 'Partida inválida! Não use sequência de letras iguais!',
        };
    };

    if (!/^(?![0-9\s]+$)[a-zA-ZÀ-ÿ0-9ºª\s,'-]+$/.test(partida)) {
        return {
            sucesso: false,
            mensagem: 'Digíte apenas um CEP ou nome do Bairro!',
        };
    };

    return {
        sucesso: true
    };
};

async function buscarBairroPorCep(partida) {
    const cep = partida.replace(/\D/g, '');

    if (cep.length !== 8) {
        return partida;
    };

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            return {
                sucesso: false,
                mensagem: 'CEP não encontrado!'
            };
        };

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
};

function isCep(valor) {
    return /^\d{5}-?\d{3}$/.test(valor.trim());
};

function validarDestino(destino) {
    if (!destino) {
        return {
            sucesso: false,
            mensagem: 'Escolha um local de destino!',
        };
    };

    return {
        sucesso: true
    };
};

function validarPontoReferencia(pontoReferenciaDigitado) {
    const pontoReferencia = pontoReferenciaDigitado.trim().replace(/\s+/g, ' ');

    if (!pontoReferencia) {
        return {
            sucesso: false,
            mensagem: 'O campo ponto de referência não pode estar em branco!',
        };
    };

    if (pontoReferencia.length < 5) {
        return {
            sucesso: false,
            mensagem: 'O ponto de referência deve conter ao menos 5 caracteres!',
        };
    };

    if (/^\d+$/.test(pontoReferencia)) {
        return {
            sucesso: false,
            mensagem: 'O campo ponto de referência não pode conter somente números!',
        };
    };

    if (/([a-zA-ZÀ-ÿ])\1{2,}/i.test(pontoReferencia)) {
        return {
            sucesso: false,
            mensagem: 'Ponto de Referência inválido! Não use uma sequência de caracteres iguais!',
        };
    };

    return {
        sucesso: true
    };
};

function validarData(data) {
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    if (!data) {
        return {
            sucesso: false,
            mensagem: 'O campo data não pode estar em branco!'
        };
    };

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataCarona = new Date(ano, mes - 1, dia);
    dataCarona.setHours(0, 0, 0, 0);

    if (dataCarona < dataAtual) {
        return {
            sucesso: false,
            mensagem: 'A data da carona não pode ser anterior a data atual!'
        };
    };

    return {
        sucesso: true
    };
};

function validarForms() {
    const validarInputPartida = validarPartida(formCriarCarona.elements.partida.value);
    const validarInputDestino = validarDestino(formCriarCarona.elements.destino.value);
    const validarInputPontoReferencia = validarPontoReferencia(formCriarCarona.elements.pontoReferencia.value);
    const validarInputData = radioUmaData.checked ? validarData(InputData.value) : {sucesso: true};

    return validarInputPartida.sucesso && 
        validarInputDestino.sucesso && 
        validarInputPontoReferencia.sucesso && 
        validarInputData.sucesso;
};

const radioUmaData = document.querySelector('#uma-data');
const radioRecorrente = document.querySelector('#recorrente');

const campoData = document.querySelector('#campo-data');
const campoDias = document.querySelector('#campo-dias');

const InputData = formCriarCarona.elements.campoData;

radioRecorrente.addEventListener('change', alterarTipo);
radioUmaData.addEventListener('change', alterarTipo);

function alterarTipo() {
    if (radioRecorrente.checked) {
        campoData.hidden = true;
        InputData.disabled = true;
        campoData.required = false;

        campoDias.hidden = false;
        campoDias.disabled = false;
    } else {
        campoDias.hidden = true;
        campoDias.disabled = true;
        campoDias.required = false;

        campoData.hidden = false;
        campoData.disabled = false;
    };

};

alterarTipo();