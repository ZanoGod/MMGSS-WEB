/**
 * Load reusable HTML components
 *
 * The site is deployed in three environments:
 * - Local Live Server: /
 * - GitHub Pages project site: /MMGSS-WEB/
 * - Production Apache: /
 *
 * Resolve component URLs from this script's own location so nested
 * clean-URL pages (for example /about) still load shared files.
 */
function getMMGSSSiteBase() {
  const currentScript =
    document.currentScript ||
    [...document.scripts].find((script) =>
      /(?:^|\/)components\.js(?:[?#].*)?$/i.test(script.src || ""),
    );

  if (currentScript?.src) {
    try {
      return new URL("../", currentScript.src).href;
    } catch {
      // Fall through to the current document origin/path.
    }
  }

  return new URL(".", window.location.href).href;
}

/**
 * Load reusable HTML components
 */
async function loadComponent(selector, file) {
  const element = document.querySelector(selector);

  if (!element) return;

  try {
    const response = await fetch(new URL(file, getMMGSSSiteBase()).href);

    if (!response.ok) {
      throw new Error(`Failed to load component: ${file}`);
    }

    element.innerHTML = await response.text();

    // Notify other scripts that component is ready
    element.dispatchEvent(
      new CustomEvent("componentLoaded", {
        bubbles: true,
        detail: { file },
      }),
    );

    window.MMGSSI18n?.translate();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Load footer
 */
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#footer-container", "footer.html");
});
