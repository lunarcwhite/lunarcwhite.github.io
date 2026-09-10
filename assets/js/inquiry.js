// BAE inquiry: form tanpa backend -> link WA prefill. No dependencies.
// Isi data-en + data-id di <option> agar ikut bahasa aktif; pola sama seperti lang.js.
// ponytail: ganti form WP sungguhan saat migrasi Fase 1; ceiling = prefill WA, upgrade = plugin form + event GA4.
(function () {
  var WA = 'https://wa.me/6281122865666?text=';
  function lang() {
    // Halaman en/ statis: kunci via <body data-page-lang="en"> (lang.js menimpa <html lang> dari localStorage).
    if (document.body && document.body.dataset.pageLang) return document.body.dataset.pageLang;
    return document.documentElement.lang === 'en' ? 'en' : 'id';
  }
  function topic(box) {
    return lang() === 'en' ? (box.dataset.topicEn || box.dataset.topicId) : box.dataset.topicId;
  }
  // Placeholder bilingual: <input data-ph-id="..." data-ph-en="..."> (lang.js tak mencakup atribut)
  function localize(box) {
    var l = lang();
    box.querySelectorAll('[data-ph-id]').forEach(function (el) {
      el.placeholder = l === 'en' ? (el.dataset.phEn || el.dataset.phId) : el.dataset.phId;
    });
  }
  function wire(box) {
    var pop = box.querySelector('[data-q="pop"]');
    var lahan = box.querySelector('[data-q="lahan"]');
    var tipe = box.querySelector('[data-q="tipe"]');
    var link = box.querySelector('[data-q="send"]');
    if (!pop || !lahan || !tipe || !link) return;
    function update() {
      var t = lang() === 'en'
        ? 'Hello BAE, I\'m viewing ' + document.title + ', asking about ' + topic(box)
          + '. Flock size: ' + pop.value + '. House size: ' + lahan.value + '. Type: ' + tipe.options[tipe.selectedIndex].text
        : 'Halo BAE, saya dari ' + document.title + ', ingin tanya tentang ' + topic(box)
          + '. Populasi: ' + pop.value + '. Lahan: ' + lahan.value + '. Tipe: ' + tipe.options[tipe.selectedIndex].text;
      link.href = WA + encodeURIComponent(t);
    }
    ['input', 'change'].forEach(function (ev) { box.addEventListener(ev, update); });
    document.addEventListener('bae:lang', function () { localize(box); update(); });
    localize(box);
    update();
  }
  // Link WA per produk: <a data-wa data-wa-id="..." data-wa-en="..."> ikut bahasa aktif.
  function wireWaLink(a) {
    function update() {
      var t = lang() === 'en' ? a.dataset.waEn : a.dataset.waId;
      if (t) a.href = WA + encodeURIComponent(t);
    }
    document.addEventListener('bae:lang', update);
    update();
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-inquiry]').forEach(wire);
    document.querySelectorAll('a[data-wa]').forEach(wireWaLink);
  });
})();
