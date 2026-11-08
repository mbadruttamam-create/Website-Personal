(function () {
  "use strict";

  var root = document.documentElement;

  function applyLang(lang) {
    if (lang !== "en") lang = "id";
    root.setAttribute("lang", lang);
    var dict = window.I18N || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var entry = dict[key];
      if (entry && entry[lang]) el.innerHTML = entry[lang];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr").split(":");
      var attr = spec[0], key = spec[1];
      var entry = dict[key];
      if (entry && entry[lang]) el.setAttribute(attr, entry[lang]);
    });
    document.querySelectorAll(".opt-lang").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    document.querySelectorAll(".lang-code").forEach(function (n) { n.textContent = lang.toUpperCase(); });
    try { localStorage.setItem("mbt-lang", lang); } catch (e) {}
  }

  function getSaved(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? v : fallback;
    } catch (e) { return fallback; }
  }

  function ensureLightbox() {
    var el = document.getElementById("lightboxOverlay");
    if (el) return el;
    el = document.createElement("div");
    el.className = "lightbox-overlay";
    el.id = "lightboxOverlay";
    el.innerHTML =
      '<button class="lightbox-close" id="lightboxClose" aria-label="Tutup">✕</button>' +
      '<img id="lightboxImg" src="" alt="">' +
      '<div class="lightbox-caption" id="lightboxCaption"></div>';
    document.body.appendChild(el);
    return el;
  }

  function openLightbox(src, alt) {
    var overlay = ensureLightbox();
    var img = document.getElementById("lightboxImg");
    var cap = document.getElementById("lightboxCaption");
    img.src = src;
    img.alt = alt || "";
    cap.textContent = alt || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    var overlay = document.getElementById("lightboxOverlay");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    root.removeAttribute("data-theme");
    applyLang(getSaved("mbt-lang", "id"));
    ensureLightbox();
  });

  document.addEventListener("click", function (e) {
    var docLink = e.target.closest("a.doc-attach");
    if (docLink) {
      e.preventDefault();
      openLightbox(docLink.getAttribute("href"), docLink.getAttribute("data-doc-alt") || "");
      return;
    }

    var img = e.target.closest("img.zoomable");
    if (img) { openLightbox(img.currentSrc || img.src, img.alt); return; }

    if (e.target.closest("#lightboxClose") || e.target.id === "lightboxOverlay") {
      closeLightbox();
      return;
    }

    var langBtn = e.target.closest(".opt-lang");
    if (langBtn) {
      applyLang(langBtn.getAttribute("data-lang"));
      var pn = document.getElementById("settingsPanel");
      if (pn) pn.classList.remove("open");
      return;
    }

    var panel = document.getElementById("settingsPanel");
    var navLinks = document.getElementById("navLinks");
    var burger = document.getElementById("burgerBtn");

    function setMenu(open) {
      if (!navLinks) return;
      navLinks.classList.toggle("open", open);
      if (burger) {
        burger.textContent = open ? "✕" : "☰";
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }

    if (e.target.closest("#settingsBtn")) {
      if (panel) panel.classList.toggle("open");
      setMenu(false);
      return;
    }
    if (e.target.closest("#burgerBtn")) {
      setMenu(!(navLinks && navLinks.classList.contains("open")));
      if (panel) panel.classList.remove("open");
      return;
    }
    if (panel && !e.target.closest("#settingsPanel")) panel.classList.remove("open");
    if (navLinks && navLinks.classList.contains("open") && (e.target.closest("#navLinks a") || !e.target.closest(".nav"))) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();
