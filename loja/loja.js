// Jogos pagos são fictícios. Valorant e Fortnite aparecem só como exemplo de jogos gratuitos.
const jogos = [
  {id:1, titulo:'Valorant',            genero:'Tiro',       plat:'PC',           preco:0,     c1:'#FF4D5E', c2:'#2B0A3D', forma:'diagonal'},
  {id:2, titulo:'Cyberpunk',            genero:'Ação',       plat:'PC e consoles',preco:249.9,     c1:'#4D7CFF', c2:'#8B2BFF', forma:'circulo'},
  {id:3, titulo:'Hogwarts Legacy',    genero:'Ação',       plat:'PC e consoles',preco:129.9, c1:'#ada9ab', c2:'#0F1020', forma:'grade'},
  {id:4, titulo:'Clash Royale',      genero:'RPG',        plat:'PC',           preco:0,  c1:'#4f429e', c2:'#1B1146', forma:'triangulo'},
  {id:5, titulo:'Need For Speed',   genero:'Corrida',    plat:'PC e consoles',preco:99.9,  c1:'#FF9F1C', c2:'#3A1C00', forma:'diagonal'},
  {id:6, titulo:'Stardew Valley',genero:'Disciplina',plat:'PC',           preco:39.9,  c1:'#1FB58F', c2:'#06241D', forma:'grade'},
  {id:7, titulo:'Fortnite',     genero:'Estratégia',  plat:'PC e consoles',preco:0,  c1:'#11a1c5', c2:'#0b576e', forma:'circulo'},
  {id:8, titulo:'Mortal Kombat',      genero:'Luta', plat:'PC e consoles',preco:69.9,  c1:'#d84a4a', c2:'#3B2F00', forma:'triangulo'}
];

const $ = (s) => document.querySelector(s);
const moeda = (v) => v === 0 ? 'Grátis' : v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
let filtro = 'Todos', texto = '';
const carrinho = new Set();

// Capa gerada em SVG (sem imagens externas e sem arte oficial)
function capa(j, id) {
  const f = {
    diagonal:  `<polygon points="0,150 200,60 200,120 0,210" fill="#fff" fill-opacity=".14"/>`,
    circulo:   `<circle cx="140" cy="80" r="70" fill="#fff" fill-opacity=".14"/><circle cx="140" cy="80" r="34" fill="#fff" fill-opacity=".14"/>`,
    grade:     [0,1,2,3,4].map(i => [0,1,2].map(k => `<rect x="${20+i*36}" y="${24+k*36}" width="26" height="26" fill="#fff" fill-opacity="${(i+k)%2?.18:.07}"/>`).join('')).join(''),
    triangulo: `<polygon points="100,20 190,170 10,170" fill="#fff" fill-opacity=".14"/>`
  }[j.forma];
  const p = j.titulo.split(' ');
  const m = p.length > 1 ? Math.ceil(p.length / 2) : 1;
  const l1 = p.slice(0, m).join(' '), l2 = p.slice(m).join(' ');
  const fs = Math.max(l1.length, l2.length) > 11 ? 17 : 22;
  return `<svg viewBox="0 0 200 260" role="img" aria-label="Capa de ${j.titulo}">
    <defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${j.c1}"/><stop offset="1" stop-color="${j.c2}"/></linearGradient></defs>
    <rect width="200" height="260" fill="url(#g${id})"/>${f}
    <rect y="190" width="200" height="70" fill="#000" fill-opacity=".45"/>
    <text x="14" y="${l2 ? 216 : 228}" fill="#fff" font-family="Chakra Petch,sans-serif" font-weight="700" font-size="${fs}">${l1}</text>
    ${l2 ? `<text x="14" y="240" fill="#fff" font-family="Chakra Petch,sans-serif" font-weight="700" font-size="${fs}">${l2}</text>` : ''}
  </svg>`;
}

function desenharFiltros() {
  const cats = ['Todos', 'Grátis', ...new Set(jogos.map(j => j.genero))];
  $('#filtros').innerHTML = cats.map(c =>
    `<button type="button" data-g="${c}" aria-pressed="${c === filtro}">${c}</button>`).join('');
}

function desenharGrade() {
  const lista = jogos.filter(j =>
    (filtro === 'Todos' || (filtro === 'Grátis' ? j.preco === 0 : j.genero === filtro)) &&
    j.titulo.toLowerCase().includes(texto));
  $('#vazio').hidden = lista.length > 0;
  $('#grade').innerHTML = lista.map(j => {
    const no = carrinho.has(j.id);
    const rotulo = no ? 'Adicionado' : (j.preco === 0 ? 'Adicionar à lista' : 'Adicionar ao carrinho');
    return `<article class="card">${capa(j, j.id)}
      <div class="info">
        <h3>${j.titulo}</h3>
        <span class="meta">${j.genero} · ${j.plat}</span>
        <span class="preco ${j.preco === 0 ? 'gratis' : ''}">${moeda(j.preco)}</span>
        <button type="button" data-id="${j.id}" aria-pressed="${no}">${rotulo}</button>
      </div></article>`;
  }).join('');
}

function desenharCarrinho() {
  const itens = jogos.filter(j => carrinho.has(j.id));
  const total = itens.reduce((s, j) => s + j.preco, 0);
  $('#qtd').textContent = itens.length;
  $('#total').textContent = total === 0 ? 'R$ 0,00' : moeda(total);
  $('#itens').innerHTML = itens.length
    ? itens.map(j => `<li><span>${j.titulo}<small>${moeda(j.preco)}</small></span><button type="button" data-rm="${j.id}">Remover</button></li>`).join('')
    : '<li class="vazio">Nenhum jogo por aqui ainda.</li>';
  const msg = 'Oi! Quero estes jogos:\n' + itens.map(j => `- ${j.titulo} (${moeda(j.preco)})`).join('\n') + `\nTotal: ${$('#total').textContent}`;
  const zap = $('#zap');
  zap.href = itens.length ? `https://wa.me/5518999999999?text=${encodeURIComponent(msg)}` : '#';
  zap.setAttribute('aria-disabled', itens.length ? 'false' : 'true');
}

function abrirCarrinho(abrir) {
  $('#carrinho').classList.toggle('aberto', abrir);
  $('#carrinho').setAttribute('aria-hidden', String(!abrir));
  $('#btn-carrinho').setAttribute('aria-expanded', String(abrir));
  (abrir ? $('#fechar') : $('#btn-carrinho')).focus();
}
function fecharMenu() { $('#menu').classList.remove('aberto'); $('#btn-menu').setAttribute('aria-expanded', 'false'); }
function aplicarFiltro(f) { filtro = f; desenharFiltros(); desenharGrade(); }

// Tema claro/escuro
const CHAVE_TEMA = 'fase-extra-tema';
const raiz = document.documentElement;
let fimTroca;
function aplicarTema(t, salvar, animar) {
  const claro = t === 'light';
  if (animar) {
    raiz.classList.add('trocando');
    clearTimeout(fimTroca);
    fimTroca = setTimeout(() => raiz.classList.remove('trocando'), 600);
  }
  raiz.setAttribute('data-tema', claro ? 'light' : 'dark');
  $('#btn-tema').setAttribute('aria-label', claro ? 'Mudar para o modo escuro' : 'Mudar para o modo claro');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = claro ? '#F5F6FF' : '#0F1020';
  if (salvar) { try { localStorage.setItem(CHAVE_TEMA, claro ? 'light' : 'dark'); } catch (e) {} }
}
$('#btn-tema').addEventListener('click', () => {
  aplicarTema(raiz.getAttribute('data-tema') === 'light' ? 'dark' : 'light', true, true);
});
// Se a pessoa nunca escolheu, acompanha o tema do aparelho
if (window.matchMedia) {
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let guardado = null;
    try { guardado = localStorage.getItem(CHAVE_TEMA); } catch (err) {}
    if (!guardado) aplicarTema(e.matches ? 'light' : 'dark', false, true);
  });
}
aplicarTema(raiz.getAttribute('data-tema'), false);

$('#filtros').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) aplicarFiltro(b.dataset.g); });
$('#busca').addEventListener('input', (e) => { texto = e.target.value.trim().toLowerCase(); desenharGrade(); });
$('#so-gratis').addEventListener('click', () => { aplicarFiltro('Grátis'); $('#catalogo').scrollIntoView({behavior:'smooth'}); });
$('#grade').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const id = Number(b.dataset.id);
  carrinho.has(id) ? carrinho.delete(id) : carrinho.add(id);
  desenharGrade(); desenharCarrinho();
});
$('#itens').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  carrinho.delete(Number(b.dataset.rm)); desenharGrade(); desenharCarrinho();
});
$('#btn-carrinho').addEventListener('click', () => abrirCarrinho(true));
$('#fechar').addEventListener('click', () => abrirCarrinho(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { abrirCarrinho(false); fecharMenu(); } });
$('#btn-menu').addEventListener('click', () => {
  const aberto = $('#menu').classList.toggle('aberto');
  $('#btn-menu').setAttribute('aria-expanded', String(aberto));
});
$('#menu').addEventListener('click', (e) => { if (e.target.tagName === 'A') fecharMenu(); });

$('#pilha').innerHTML = [jogos[2], jogos[0], jogos[3]].map((j, i) => capa(j, 'h' + i)).join('');
$('#ano').textContent = new Date().getFullYear();
desenharFiltros(); desenharGrade(); desenharCarrinho();