import {
    mostrarAlerta,
    marcarErro,
    removerErro
} from "./functions/mostrarAlertas.js";

const formCriarCarona = document.querySelector('form');

const radioUmaData = document.querySelector('#uma-data');
const radioRecorrente = document.querySelector('#recorrente');

const campoData = document.querySelector('#campo-data');
const campoDias = document.querySelector('#campo-dias');


const inputPartida = formCriarCarona.elements.partida;
const inputDestino = formCriarCarona.elements.destino;
const inputPontoReferencia = formCriarCarona.elements.pontoReferencia;

const inputData = formCriarCarona.elements.campoData;
const inputHorario = formCriarCarona.elements.horario;

const inputVagasDisponiveis = formCriarCarona.elements.vagasDisponiveis;
const inputValorCarona = formCriarCarona.elements.valorCarona

let ultimoAlertaDataHorario = null;

function verificarCampo(campo, resultado, exibirAlerta = true) {
    if (!resultado.sucesso) {
        marcarErro(campo);

        if (exibirAlerta) {
            mostrarAlerta(resultado.mensagem, 'erro');
        }

        return false;
    }

    removerErro(campo);
    return true;
}

function exibirAlertaDataHorario(mensagem, exibirAlerta = true) {
    if (!exibirAlerta || ultimoAlertaDataHorario === mensagem) return;

    mostrarAlerta(mensagem, 'erro');
    ultimoAlertaDataHorario = mensagem;
}

inputPartida.addEventListener('blur', async () => {
    const partida = inputPartida.value.trim();

    const resultado = validarPartida(partida);

    if (!verificarCampo(inputPartida, resultado)) return;

    if (!isCep(partida)) return;

    const consulta = await buscarBairroPorCep(partida);

    if (!verificarCampo(inputPartida, consulta)) return;

    inputPartida.value = `${consulta.bairro}, ${consulta.cidade}`;
});

inputDestino.addEventListener('blur', () => {
    verificarCampo(
        inputDestino,
        validarDestino(inputDestino.value)
    );
});

inputPontoReferencia.addEventListener('blur', () => {
    verificarCampo(
        inputPontoReferencia,
        validarPontoReferencia(inputPontoReferencia.value)
    );
});

inputData.addEventListener('blur', () => {
    validarDataHorario(true, false);
});

inputHorario.addEventListener('blur', () => {
    validarDataHorario(true, true);
});

inputVagasDisponiveis.addEventListener('blur', () => {
    const vagas = formCriarCarona.elements.vagasDisponiveis.value;

    if (vagas !== '' && Number.isInteger(Number(vagas))) {
        inputVagasDisponiveis.value = Number(vagas)
    }

    verificarCampo(inputVagasDisponiveis, validarVagasDisponiveis(vagas))
}); 

inputValorCarona.addEventListener('blur', () => {
    const valorDigitado = inputValorCarona.value.trim()

        const resultadoValor = validarValorCarona(valorDigitado)

    if(resultadoValor.sucesso) {
        const valorCarona = Number(
            valorDigitado
            .replace('R$', '')
            .trim()
            .replace(',', '.')
        );

        inputValorCarona.value = `R$${valorCarona.toFixed(2).replace('.', ',')}`;
    }

    verificarCampo(inputValorCarona, resultadoValor);
});

const btnCancelar = formCriarCarona.elements.botaoCancelar;
btnCancelar.addEventListener('click', () => {
    window.location.href = './home.html';
});

formCriarCarona.addEventListener('submit', (e) => {
    e.preventDefault();

    const formCarona = new FormData(formCriarCarona);
    const carona = Object.fromEntries(formCarona);

    carona.dias = formCarona.getAll('dias');

    if (!validarForms()) {
        mostrarAlerta('Verifique os campos do formulário!', 'erro');
        return;
    }

    if (carona.tipoCarona === 'recorrente') {
        const resultadoDIasRecorrentes = validarDiasRecorrentes(carona.dias);

        if (!resultadoDIasRecorrentes.sucesso) {
            mostrarAlerta(resultadoDIasRecorrentes.mensagem, 'erro');

            return;
        }
    }

    carona.valorCarona = Number(carona.valorCarona.replace(',', '.').replace('R$', ''));

    console.log(carona.partida);
    console.log(carona.destino);
    console.log(carona.pontoReferencia);
    console.log(carona.tipoCarona);
    console.log(carona.campoData);
    console.log(carona.horario);
    console.log(carona.dias);
    console.log(carona.valorCarona)
});

function validarPartida(partidaDigitada) {
    const partida = partidaDigitada.trim();

    if (!partida) {
        return {
            sucesso: false,
            mensagem: 'O campo partida não pode estar em branco!'
        };
    }

    if (/^\d+$/.test(partida)) {
        if (partida.length !== 8) {
            return {
                sucesso: false,
                mensagem: 'Partida inválida, o CEP deve conter 8 dígitos!'
            };
        }

        return {
            sucesso: true
        };
    }

    if (partida.length < 4) {
        return {
            sucesso: false,
            mensagem: 'O ponto de partida deve conter ao menos 4 caracteres!'
        };
    }

    if (/([a-zA-ZÀ-ÿ])\1{2,}/i.test(partida)) {
        return {
            sucesso: false,
            mensagem: 'Partida inválida! Não use sequência de letras iguais!'
        };
    }

    if (!/^(?![0-9\s]+$)[a-zA-ZÀ-ÿ0-9ºª\s,'-]+$/.test(partida)) {
        return {
            sucesso: false,
            mensagem: 'Digite apenas um CEP ou nome do Bairro!'
        };
    }

    return {
        sucesso: true
    };
}

async function buscarBairroPorCep(partida) {
    const cep = partida.replace(/\D/g, '');

    if (cep.length !== 8) {
        return {
            sucesso: true
        };
    }

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        const dados = await resposta.json();

        if (dados.erro) {
            return {
                sucesso: false,
                mensagem: 'CEP não encontrado!'
            };
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
    }
}

function isCep(valor) {
    return /^\d{5}-?\d{3}$/.test(valor.trim());
}

function validarDestino(destino) {
    if (!destino.trim()) {
        return {
            sucesso: false,
            mensagem: 'Escolha um local de destino!'
        };
    }

    return {
        sucesso: true
    };
}

function validarPontoReferencia(pontoReferenciaDigitado) {
    const pontoReferencia = pontoReferenciaDigitado
        .trim()
        .replace(/\s+/g, ' ');

    if (!pontoReferencia) {
        return {
            sucesso: false,
            mensagem: 'O campo ponto de referência não pode estar em branco!'
        };
    }

    if (pontoReferencia.length < 5) {
        return {
            sucesso: false,
            mensagem: 'O ponto de referência deve conter ao menos 5 caracteres!'
        };
    }

    if (/^\d+$/.test(pontoReferencia)) {
        return {
            sucesso: false,
            mensagem: 'O campo ponto de referência não pode conter somente números!'
        };
    }

    if (/([a-zA-ZÀ-ÿ])\1{2,}/i.test(pontoReferencia)) {
        return {
            sucesso: false,
            mensagem: 'Ponto de Referência inválido! Não use uma sequência de caracteres iguais!'
        };
    }

    return {
        sucesso: true
    };
}

function validarData(data) {
    if (!data) {
        return {
            sucesso: false,
            mensagem: 'O campo data não pode estar em branco!'
        };
    }

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataCarona = new Date(ano, mes - 1, dia);

    if (
        dataCarona.getFullYear() !== ano ||
        dataCarona.getMonth() !== mes - 1 ||
        dataCarona.getDate() !== dia
    ) {
        return {
            sucesso: false,
            mensagem: 'Informe uma data válida!'
        };
    }

    const dataAtual = new Date();

    dataCarona.setHours(0, 0, 0, 0);
    dataAtual.setHours(0, 0, 0, 0);

    if (dataCarona < dataAtual) {
        return {
            sucesso: false,
            mensagem: 'A data da carona não pode ser anterior à data atual!'
        };
    }

    return {
        sucesso: true
    };
}

function validarDiasRecorrentes(dias) {
    if (dias.length === 0) {
        return {
            sucesso: false,
            mensagem: 'Selecione pelo menos um dia da semana!',
        };
    }

    if (dias.length > 7) {
        return {
            sucesso: false,
            mensagem: 'Não é possível selecionar mais do que 7 dias!'
        };
    }

    return {
        sucesso: true
    }
}

function validarHorario(horario, data) {
    if (!horario) {
        return {
            sucesso: false,
            mensagem: 'O horário da carona não pode estar em branco!'
        };
    }

    if (!data) {
        return {
            sucesso: true
        };
    }

    const [ano, mes, dia] = data.split('-').map(Number);
    const [horas, minutos] = horario.split(':').map(Number);

    const dataCarona = new Date(ano, mes - 1, dia, horas, minutos);
    const dataAtual = new Date();

    dataAtual.setSeconds(0, 0);

    if (dataCarona < dataAtual) {
        return {
            sucesso: false,
            mensagem: 'O horário da carona não pode ser anterior à hora atual!'
        };
    }

    return {
        sucesso: true
    };
}

function validarDataHorario(exibirAlerta = true, validarHorarioVazio = true) {
    if (radioRecorrente.checked) {
        removerErro(inputData);
        removerErro(inputHorario);
        ultimoAlertaDataHorario = null;

        const resultadoHorario = validarHorario(inputHorario.value, null);

        if (!resultadoHorario.sucesso) {
            marcarErro(inputHorario);

            if (validarHorarioVazio) {
                exibirAlertaDataHorario(
                    resultadoHorario.mensagem,
                    exibirAlerta
                );
            }

            return false;
        }

        removerErro(inputHorario);
        ultimoAlertaDataHorario = null;

        return true;
    }

    const resultadoData = validarData(inputData.value);

    if (!resultadoData.sucesso) {
        marcarErro(inputData);
        removerErro(inputHorario);

        exibirAlertaDataHorario(
            resultadoData.mensagem,
            exibirAlerta
        );

        return false;
    }

    if (!inputHorario.value && !validarHorarioVazio) {
        removerErro(inputData);
        removerErro(inputHorario);
        ultimoAlertaDataHorario = null;

        return true;
    }

    const resultadoHorario = validarHorario(
        inputHorario.value,
        inputData.value
    );

    if (!resultadoHorario.sucesso) {
        if (!inputHorario.value) {
            removerErro(inputData);
            marcarErro(inputHorario);
        } else {
            marcarErro(inputData);
            marcarErro(inputHorario);
        }

        exibirAlertaDataHorario(
            resultadoHorario.mensagem,
            exibirAlerta
        );

        return false;
    }

    removerErro(inputData);
    removerErro(inputHorario);
    ultimoAlertaDataHorario = null;

    return true;
}

function validarVagasDisponiveis(vagasDisponiveis) {

    if (!vagasDisponiveis) {
        return {
            sucesso: false,
            mensagem: 'O campo de vagas não pode estar em branco!',
        };
    }

    const vagas = Number(vagasDisponiveis)

    if (vagas === 0) {

        return {
            sucesso: false,
            mensagem: 'A carona deve conter ao menos 1 vaga disponível!',
        };
    }

    if (vagas.length > 1) {
        return {
            sucesso: false,
            mensagem: 'Quantidade de vagaas inválidas!',
        };
    }

    if (vagas > 4) {
        return {
            sucesso: false,
            mensagem: 'Quantidade de vagas inválidas!',
        };
    }

    return {
        sucesso: true
    };

}

function validarValorCarona(valorCarona) {
    const valorTexto = String(valorCarona ?? '').trim();

    if (!valorTexto.trim()) {
        return {
            sucesso: false,
            mensagem: 'O valor da carona não pode estar em branco!'
        };
    }

    const valorValidar = Number(valorTexto.replace('R$', '').trim().replace(',', '.'));

    if (isNaN(valorValidar)) {
        return {
            sucesso: false,
            mensagem: 'Digite um valor válido!'
        };
    }

    if (valorValidar < 0) {
        return {
            sucesso: false,
            mensagem: 'O valor da carona não pode ser negativo!'
        };
    }

    if (valorValidar < 0.50) {
        return {
            sucesso: false,
            mensagem: 'O valor mínimo da carona deve ser R$ 0,50!'
        };
    }

    return {
        sucesso: true
    };
}

function validarForms() {
    const validarInputPartida = validarPartida(inputPartida.value);
    const validarInputDestino = validarDestino(inputDestino.value);
    const validarInputPontoReferencia = validarPontoReferencia(
        inputPontoReferencia.value
    );

    const validarInputVagas = validarVagasDisponiveis(inputVagasDisponiveis.value)
    const validarInputValor = validarValorCarona(inputValorCarona.value);

    verificarCampo(inputPartida, validarInputPartida, false);
    verificarCampo(inputDestino, validarInputDestino, false);
    verificarCampo(inputPontoReferencia, validarInputPontoReferencia, false);
    verificarCampo(inputVagasDisponiveis, validarInputVagas, false);
    verificarCampo(inputValorCarona, validarInputValor, false);

    let validarDataEHorario = true;

    if (radioUmaData.checked) {
        validarDataEHorario = validarDataHorario(false, true);
    } else {
        const resultadoHorario = validarHorario(inputHorario.value, null);

        verificarCampo(inputHorario, resultadoHorario, false);
        validarDataEHorario = resultadoHorario.sucesso;
    }



    return validarInputPartida.sucesso &&
        validarInputDestino.sucesso &&
        validarInputPontoReferencia.sucesso &&
        validarDataEHorario;
}

radioRecorrente.addEventListener('change', alterarTipo);
radioUmaData.addEventListener('change', alterarTipo);

function alterarTipo() {
    if (radioRecorrente.checked) {
        campoData.hidden = true;

        inputData.disabled = true;
        inputData.required = false;

        campoDias.hidden = false;
        campoDias.disabled = false;

        removerErro(inputData);
        removerErro(inputHorario);

        ultimoAlertaDataHorario = null;

    } else {
        campoDias.hidden = true;
        campoDias.disabled = true;
        campoDias.required = false;

        campoData.hidden = false;
        inputData.disabled = false;

        ultimoAlertaDataHorario = null;
    }
}

alterarTipo();