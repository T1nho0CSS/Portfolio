
(function () {
  var salvo = null;
  try { salvo = localStorage.getItem('tema'); } catch (e) {}
  var sistemaEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var tema = salvo || (sistemaEscuro ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', tema);
})();


document.addEventListener('DOMContentLoaded', function () {
  var raiz = document.documentElement;
  var botao = document.getElementById('tema');
  if (!botao) return;

  function atualizarBotao() {
    var escuro = raiz.getAttribute('data-theme') === 'dark';
    botao.textContent = escuro ? '☀️' : '🌙';
    botao.setAttribute('aria-label', escuro ? 'Ativar modo claro' : 'Ativar modo escuro');
  }

  botao.addEventListener('click', function () {
    var novo = raiz.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    raiz.setAttribute('data-theme', novo);
    try { localStorage.setItem('tema', novo); } catch (e) {}
    atualizarBotao();
  });

  atualizarBotao();
});