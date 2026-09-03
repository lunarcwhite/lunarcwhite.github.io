// BAE lightbox: klik gambar gallery/thumbs/diagram -> modal + zoom. No dependencies.
// Zoom (tombol/wheel/cubit/dblclick) mengubah ukuran gambar itu sendiri
// (properti zoom = layout ikut membesar, dialog bisa scroll), bukan transform.
(function () {
  var MIN = 1, MAX = 4, list = [], idx = 0, scale = 1;
  var dlg, img, cap, zin;

  function apply() {
    img.style.zoom = scale;
    zin.textContent = Math.round(scale * 100) + '%';
    img.style.cursor = scale > 1 ? 'zoom-out' : 'zoom-in';
  }
  function show(i) {
    idx = (i + list.length) % list.length;
    img.src = list[idx].src;
    img.alt = list[idx].alt || '';
    cap.textContent = list[idx].alt || '';
    scale = 1;
    apply();
    dlg.scrollTop = 0; dlg.scrollLeft = 0;
  }
  function open(i) { show(i); if (!dlg.open) dlg.showModal(); }
  function zoom(f) { scale = Math.min(MAX, Math.max(MIN, scale * f)); apply(); }

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
        if (z.dataset.z === 'reset') { scale = 1; apply(); }
        return;
      }
      if (e.target === img) { // klik gambar: perbesar, klik lagi: kembali
        if (scale === 1) { scale = 2.5; } else { scale = 1; }
        apply();
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
    // pinch dua jari (touch): cubit = gambar membesar/mengecil di tempat
    var pinchD = 0, pinchS = 1;
    function pinchDist(e) {
      return Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY);
    }
    var stage = dlg.querySelector('.lb-stage');
    [stage, img].forEach(function (t) {
      t.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          pinchD = pinchDist(e); pinchS = scale;
        }
      }, { passive: false });
      t.addEventListener('touchmove', function (e) {
        if (e.touches.length === 2 && pinchD > 0) {
          e.preventDefault();
          scale = Math.min(MAX, Math.max(MIN, pinchS * pinchDist(e) / pinchD));
          apply();
        }
      }, { passive: false });
      t.addEventListener('touchend', function (e) {
        if (e.touches.length < 2) pinchD = 0;
      });
    });
  });
})();
