/* Property map: drag to move; once the map is selected, scroll or pinch to zoom. */
(function () {
  var map = document.querySelector('.map');
  if (!map) return;
  var img = map.querySelector('img');
  var controls = map.querySelector('.map-controls');
  var ratio = img.getAttribute('height') / img.getAttribute('width');
  var MAX_ZOOM = 8;
  var zoom = 1, x = 0, y = 0;  // zoom relative to the fitted size, and the image's offset in px
  var pointers = new Map();    // mouse, pen or fingers currently down, by id
  var last = null;             // their previous centre and spread
  var width = map.clientWidth;

  function draw() {
    var w = map.clientWidth * zoom;
    x = Math.min(0, Math.max(map.clientWidth - w, x));
    y = Math.min(0, Math.max(map.clientHeight - w * ratio, y));
    img.style.width = w + 'px';
    img.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    map.style.touchAction = zoom > 1 ? 'none' : 'pan-y';
  }

  // Zoom by factor, keeping the point (px, py) of the map where it is.
  function zoomAt(factor, px, py) {
    var next = Math.min(MAX_ZOOM, Math.max(1, zoom * factor));
    x = px - (px - x) * next / zoom;
    y = py - (py - y) * next / zoom;
    zoom = next;
    draw();
  }

  function zoomCentre(factor) {
    zoomAt(factor, map.clientWidth / 2, map.clientHeight / 2);
  }

  function reset() {
    zoom = 1;
    x = y = 0;
    draw();
  }

  function local(e) {
    var r = map.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function spread() {
    var pts = Array.from(pointers.values());
    var cx = 0, cy = 0;
    pts.forEach(function (p) { cx += p.x / pts.length; cy += p.y / pts.length; });
    var d = pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0;
    return { x: cx, y: cy, d: d };
  }

  map.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    map.focus({ preventScroll: true });
    map.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, local(e));
    last = spread();
  });

  map.addEventListener('pointermove', function (e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, local(e));
    var now = spread();
    if (last.d && now.d) zoomAt(now.d / last.d, now.x, now.y);  // pinch
    x += now.x - last.x;
    y += now.y - last.y;
    draw();
    last = now;
  });

  function lift(e) {
    pointers.delete(e.pointerId);
    last = pointers.size ? spread() : null;
  }
  map.addEventListener('pointerup', lift);
  map.addEventListener('pointercancel', lift);

  map.addEventListener('wheel', function (e) {
    if (!map.contains(document.activeElement)) return;  // until the map is selected, let the page scroll
    e.preventDefault();
    var p = local(e);
    var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAt(Math.exp(-dy * 0.0015), p.x, p.y);
  }, { passive: false });

  map.addEventListener('dblclick', function (e) {
    if (e.target.closest('button')) return;
    var p = local(e);
    zoomAt(2, p.x, p.y);
  });

  map.addEventListener('keydown', function (e) {
    var step = 60;
    var keys = {
      '+': function () { zoomCentre(1.5); },
      '=': function () { zoomCentre(1.5); },
      '-': function () { zoomCentre(1 / 1.5); },
      '0': reset,
      ArrowLeft: function () { x += step; draw(); },
      ArrowRight: function () { x -= step; draw(); },
      ArrowUp: function () { y += step; draw(); },
      ArrowDown: function () { y -= step; draw(); }
    };
    if (keys[e.key] && e.target === map) {
      e.preventDefault();
      keys[e.key]();
    }
  });

  controls.addEventListener('click', function (e) {
    var button = e.target.closest('button');
    if (!button) return;
    if (button.value === 'in') zoomCentre(1.5);
    else if (button.value === 'out') zoomCentre(1 / 1.5);
    else reset();
  });

  window.addEventListener('resize', function () {
    x *= map.clientWidth / width;
    y *= map.clientWidth / width;
    width = map.clientWidth;
    draw();
  });

  img.addEventListener('dragstart', function (e) { e.preventDefault(); });
  controls.hidden = false;
  draw();
})();
