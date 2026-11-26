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


const InputPartida = formCriarCarona.elements.partida;
const InputDestino = formCriarCarona.elements.destino;
const InputPontoReferencia = formCriarCarona.elements.pontoReferencia;

const InputData = formCriarCarona.elements.campoData;
const InputHorario = formCriarCarona.elements.horario;

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

InputPartida.addEventListener('blur', async () => {
    const partida = InputPartida.value.trim();

    const resultado = validarPartida(partida);

    if (!verificarCampo(InputPartida, resultado)) return;

    if (!isCep(partida)) return;

    const consulta = await buscarBairroPorCep(partida);

    if (!verificarCampo(InputPartida, consulta)) return;

    InputPartida.value = `${consulta.bairro}, ${consulta.cidade}`;
});

InputDestino.addEventListener('blur', () => {
    verificarCampo(
        InputDestino,
        validarDestino(InputDestino.value)
    );
});

InputPontoReferencia.addEventListener('blur', () => {
    verificarCampo(
        InputPontoReferencia,
        validarPontoReferencia(InputPontoReferencia.value)
    );
});

InputData.addEventListener('blur', () => {
    validarDataHorario(true, false);
});

InputHorario.addEventListener('blur', () => {
    validarDataHorario(true, true);
});

formCriarCarona.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarForms()) {
        mostrarAlerta('Verifique os campos do formulário!', 'erro');
        return;
    }

    const formCarona = new FormData(formCriarCarona);
    const carona = Object.fromEntries(formCarona);

    console.log(carona.partida);
    console.log(carona.destino);
    console.log(carona.pontoReferencia);
    console.log(carona.tipoCarona);
    console.log(carona.campoData);
    console.log(carona.horario);
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
        removerErro(InputData);
        removerErro(InputHorario);
        ultimoAlertaDataHorario = null;

        const resultadoHorario = validarHorario(InputHorario.value, null);

        if (!resultadoHorario.sucesso) {
            marcarErro(InputHorario);

            if (validarHorarioVazio) {
                exibirAlertaDataHorario(
                    resultadoHorario.mensagem,
                    exibirAlerta
                );
            }

            return false;
        }

        removerErro(InputHorario);
        ultimoAlertaDataHorario = null;

        return true;
    }

    const resultadoData = validarData(InputData.value);

    if (!resultadoData.sucesso) {
        marcarErro(InputData);
        removerErro(InputHorario);

        exibirAlertaDataHorario(
            resultadoData.mensagem,
            exibirAlerta
        );

        return false;
    }

    if (!InputHorario.value && !validarHorarioVazio) {
        removerErro(InputData);
        removerErro(InputHorario);
        ultimoAlertaDataHorario = null;

        return true;
    }

    const resultadoHorario = validarHorario(
        InputHorario.value,
        InputData.value
    );

    if (!resultadoHorario.sucesso) {
        if (!InputHorario.value) {
            removerErro(InputData);
            marcarErro(InputHorario);
        } else {
            marcarErro(InputData);
            marcarErro(InputHorario);
        }

        exibirAlertaDataHorario(
            resultadoHorario.mensagem,
            exibirAlerta
        );

        return false;
    }

    removerErro(InputData);
    removerErro(InputHorario);
    ultimoAlertaDataHorario = null;

    return true;
}

function validarForms() {
    const validarInputPartida = validarPartida(InputPartida.value);
    const validarInputDestino = validarDestino(InputDestino.value);
    const validarInputPontoReferencia = validarPontoReferencia(
        InputPontoReferencia.value
    );

    verificarCampo(InputPartida, validarInputPartida, false);
    verificarCampo(InputDestino, validarInputDestino, false);
    verificarCampo(InputPontoReferencia, validarInputPontoReferencia, false);

    let validarDataEHorario = true;

    if (radioUmaData.checked) {
        validarDataEHorario = validarDataHorario(false, true);
    } else {
        const resultadoHorario = validarHorario(InputHorario.value, null);

        verificarCampo(InputHorario, resultadoHorario, false);
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

        InputData.disabled = true;
        InputData.required = false;

        campoDias.hidden = false;
        campoDias.disabled = false;

        removerErro(InputData);
        removerErro(InputHorario);

        ultimoAlertaDataHorario = null;

    } else {
        campoDias.hidden = true;
        campoDias.disabled = true;
        campoDias.required = false;

        campoData.hidden = false;
        InputData.disabled = false;

        ultimoAlertaDataHorario = null;
    }
}

alterarTipo();