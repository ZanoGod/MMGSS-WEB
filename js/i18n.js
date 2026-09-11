(() => {
  "use strict";

  /* =========================================================
     MMGSS — i18n.js
     Centralized internationalization using i18next.

     Layout:
     - Load the vendored i18next UMD build (js/vendor/i18next.min.js).
     - Fetch one JSON file per language from /locales.
     - Read translation keys declared as data attributes in the HTML:
         data-i18n="<key>"              → textContent
         data-i18n-placeholder="<key>"  → placeholder attribute
         data-i18n-title="<key>"        → title attribute
         data-i18n-alt="<key>"          → alt attribute
         data-i18n-aria-label="<key>"   → aria-label attribute
         data-i18n-options='{...}'      → JSON interpolation options (optional)
     - English is the fallback language. Missing keys automatically fall
       back to English; a console warning is logged to help find gaps.
     ========================================================= */

  const STORAGE_KEY = "mmgss-language";
  const DEFAULT_LANG = "en";
  const SUPPORTED_LANGS = ["en", "ja", "my"];
  const LOCALES = {
    en: "locales/en.json",
    ja: "locales/ja.json",
    my: "locales/my.json",
  };

  /* Title + meta description live under these keys per page. */
  const PAGES = {
    "index.html": "pages.home",
    "about.html": "pages.company",
    "services.html": "pages.services",
    "recruitment.html": "pages.recruitment",
    "process.html": "pages.process",
    "activities.html": "pages.activities",
    "contact.html": "pages.contact",
  };

  const ATTRIBUTE_LABELS = ["placeholder", "title", "alt", "aria-label"];

  let ready = false;
  let currentLang = DEFAULT_LANG;

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

  function currentPage() {
    return location.pathname.split("/").pop().toLowerCase() || "index.html";
  }

  function getStoredLang() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGS.includes(value) ? value : DEFAULT_LANG;
    } catch (error) {
      return DEFAULT_LANG;
    }
  }

  function storeLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      /* Ignore storage failures (e.g. private browsing). */
    }
  }

  function readOptions(element) {
    const raw = element.getAttribute("data-i18n-options");
    if (!raw) return undefined;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("[i18n] Invalid data-i18n-options on element:", element, raw);
      return undefined;
    }
  }

  /* ---------------------------------------------------------
     i18next instance
     --------------------------------------------------------- */

  function t(key, options, fallback) {
    if (!ready) return fallback !== undefined ? fallback : key;
    const value = window.i18next.t(key, options);
    if (value === key && fallback !== undefined) return fallback;
    return value;
  }

  async function loadResources() {
    const resources = {};
    const requests = Object.entries(LOCALES).map(async ([code, url]) => {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error("Unable to load locale file " + url + " (HTTP " + response.status + ")");
      }
      resources[code] = { translation: await response.json() };
    });
    await Promise.all(requests);
    return resources;
  }

  async function initI18next(lng, resources) {
    await window.i18next.init({
      lng,
      fallbackLng: DEFAULT_LANG,
      resources,
      returnNull: false,
      interpolation: {
        /* textContent is used for output, so no HTML escaping is needed. */
        escapeValue: false,
      },
      missingKeyHandler: (lngs, namespace, key) => {
        console.warn("[i18n] Missing translation key \"" + key + "\" for language \"" + lngs + "\".");
      },
    });
  }

  /* ---------------------------------------------------------
     DOM translation
     --------------------------------------------------------- */

  function translateText() {
    const nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach((element) => {
      const key = element.getAttribute("data-i18n").trim();
      if (!key) return;
      element.textContent = t(key, readOptions(element));
    });
  }

  function translateAttributes() {
    ATTRIBUTE_LABELS.forEach((attr) => {
      const selector = "[data-i18n-" + attr + "]";
      document.querySelectorAll(selector).forEach((element) => {
        const key = element.getAttribute("data-i18n-" + attr).trim();
        if (!key) return;
        element.setAttribute(attr, t(key, readOptions(element)));
      });
    });
  }

  function translateSeo() {
    const page = PAGES[currentPage()];
    if (page) {
      const existingTitle = document.title;
      document.title = t(page + ".title", undefined, existingTitle);

      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        const existing = meta.getAttribute("content") || "";
        meta.setAttribute("content", t(page + ".description", undefined, existing));
      }
    }
  }

  function updateNavToggleLabel() {
    const toggle = document.getElementById("navToggle");
    if (!toggle) return;
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute(
      "aria-label",
      t(open ? "common.closeNavigation" : "common.openNavigation", undefined, "Open navigation"),
    );
  }

  /* ---------------------------------------------------------
     Language selection
     --------------------------------------------------------- */

  function updateSelector() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === currentLang));
    });
  }

  function bindSelector() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        setLanguage(button.dataset.language);
      });
    });
  }

  function applyLanguage() {
    /* These must always stay in sync, even if i18next is not ready. */
    document.documentElement.lang = currentLang;
    document.body.dataset.language = currentLang;
    updateSelector();

    if (!ready) return;
    translateText();
    translateAttributes();
    translateSeo();
    updateNavToggleLabel();
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
    storeLanguage(lang);
    currentLang = lang;

    if (ready) {
      window.i18next.changeLanguage(lang).then(() => {
        applyLanguage();
        document.dispatchEvent(
          new CustomEvent("i18n:languagechanged", { detail: { lang } }),
        );
      });
    } else {
      applyLanguage();
    }
  }

  /* ---------------------------------------------------------
     Startup
     --------------------------------------------------------- */

  async function init() {
    currentLang = getStoredLang();

    try {
      const resources = await loadResources();
      await initI18next(currentLang, resources);
      ready = true;
    } catch (error) {
      console.warn("[i18n] Locale files could not be loaded. English content will be kept.", error);
    }

    bindSelector();
    applyLanguage();
    document.documentElement.classList.add("i18n-ready");
    document.dispatchEvent(
      new CustomEvent("i18n:ready", { detail: { lang: currentLang } }),
    );
  }

  /* Public API used by other scripts (e.g. js/script.js). */
  window.MMGSSI18n = {
    ready: () => ready,
    getLang: () => currentLang,
    setLanguage,
    t: (key, options, fallback) => t(key, options, fallback),
    translate: () => applyLanguage(),
  };

  init();
})();