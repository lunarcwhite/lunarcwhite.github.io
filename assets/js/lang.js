// BAE language toggle (ID <-> EN) + mobile menu. No dependencies.
// Usage: any element with data-en="English text" swaps its text; original HTML = Indonesian.
(function () {
  var KEY = 'bae-lang';
  function apply(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.dataset.id) el.dataset.id = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.id;
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'id';
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  var saved = 'id';
  try { saved = localStorage.getItem(KEY) || 'id'; } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    apply(saved);
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { apply(b.dataset.lang); });
    });
    var burger = document.querySelector('.burger');
    var links = document.querySelector('nav.links');
    if (burger && links) burger.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  });
})();
