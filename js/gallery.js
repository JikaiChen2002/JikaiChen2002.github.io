// 根据 life-data.js 生成旅行页、美食页，以及点击放大的照片查看器
(function () {
  "use strict";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // ---------- 照片查看器 ----------
  var box, boxImg, boxCap, list = [], idx = 0;
  function buildBox() {
    box = el("dialog", "lightbox");
    box.setAttribute("aria-label", "Photo viewer");
    var fig = el("figure");
    boxImg = el("img");
    boxCap = el("figcaption");
    fig.appendChild(boxImg); fig.appendChild(boxCap);
    var close = el("button", "lb-close", "×"); close.type = "button"; close.setAttribute("aria-label", "Close");
    var prev = el("button", "lb-nav lb-prev", "‹"); prev.type = "button"; prev.setAttribute("aria-label", "Previous photo");
    var next = el("button", "lb-nav lb-next", "›"); next.type = "button"; next.setAttribute("aria-label", "Next photo");
    box.appendChild(fig); box.appendChild(close); box.appendChild(prev); box.appendChild(next);
    document.body.appendChild(box);
    close.addEventListener("click", function () { box.close(); });
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
  }
  function render() {
    var p = list[idx];
    boxImg.src = p.src; boxImg.alt = p.caption || "";
    boxCap.textContent = p.caption || "";
    box.classList.toggle("single", list.length < 2);
  }
  function go(d) { idx = (idx + d + list.length) % list.length; render(); }
  function open(items, i) {
    if (!box) buildBox();
    list = items; idx = i; render();
    if (box.showModal) box.showModal(); else window.open(items[i].src);
  }

  function thumb(items, i, cls) {
    var b = el("button", cls);
    b.type = "button";
    var img = el("img");
    img.src = items[i].src; img.alt = items[i].caption || ""; img.loading = "lazy";
    b.appendChild(img);
    b.addEventListener("click", function () { open(items, i); });
    return b;
  }

  // ---------- 旅行页 ----------
  function travel() {
    var root = document.getElementById("places");
    if (!root || !window.SITE_TRAVEL) return;
    var data = window.SITE_TRAVEL;

    data.forEach(function (p) {
      var sec = el("section", "place");
      var head = el("div", "place-head");
      var h = el("h2", "place-name", p.place);
      var c = el("span", "place-country", p.country);
      h.appendChild(c);
      head.appendChild(h);
      if (p.lived) head.appendChild(el("span", "place-tag", "Lived here"));
      sec.appendChild(head);
      if (p.note) sec.appendChild(el("p", "place-note", p.note));
      if (p.photos && p.photos.length) {
        var grid = el("div", "photo-grid");
        p.photos.forEach(function (_, i) { grid.appendChild(thumb(p.photos, i, "photo")); });
        sec.appendChild(grid);
      }
      root.appendChild(sec);
    });

    // 地图（需要联网加载 Leaflet；加载失败时隐藏地图，不影响其他内容）
    var mapEl = document.getElementById("travel-map");
    if (!mapEl) return;
    if (!window.L) { mapEl.parentNode.style.display = "none"; return; }
    var dark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var map = L.map(mapEl, { scrollWheelZoom: false, worldCopyJump: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/" + (dark ? "dark_all" : "light_all") + "/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd", maxZoom: 18
    }).addTo(map);
    var accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#5b2d8e";
    var pts = [];
    data.forEach(function (p) {
      pts.push([p.lat, p.lng]);
      L.circleMarker([p.lat, p.lng], {
        radius: p.lived ? 8 : 6, color: accent, weight: 2,
        fillColor: accent, fillOpacity: p.lived ? 0.9 : 0.15
      }).addTo(map).bindTooltip(p.place + ", " + p.country);
    });
    if (pts.length === 1) map.setView(pts[0], 6);
    else map.fitBounds(pts, { padding: [40, 40] });
  }

  // ---------- 美食页 ----------
  function food() {
    var root = document.getElementById("food-grid");
    if (!root || !window.SITE_FOOD) return;
    var data = window.SITE_FOOD;
    var items = data.map(function (f) {
      return { src: f.src, caption: f.dish + (f.where ? " · " + f.where : "") };
    });
    data.forEach(function (f, i) {
      var card = el("article", "dish");
      card.appendChild(thumb(items, i, "photo"));
      card.appendChild(el("h2", "dish-name", f.dish));
      if (f.where) card.appendChild(el("p", "dish-where", f.where));
      if (f.note) card.appendChild(el("p", "dish-note", f.note));
      root.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", function () { travel(); food(); });
})();
