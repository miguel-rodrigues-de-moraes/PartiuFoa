export function mostrarAlerta(mensagem, tipo = 'erro') {
    const container = document.querySelector('#container-alertas');
    if (!container) return;

    const card = document.createElement('div');
    card.classList.add('alerta-card');

    let icone = '';
    if (tipo === 'erro') {
        card.classList.add('alerta-erro');
        icone = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else if (tipo === 'sucesso') {
        card.classList.add('alerta-sucesso');
        icone = '<i class="fa-solid fa-circle-check"></i>';
    }

    card.innerHTML = `
        ${icone}
        <span>${mensagem}</span>
        <button class="alerta-fechar" aria-label="Fechar">&times;</button>
    `;

    container.appendChild(card);

    card.querySelector('.alerta-fechar').addEventListener('click', () => {
        card.remove();
    });

    setTimeout(() => {
        card.remove();
    }, 6000);
}

export function marcarErro(input) {
    const elementoVisual = input.closest('.caixa-input') || input;
    elementoVisual.classList.add('input-erro');
}

export function removerErro(input) {
    const elementoVisual = input.closest('.caixa-input') || input;
    elementoVisual.classList.remove('input-erro');
}
