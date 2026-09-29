/* =========================================================
   ÓTICA ÍRIS — comportamento da página
   Tudo que o cliente costuma pedir para trocar fica em CONFIG e PRODUTOS.
   ========================================================= */

'use strict';

/* ---------- 1. Dados da loja (troque aqui) ---------- */

const CONFIG = {
  // Só números: 55 + DDD + número. Ex.: 5511987654321
  whatsapp: '5511999999999',
  whatsappExibicao: '(11) 99999-9999',
  telefone: '(11) 3000-0000',
  telefoneLink: '+551130000000',
  instagram: 'oticairis', // sem o @
  endereco: 'Rua Exemplo, 123, Centro, São Paulo – SP',
  enderecoCurto: 'Rua Exemplo, 123, Centro',
  horarioCurto: 'Seg a sex 9h–19h, sáb 9h–14h',
  // Texto usado para achar a loja no Google Maps (pode ser o nome + endereço)
  buscaMapa: 'Rua Exemplo, 123, São Paulo, SP',
  mensagemPadrao: 'Olá! Vim pelo site e gostaria de atendimento.',
};

/* ---------- 2. Vitrine ----------
   categorias: chaves usadas nos filtros (grau, sol, masculino, feminino, infantil).
   imagem: para usar foto própria, troque por 'images/products/nome-do-arquivo.webp'. */

const unsplash = (id, largura = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${largura}&h=${largura}&q=70`;

const PRODUTOS = [
  {
    nome: 'Aurora',
    rotulo: 'Grau em titânio',
    categorias: ['grau', 'feminino'],
    descricao: 'Armação leve em titânio prateado, com hastes finas que quase não pesam no rosto.',
    imagem: unsplash('1614715838608-dd527c46231d'),
    alt: 'Óculos de grau com armação prateada fina sobre mesa branca',
  },
  {
    nome: 'Clássico Preto',
    rotulo: 'Grau em acetato',
    categorias: ['grau', 'masculino'],
    descricao: 'O preto que combina com tudo. Acetato encorpado e lentes em formato retangular suave.',
    imagem: unsplash('1556306510-31ca015374b0'),
    alt: 'Óculos de grau com armação preta de acetato',
  },
  {
    nome: 'Solare Redondo',
    rotulo: 'Sol em metal',
    categorias: ['sol', 'feminino'],
    descricao: 'Lentes redondas com proteção UV400 e armação dourada de inspiração setentista.',
    imagem: unsplash('1511499767150-a48a237f0083'),
    alt: 'Óculos de sol redondo com armação dourada sobre fundo branco',
  },
  {
    nome: 'Havana',
    rotulo: 'Grau em acetato',
    categorias: ['grau', 'masculino', 'feminino'],
    descricao: 'Tartaruga escuro com detalhes em preto. Um clássico que funciona em qualquer estilo.',
    imagem: unsplash('1603578119639-798b8413d8d7'),
    alt: 'Óculos de grau com armação em tons de preto e marrom',
  },
  {
    nome: 'Riviera',
    rotulo: 'Sol em acetato',
    categorias: ['sol', 'feminino'],
    descricao: 'Armação branca com lentes marrons degradê, feita para os dias mais claros.',
    imagem: unsplash('1577803645773-f96470509666'),
    alt: 'Óculos de sol com armação branca e lentes marrons',
  },
  {
    nome: 'Oficina',
    rotulo: 'Grau em acetato',
    categorias: ['grau', 'masculino'],
    descricao: 'Formato quadrado e ponte reforçada. Presença marcante sem exagero.',
    imagem: unsplash('1591076482161-42ce6da69f67'),
    alt: 'Óculos de grau preto sobre mesa de madeira',
  },
  {
    nome: 'Lume',
    rotulo: 'Grau em metal',
    categorias: ['grau', 'feminino'],
    descricao: 'Aro fino e lentes amplas, pensado para quem passa o dia em frente à tela.',
    imagem: unsplash('1646084081219-1090f72a531c'),
    alt: 'Óculos de grau de aro fino sobre superfície branca',
  },
  {
    nome: 'Primeiros Passos',
    rotulo: 'Infantil flexível',
    categorias: ['grau', 'infantil'],
    descricao: 'Armação flexível e resistente a quedas, em cores que as crianças gostam de usar.',
    imagem: unsplash('1722303165074-acba5cd2f3cd'),
    alt: 'Três armações de óculos coloridas lado a lado',
  },
];

const IMAGEM_RESERVA = 'images/placeholder.svg';

/* ---------- 3. Utilitários ---------- */

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function linkWhatsApp(mensagem = CONFIG.mensagemPadrao) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/* Avisa no console (F12) se algo da configuração estiver errado,
   em vez de deixar o site publicado com um link quebrado sem ninguém perceber. */
function validarConfig() {
  const problemas = [];
  if (!/^55\d{10,11}$/.test(CONFIG.whatsapp)) {
    problemas.push(`CONFIG.whatsapp "${CONFIG.whatsapp}" deve ter só números no formato 55 + DDD + número (12 ou 13 dígitos).`);
  }
  if (CONFIG.whatsapp === '5511999999999') {
    problemas.push('CONFIG.whatsapp ainda está com o número de exemplo.');
  }
  if (!CONFIG.instagram || CONFIG.instagram.startsWith('@')) {
    problemas.push('CONFIG.instagram deve ser o usuário sem o @.');
  }
  problemas.forEach((msg) => console.warn(`[Ótica] ${msg}`));
}

function produtoValido(produto, indice) {
  const faltando = ['nome', 'rotulo', 'descricao', 'imagem', 'alt'].filter((campo) => !produto[campo]);
  if (!Array.isArray(produto.categorias) || produto.categorias.length === 0) faltando.push('categorias');
  if (faltando.length) {
    console.warn(`[Ótica] Produto #${indice + 1} ignorado. Campos faltando: ${faltando.join(', ')}.`);
    return false;
  }
  return true;
}

/* ---------- 4. Dados da loja nos elementos da página ---------- */

function aplicarConfig() {
  $$('[data-info]').forEach((el) => {
    const valor = CONFIG[el.dataset.info];
    if (valor) el.textContent = el.dataset.info === 'instagram' ? `@${valor}` : valor;
  });

  $$('[data-tel]').forEach((el) => { el.href = `tel:${CONFIG.telefoneLink}`; });
  $$('[data-instagram]').forEach((el) => { el.href = `https://www.instagram.com/${CONFIG.instagram}`; });

  const destino = encodeURIComponent(CONFIG.buscaMapa);
  $$('[data-directions]').forEach((el) => {
    el.href = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
  });

  const mapa = $('[data-map]');
  if (mapa) mapa.src = `https://maps.google.com/maps?q=${destino}&z=16&output=embed`;

  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();
}

/* Todo elemento com data-whatsapp="mensagem" vira um link de WhatsApp com essa mensagem.
   No HTML o href aponta para #contato: se o JS falhar, o link ainda leva a algum lugar útil. */
function aplicarLinksWhatsApp(raiz = document) {
  $$('[data-whatsapp]', raiz).forEach((el) => {
    el.href = linkWhatsApp(el.dataset.whatsapp || CONFIG.mensagemPadrao);
    el.target = '_blank';
    el.rel = 'noopener';
  });
}

/* ---------- 5. Vitrine com filtros ---------- */

const lista = $('#product-list');
const avisoVazio = $('#product-empty');
const molde = $('#product-template');
const produtosValidos = PRODUTOS.filter(produtoValido);

function criarCard(produto) {
  const card = molde.content.firstElementChild.cloneNode(true);
  const img = $('img', card);

  // textContent (e não innerHTML) evita que um texto com "<" quebre o HTML
  img.src = produto.imagem;
  img.alt = produto.alt;
  $('.product-category', card).textContent = produto.rotulo;
  $('.product-name', card).textContent = produto.nome;
  $('.product-text', card).textContent = produto.descricao;

  const botao = $('.product-cta', card);
  botao.href = linkWhatsApp(`Olá! Gostaria de saber mais sobre o modelo ${produto.nome}.`);
  botao.setAttribute('aria-label', `Tenho interesse no modelo ${produto.nome}`);

  return card;
}

function renderizarVitrine(filtro = 'todos') {
  if (!lista || !molde) return;

  const selecionados = filtro === 'todos'
    ? produtosValidos
    : produtosValidos.filter((p) => p.categorias.includes(filtro));

  const fragmento = document.createDocumentFragment();
  selecionados.forEach((p) => fragmento.appendChild(criarCard(p)));
  lista.replaceChildren(fragmento);
  lista.scrollLeft = 0; // no celular, volta o carrossel para o início

  avisoVazio.hidden = selecionados.length > 0;

  $$('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', String(chip.dataset.filter === filtro));
  });
}

function iniciarFiltros() {
  $$('.chip').forEach((chip) => {
    chip.addEventListener('click', () => renderizarVitrine(chip.dataset.filter));
  });

  // Os cards de categoria filtram a vitrine e depois o link rola até ela
  $$('.category-card[data-filter]').forEach((card) => {
    card.addEventListener('click', () => renderizarVitrine(card.dataset.filter));
  });
}

/* ---------- 6. Header e menu mobile ---------- */

function iniciarHeader() {
  const header = $('.site-header');
  const botao = $('.menu-toggle');
  const nav = $('#menu');
  if (!header || !botao || !nav) return;

  const abrirMenu = (abrir) => {
    header.classList.toggle('is-open', abrir);
    document.body.classList.toggle('menu-open', abrir);
    botao.setAttribute('aria-expanded', String(abrir));
    botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  };

  botao.addEventListener('click', () => abrirMenu(!header.classList.contains('is-open')));

  // Fecha ao escolher um link
  $$('a', nav).forEach((link) => link.addEventListener('click', () => abrirMenu(false)));

  // Fecha com Esc e devolve o foco ao botão
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      abrirMenu(false);
      botao.focus();
    }
  });

  // Se a tela crescer com o menu aberto (girar o tablet), fecha
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => {
    if (e.matches) abrirMenu(false);
  });

  // Header ganha borda e encolhe ao rolar. Um "sentinela" no topo evita
  // ouvir o evento de scroll a cada pixel.
  const sentinela = document.createElement('div');
  sentinela.style.cssText = 'position:absolute;top:0;height:40px;width:1px;pointer-events:none;';
  document.body.prepend(sentinela);
  new IntersectionObserver(([entrada]) => {
    header.classList.toggle('is-scrolled', !entrada.isIntersecting);
  }).observe(sentinela);
}

/* Destaca no menu a seção que está na tela */
function iniciarMenuAtivo() {
  const links = $$('.main-nav ul a');
  const secoes = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entrada.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secoes.forEach((secao) => observador.observe(secao));
}

/* ---------- 7. Animação de entrada ---------- */

function iniciarRevelar() {
  const elementos = $$('[data-reveal]');

  if (prefereMenosMovimento || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target); // anima uma vez só
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach((el) => observador.observe(el));
}

/* ---------- 8. Imagem reserva ----------
   Se alguma foto não carregar (link quebrado, arquivo renomeado), troca por um
   desenho neutro em vez de deixar um buraco na página. */

function trocarPorReserva(img) {
  if (img.dataset.reserva) return; // evita loop se a própria reserva falhar
  img.dataset.reserva = 'true';
  img.removeAttribute('srcset');
  img.src = IMAGEM_RESERVA;
}

function iniciarImagemReserva() {
  // Captura erros de todas as imagens, inclusive as criadas depois (vitrine)
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') trocarPorReserva(e.target);
  }, true);

  // Imagens que falharam antes do script carregar
  $$('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) trocarPorReserva(img);
  });
}

/* ---------- Início ---------- */

document.addEventListener('DOMContentLoaded', () => {
  validarConfig();
  iniciarImagemReserva();
  aplicarConfig();
  renderizarVitrine();
  aplicarLinksWhatsApp();
  iniciarFiltros();
  iniciarHeader();
  iniciarMenuAtivo();
  iniciarRevelar();
});
