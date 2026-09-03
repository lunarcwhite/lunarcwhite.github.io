// BAE lightbox: klik gambar -> modal besar + zoom + geser. No dependencies.
// Pakai transform scale + translate (standar, jalan di semua browser).
// - tombol + / − / 1:1, wheel, double-click / double-tap, pinch (2 jari)
// - seret mouse / 1 jari untuk menggeser hasil zoom; usap saat 1x = pindah gambar
(function () {
  var MIN = 1, MAX = 4, list = [], idx = 0, scale = 1, tx = 0, ty = 0;
  var ov, stage, img, cap, zin, count;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  // Batas geser: jangan sampai gambar lepas dari stage
  function clampPan() {
    if (scale <= 1) { tx = 0; ty = 0; return; }
    var sr = stage.getBoundingClientRect();
    var w = img.clientWidth * scale, h = img.clientHeight * scale;
    var mx = Math.max(0, (w - sr.width) / 2), my = Math.max(0, (h - sr.height) / 2);
    tx = clamp(tx, -mx, mx);
    ty = clamp(ty, -my, my);
  }

  function apply() {
    img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    zin.textContent = Math.round(scale * 100) + '%';
    ov.classList.toggle('is-zoomed', scale > 1);
  }

  function show(i) {
    idx = (i + list.length) % list.length;
    var el = list[idx];
    img.src = el.currentSrc || el.src;
    img.alt = el.alt || '';
    cap.textContent = el.alt || '';
    count.textContent = (idx + 1) + ' / ' + list.length;
    scale = 1; tx = 0; ty = 0;
    apply();
  }

  function open(i) {
    show(i);
    ov.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    ov.hidden = true;
    document.body.style.overflow = '';
  }
  function zoomBy(f) {
    var ns = clamp(scale * f, MIN, MAX);
    if (ns === scale) return;
    scale = ns;
    clampPan();
    apply();
  }
  function zoomReset() { scale = 1; tx = 0; ty = 0; apply(); }
  function toggleZoom() { scale === 1 ? zoomBy(2.5) : zoomReset(); }

  document.addEventListener('DOMContentLoaded', function () {
    // Semua gambar konten bisa diklik; logo dikecualikan.
    list = Array.prototype.slice.call(document.querySelectorAll(
      '.gallery img, .thumbs img, .diagram-strip img, .prod-head img.main, .card img'));
    if (!list.length) return;

    ov = document.createElement('div');
    ov.className = 'lb-overlay';
    ov.hidden = true;
    ov.innerHTML =
      '<div class="lb-bar"><span class="lb-count"></span>' +
      '<span class="lb-cap"></span>' +
      '<span class="lb-zoom">100%</span>' +
      '<button class="lb-btn" data-z="in" aria-label="Zoom in">+</button>' +
      '<button class="lb-btn" data-z="out" aria-label="Zoom out">&minus;</button>' +
      '<button class="lb-btn" data-z="reset" aria-label="Reset">1:1</button>' +
      '<button class="lb-btn lb-x" aria-label="Close">&times;</button></div>' +
      '<div class="lb-stage"><img alt="" draggable="false">' +
      '<button class="lb-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lb-next" aria-label="Next">&#8250;</button></div>' +
      '<div class="lb-foot">Klik latar untuk tutup &middot; scroll / double-click untuk zoom &middot; seret untuk geser</div>';
    document.body.appendChild(ov);
    stage = ov.querySelector('.lb-stage');
    img = ov.querySelector('.lb-stage img');
    cap = ov.querySelector('.lb-cap');
    zin = ov.querySelector('.lb-zoom');
    count = ov.querySelector('.lb-count');

    list.forEach(function (el, i) {
      el.tabIndex = 0;
      el.addEventListener('click', function () { open(i); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    // Toolbar + navigasi (event delegation)
    ov.addEventListener('click', function (e) {
      var z = e.target.closest('[data-z]');
      if (z) {
        if (z.dataset.z === 'in') zoomBy(1.4);
        else if (z.dataset.z === 'out') zoomBy(1 / 1.4);
        else zoomReset();
        return;
      }
      if (e.target.closest('.lb-x')) { close(); return; }
      if (e.target.closest('.lb-prev')) { show(idx - 1); return; }
      if (e.target.closest('.lb-next')) { show(idx + 1); return; }
      if (e.target === stage) close(); // klik latar = tutup
    });
    img.addEventListener('dblclick', function (e) { e.preventDefault(); toggleZoom(); });

    // Wheel = zoom (seperti galeri pada umumnya)
    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.2 : 1 / 1.2);
    }, { passive: false });

    // Seret mouse / sentuh 1 jari = geser; cubit 2 jari = zoom.
    // Usap horizontal saat belum zoom = pindah gambar.
    var pts = {}, pinchD = 0, pinchS = 1, moved = 0, sx = 0, sy = 0, stx = 0, sty = 0, sx1 = 0, onImg = false;
    function pdist() {
      var k = Object.keys(pts);
      return Math.hypot(pts[k[0]].x - pts[k[1]].x, pts[k[0]].y - pts[k[1]].y);
    }
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.lb-prev,.lb-next')) return; // tombol nav: jangan ikut gesture
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var k = Object.keys(pts);
      if (k.length === 2) { pinchD = pdist(); pinchS = scale; }
      else { moved = 0; onImg = (e.target === img); sx = e.clientX; sy = e.clientY; stx = tx; sty = ty; sx1 = e.clientX; }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var k = Object.keys(pts);
      if (k.length === 2 && pinchD > 0) {
        scale = clamp(pinchS * pdist() / pinchD, MIN, MAX);
        clampPan(); apply(); moved = 99;
      } else if (k.length === 1 && onImg) {
        var dx = e.clientX - sx, dy = e.clientY - sy;
        moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
        if (scale > 1) { tx = stx + dx; ty = sty + dy; clampPan(); apply(); }
      }
    });
    function endPointer(e) {
      var k = Object.keys(pts);
      var wasSingle = k.length === 1;
      delete pts[e.pointerId];
      if (wasSingle && Object.keys(pts).length === 0) {
        // Usap saat 1x = prev/next; tap tanpa gerak diabaikan (dblclick yang handle zoom)
        if (scale === 1 && onImg && moved > 70) {
          (e.clientX < sx1 ? show(idx + 1) : show(idx - 1));
        }
        pinchD = 0; moved = 0; onImg = false;
      }
      if (Object.keys(pts).length < 2) pinchD = 0;
    }
    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);

    document.addEventListener('keydown', function (e) {
      if (ov.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === '+' || e.key === '=') zoomBy(1.4);
      else if (e.key === '-' || e.key === '_') zoomBy(1 / 1.4);
      else if (e.key === '0') zoomReset();
    });
  });
})();
