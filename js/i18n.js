(() => {
  "use strict";

  const STORAGE_KEY = "mmgss-language";
  const DEFAULT_LANG = "ja";
  const FALLBACK_LANG = "en";
  const SUPPORTED_LANGS = ["ja", "en"];
  const LOCALES = Object.fromEntries(SUPPORTED_LANGS.map((lang) => [lang, `locales/${lang}.json`]));
  const PAGES = {
    "index.html": "pages.home", about: "pages.company", "about.html": "pages.company",
    services: "pages.services", "services.html": "pages.services", recruitment: "pages.recruitment",
    "recruitment.html": "pages.recruitment", process: "pages.process", "process.html": "pages.process",
    activities: "pages.activities", "activities.html": "pages.activities", contact: "pages.contact", "contact.html": "pages.contact",
  };
  const ATTRIBUTES = ["placeholder", "title", "alt", "aria-label"];
  let resources = {};
  let ready = false;
  let currentLang = DEFAULT_LANG;

  function pageName() {
    return location.pathname.split("/").pop().toLowerCase() || "index.html";
  }

  function storedLanguage() {
    try {
      const lang = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  }

  function valueAt(object, key) {
    return key.split(".").reduce((value, segment) => (
      value !== null && value !== undefined ? value[segment] : undefined
    ), object);
  }

  function interpolate(value, options) {
    if (!options || typeof value !== "string") return value;
    return value.replace(/{{\s*([\w.-]+)\s*}}/g, (match, name) => (
      options[name] === undefined ? match : String(options[name])
    ));
  }

  function t(key, options, fallback) {
    if (!ready) return fallback ?? key;
    const value = valueAt(resources[currentLang], key) ?? valueAt(resources[FALLBACK_LANG], key);
    return typeof value === "string" ? interpolate(value, options) : (fallback ?? key);
  }

  function readOptions(element) {
    const raw = element.getAttribute("data-i18n-options");
    if (!raw) return undefined;
    try { return JSON.parse(raw); } catch {
      console.warn("[i18n] Invalid translation options on", element);
      return undefined;
    }
  }

  function bindSelector(root = document) {
    root.querySelectorAll("button[data-language]").forEach((button) => {
      if (button.dataset.i18nBound) return;
      button.dataset.i18nBound = "true";
      button.addEventListener("click", () => setLanguage(button.dataset.language));
    });
  }

  function applyLanguage(root = document) {
    document.documentElement.lang = currentLang;
    document.body.dataset.language = currentLang;
    bindSelector(root);
    root.querySelectorAll("button[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === currentLang));
    });
    if (!ready) return;
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n").trim();
      if (key) element.textContent = t(key, readOptions(element), element.textContent);
    });
    ATTRIBUTES.forEach((attribute) => {
      root.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
        const key = element.getAttribute(`data-i18n-${attribute}`).trim();
        if (key) element.setAttribute(attribute, t(key, readOptions(element), element.getAttribute(attribute)));
      });
    });
    const page = PAGES[pageName()];
    if (root === document && page) {
      document.title = t(`${page}.title`, undefined, document.title);
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = t(`${page}.description`, undefined, description.content);
    }
  }

  function setLanguage(lang) {
    currentLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    try { localStorage.setItem(STORAGE_KEY, currentLang); } catch { /* unavailable */ }
    applyLanguage();
    document.dispatchEvent(new CustomEvent("i18n:languagechanged", { detail: { lang: currentLang } }));
  }

  async function loadResources() {
    const entries = await Promise.all(Object.entries(LOCALES).map(async ([lang, url]) => {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
      return [lang, await response.json()];
    }));
    resources = Object.fromEntries(entries);
  }

  async function init() {
    currentLang = storedLanguage();
    try {
      await loadResources();
      ready = true;
    } catch (error) {
      console.error("[i18n] Locale files could not be loaded.", error);
    }
    applyLanguage();
    document.documentElement.classList.add("i18n-ready");
    document.dispatchEvent(new CustomEvent("i18n:ready", { detail: { lang: currentLang } }));
  }

  window.MMGSSI18n = { ready: () => ready, getLang: () => currentLang, setLanguage, t, translate: (root) => applyLanguage(root || document) };
  init();
})();
