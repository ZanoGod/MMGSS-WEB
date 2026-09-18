/**
 * Load reusable HTML components
 */
async function loadComponent(selector, file) {
  const element = document.querySelector(selector);

  if (!element) return;

  try {
    const response = await fetch(file);

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

    window.MMGSSI18n?.translate(element);

    // The footer is injected after the main script runs.
    element.querySelectorAll("[data-year]").forEach((year) => {
      year.textContent = new Date().getFullYear();
    });
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
