/**
 * Load reusable HTML components
 */
async function loadComponent(selector, file) {
  const element = document.querySelector(selector);

  if (!element) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(
        `Failed to load component: ${file}`
      );
    }

    element.innerHTML = await response.text();

    // Notify other scripts that component is ready
    element.dispatchEvent(
      new CustomEvent("componentLoaded", {
        detail: {
          file: file
        }
      })
    );

  } catch (error) {
    console.error(error);
  }
}

/**
 * Load footer
 */
document.addEventListener("DOMContentLoaded", () => {

  loadComponent(
    "#footer-container",
    "footer.html"
  );

});