// Configure com o telefone oficial, incluindo país e DDD, sem espaços ou símbolos.
const numeroWhatsApp = "5511992257761";

const aviso = document.getElementById('site-notice');
let temporizadorAviso;

function mostrarAviso(mensagem) {
  if (!aviso) return;
  aviso.textContent = mensagem;
  aviso.classList.add('visible');
  window.clearTimeout(temporizadorAviso);
  temporizadorAviso = window.setTimeout(() => aviso.classList.remove('visible'), 4200);
}

function abrirWhatsApp(mensagem, contexto) {
  if (!numeroWhatsApp) {
    mostrarAviso(`O contato de ${contexto} ainda não foi configurado. Escreva para a equipe responsável pelo projeto.`);
    return;
  }
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

document.querySelectorAll('.filter-btn').forEach((botao) => {
  botao.addEventListener('click', () => {
    const categoria = botao.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach((item) => {
      const ativo = item === botao;
      item.classList.toggle('active', ativo);
      item.setAttribute('aria-pressed', String(ativo));
    });
    let quantidade = 0;
    document.querySelectorAll('.pet-card').forEach((card) => {
      const visivel = categoria === 'todos' || card.dataset.porte === categoria;
      card.hidden = !visivel;
      if (visivel) quantidade += 1;
    });
    const status = document.getElementById('filter-status');
    status.textContent = categoria === 'todos' ? `Exibindo ${quantidade} animais.` : `${quantidade} ${quantidade === 1 ? 'animal disponível' : 'animais disponíveis'} neste porte.`;
  });
});

document.querySelectorAll('[data-adopt]').forEach((botao) => {
  botao.addEventListener('click', () => {
    const nome = botao.dataset.adopt;
    abrirWhatsApp(`Olá! Vi o perfil de ${nome} no site Focinhos em Ação. Tenho interesse em conhecer melhor e saber como funciona o processo de adoção responsável.`, 'adoção');
  });
});

document.getElementById('volunteer-button')?.addEventListener('click', () => {
  abrirWhatsApp('Olá! Tenho interesse em ser voluntário(a) no Focinhos em Ação. Como posso ajudar?', 'voluntariado');
});

document.getElementById('adoption-form')?.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const dados = new FormData(evento.currentTarget);
  const nome = String(dados.get('name')).trim();
  const animal = String(dados.get('pet')).trim();
  const detalhe = String(dados.get('message')).trim();
  const mensagem = [
    `Olá! Meu nome é ${nome}. Entrei em contato pelo site Focinhos em Ação e gostaria de conversar sobre adoção.`,
    `Tenho interesse em: ${animal}.`,
    detalhe ? `Mensagem: ${detalhe}` : ''
  ].filter(Boolean).join('\n');
  if (!numeroWhatsApp) {
    mostrarAviso('O contato para adoção ainda não foi configurado.');
    return;
  }
  window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener,noreferrer');
});

async function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(texto);
    return true;
  }
  const campo = document.createElement('textarea');
  campo.value = texto;
  campo.setAttribute('readonly', '');
  campo.style.position = 'fixed';
  campo.style.opacity = '0';
  document.body.appendChild(campo);
  campo.select();
  const resultado = document.execCommand('copy');
  campo.remove();
  return resultado;
}

document.getElementById('copy-pix')?.addEventListener('click', async () => {
  const chave = document.getElementById('chave-pix')?.textContent.trim();
  if (!chave) return;
  try {
    const sucesso = await copiarTexto(chave);
    mostrarAviso(sucesso ? 'Chave PIX copiada. Obrigado por apoiar os animais!' : 'Não foi possível copiar. Selecione e copie a chave PIX.');
  } catch {
    mostrarAviso('Não foi possível copiar. Selecione e copie a chave PIX.');
  }
});

document.getElementById('share-project')?.addEventListener('click', async () => {
  const dados = { title: document.title, text: 'Conheça o Focinhos em Ação e ajude cães e gatos a encontrarem cuidado e um novo lar.', url: window.location.href };
  try {
    if (navigator.share) {
      await navigator.share(dados);
    } else {
      const sucesso = await copiarTexto(dados.url);
      mostrarAviso(sucesso ? 'Link copiado. Obrigado por compartilhar a causa!' : 'Não foi possível copiar o link neste dispositivo.');
    }
  } catch (erro) {
    if (erro.name !== 'AbortError') mostrarAviso('Não foi possível compartilhar neste dispositivo.');
  }
});
