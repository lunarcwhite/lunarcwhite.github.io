// BAE lightbox: klik gambar gallery/thumbs/diagram -> modal + zoom. No dependencies.
(function () {
  var MIN = 1, MAX = 4, list = [], idx = 0, scale = 1, tx = 0, ty = 0;
  var dlg, img, cap, zin;

  function apply() {
    img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    zin.textContent = Math.round(scale * 100) + '%';
    img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }
  function show(i) {
    idx = (i + list.length) % list.length;
    img.src = list[idx].src;
    img.alt = list[idx].alt || '';
    cap.textContent = list[idx].alt || '';
    scale = 1; tx = 0; ty = 0;
    apply();
  }
  function open(i) { show(i); if (!dlg.open) dlg.showModal(); }
  function zoom(f) { scale = Math.min(MAX, Math.max(MIN, scale * f)); if (scale === 1) { tx = 0; ty = 0; } apply(); }

  document.addEventListener('DOMContentLoaded', function () {
    list = Array.prototype.slice.call(
      document.querySelectorAll('.gallery img, .thumbs img, .diagram-strip img'));
    if (!list.length || typeof HTMLDialogElement === 'undefined') return;

    dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML =
      '<div class="lb-bar"><span class="lb-cap"></span>' +
      '<span class="lb-zoom">100%</span>' +
      '<button class="lb-btn" data-z="in" aria-label="Zoom in">+</button>' +
      '<button class="lb-btn" data-z="out" aria-label="Zoom out">&minus;</button>' +
      '<button class="lb-btn" data-z="reset" aria-label="Reset">1:1</button>' +
      '<button class="lb-btn lb-x" aria-label="Close">&times;</button></div>' +
      '<div class="lb-stage"><img alt=""><button class="lb-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lb-next" aria-label="Next">&#8250;</button></div>';
    document.body.appendChild(dlg);
    img = dlg.querySelector('.lb-stage img');
    cap = dlg.querySelector('.lb-cap');
    zin = dlg.querySelector('.lb-zoom');

    list.forEach(function (el, i) {
      el.tabIndex = 0;
      el.addEventListener('click', function () { open(i); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    dlg.addEventListener('click', function (e) {
      var z = e.target.closest('[data-z]');
      if (z) {
        zoom(z.dataset.z === 'in' ? 1.4 : z.dataset.z === 'out' ? 1 / 1.4 : 0);
        if (z.dataset.z === 'reset') { scale = 1; tx = 0; ty = 0; apply(); }
        return;
      }
      if (e.target.closest('.lb-x')) { dlg.close(); return; }
      if (e.target.closest('.lb-prev')) { show(idx - 1); return; }
      if (e.target.closest('.lb-next')) { show(idx + 1); return; }
      if (e.target === dlg) dlg.close(); // backdrop click
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    img.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 1.2 : 1 / 1.2);
    }, { passive: false });
    img.addEventListener('dblclick', function () {
      scale = scale === 1 ? 2.5 : 1; tx = 0; ty = 0; apply();
    });
    // drag to pan saat zoom
    var sx, sy, drag = false;
    img.addEventListener('pointerdown', function (e) {
      if (scale === 1) return;
      drag = true; sx = e.clientX - tx; sy = e.clientY - ty;
      img.setPointerCapture(e.pointerId);
      img.style.cursor = 'grabbing';
    });
    img.addEventListener('pointermove', function (e) {
      if (drag) { tx = e.clientX - sx; ty = e.clientY - sy; apply(); }
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      img.addEventListener(ev, function () { drag = false; apply(); });
    });
  });
})();
