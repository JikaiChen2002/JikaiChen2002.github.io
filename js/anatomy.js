// 阑尾位置图解：悬停/点击器官显示名称；切换阑尾的几种常见位置
(function () {
  "use strict";

  // 每种位置：路径、是否在肠管后方（虚线）、比例、描述
  var POS = {
    retro:  { d: "M140 196 C150 170 120 150 112 122 C106 98 108 74 118 54",  behind: true,  pct: "65%",  text: "Behind the caecum. The most common position." },
    pelvic: { d: "M140 196 C150 206 160 214 172 222 C184 230 196 238 206 248", behind: false, pct: "31%",  text: "Hanging down over the brim of the pelvis." },
    sub:    { d: "M140 196 C139 206 137 216 135 226 C133 236 131 246 129 254", behind: false, pct: "2%",   text: "Pointing straight down, below the caecum." },
    pre:    { d: "M140 196 C154 190 166 180 176 166 C188 150 200 128 212 108", behind: false, pct: "1%",   text: "In front of the last part of the small intestine." },
    post:   { d: "M140 196 C158 188 176 176 192 158 C206 142 220 122 232 104", behind: true,  pct: "0.4%", text: "Behind the last part of the small intestine." }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("anat");
    if (!root) return;

    // 器官名称
    var nameEl = root.querySelector(".anat-name");
    var defaultName = nameEl.textContent;
    var organs = root.querySelectorAll(".organ");
    function show(el) {
      organs.forEach(function (o) { o.classList.toggle("is-active", o === el); });
      nameEl.textContent = el ? el.getAttribute("data-name") : defaultName;
      root.querySelector(".anat-body svg").classList.toggle("has-active", !!el);
    }
    organs.forEach(function (o) {
      o.addEventListener("mouseenter", function () { show(o); });
      o.addEventListener("focus", function () { show(o); });
      o.addEventListener("click", function () { show(o); });
      o.addEventListener("mouseleave", function () { show(null); });
      o.addEventListener("blur", function () { show(null); });
    });

    // 阑尾位置切换
    var appx = document.getElementById("z-appx");
    var desc = root.querySelector(".appx-desc");
    var buttons = root.querySelectorAll("[data-pos]");
    function setPos(key) {
      var p = POS[key];
      appx.setAttribute("d", p.d);
      appx.classList.toggle("is-behind", p.behind);
      desc.innerHTML = "<strong>" + p.pct + "</strong> " + p.text;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-pos") === key)); });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () { setPos(b.getAttribute("data-pos")); });
    });
    setPos("retro");
  });
})();
