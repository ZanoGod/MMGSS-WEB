
/* =====================================================
   Myanmar GSS — Premium Image Carousel
   Separate CSS + JavaScript
   Fade only | No thumbnails | No 3D
===================================================== */

(() => {
  "use strict";

  if (customElements.get("premium-carousel")) return;

  class PremiumCarousel extends HTMLElement {
    constructor() {
      super();

      this.index = 0;
      this.items = [];
      this.timer = null;
      this.startX = 0;
      this.initialized = false;

      this.handleMouseEnter = () => this.pause();
      this.handleMouseLeave = () => this.play();
    }

    connectedCallback() {
      if (this.initialized) return;

      this.initialized = true;

      // Read the original images before building the carousel.
      const images = Array.from(this.querySelectorAll(":scope > img"));

      this.items = images.map((img) => ({
        src: img.getAttribute("src"),
        srcset: img.getAttribute("srcset") || "",
        sizes: img.getAttribute("sizes") || "",
        alt: img.getAttribute("alt") || "",
        caption: img.dataset.caption || ""
      }));

      if (!this.items.length) {
        this.initialized = false;
        console.warn("Premium Carousel: No direct child images found.", this);
        return;
      }

      this.index = 0;

      this.render();
      this.bindEvents();
      this.paint();
      this.play();
    }

    disconnectedCallback() {
      this.pause();

      if (this.root) {
        this.root.removeEventListener(
          "mouseenter",
          this.handleMouseEnter
        );

        this.root.removeEventListener(
          "mouseleave",
          this.handleMouseLeave
        );
      }
    }

    /* ---------------------------------------------
       Configuration
    --------------------------------------------- */

    get loop() {
      return this.getAttribute("loop") !== "false";
    }

    get autoplayEnabled() {
      return this.getAttribute("autoplay") !== "false";
    }

    get interval() {
      const value = Number.parseInt(
        this.getAttribute("interval"),
        10
      );

      return Number.isFinite(value) && value >= 1000
        ? value
        : 5000;
    }

    /* ---------------------------------------------
       Build carousel markup
    --------------------------------------------- */

    render() {
      const slidesHTML = this.items
        .map((item, index) => {
          const slide = document.createElement("figure");

          slide.className = "slide";
          slide.setAttribute("role", "group");
          slide.setAttribute("aria-roledescription", "slide");
          slide.setAttribute(
            "aria-label",
            `${index + 1} of ${this.items.length}`
          );

          const img = document.createElement("img");

          img.src = item.src;

          if (item.srcset) {
            img.srcset = item.srcset;
          }

          if (item.sizes) {
            img.sizes = item.sizes;
          }

          img.alt = item.alt;
          img.loading = index === 0 ? "eager" : "lazy";
          img.draggable = false;

          slide.appendChild(img);

          return slide;
        });

      // Construct elements instead of injecting user-provided image HTML.
      this.replaceChildren();

      this.root = document.createElement("div");
      this.root.className = "pc";
      this.root.setAttribute("role", "region");
      this.root.setAttribute("aria-roledescription", "carousel");
      this.root.setAttribute("tabindex", "0");

      this.stage = document.createElement("div");
      this.stage.className = "stage";

      this.slidesEl = document.createElement("div");
      this.slidesEl.className = "slides";

      slidesHTML.forEach((slide) => {
        this.slidesEl.appendChild(slide);
      });

      this.captionEl = document.createElement("p");
      this.captionEl.className = "caption";

      this.stage.append(
        this.slidesEl,
        this.captionEl
      );

      this.dock = document.createElement("div");
      this.dock.className = "dock";

      this.prevBtn = document.createElement("button");
      this.prevBtn.type = "button";
      this.prevBtn.className = "arrow prev";
      this.prevBtn.setAttribute("aria-label", "Previous slide");
      this.prevBtn.innerHTML = "&lsaquo;";

      this.indicatorsEl = document.createElement("div");
      this.indicatorsEl.className = "indicators";
      this.indicatorsEl.setAttribute("role", "group");
      this.indicatorsEl.setAttribute(
        "aria-label",
        "Choose slide"
      );

      this.nextBtn = document.createElement("button");
      this.nextBtn.type = "button";
      this.nextBtn.className = "arrow next";
      this.nextBtn.setAttribute("aria-label", "Next slide");
      this.nextBtn.innerHTML = "&rsaquo;";

      this.dock.append(
        this.prevBtn,
        this.indicatorsEl,
        this.nextBtn
      );

      this.liveEl = document.createElement("span");
      this.liveEl.className = "sr-only";
      this.liveEl.setAttribute("aria-live", "polite");
      this.liveEl.setAttribute("aria-atomic", "true");

      this.root.append(
        this.stage,
        this.dock,
        this.liveEl
      );

      this.appendChild(this.root);

      // Build one dot for every slide.
      this.items.forEach((item, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "dot";
        dot.setAttribute(
          "aria-label",
          `Go to slide ${index + 1}`
        );

        dot.addEventListener("click", () => {
          this.goTo(index);
        });

        this.indicatorsEl.appendChild(dot);
      });

      // Optional aspect ratio attribute, e.g. aspect="16/9".
      const aspect = this.getAttribute("aspect");

      if (aspect) {
        this.stage.style.aspectRatio = aspect.replace(":", " / ");
      }
    }

    /* ---------------------------------------------
       Event listeners
    --------------------------------------------- */

    bindEvents() {
      this.prevBtn.addEventListener("click", () => {
        this.prev();
      });

      this.nextBtn.addEventListener("click", () => {
        this.next();
      });

      this.root.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          this.prev();
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          this.next();
        }

        if (event.key === "Home") {
          event.preventDefault();
          this.goTo(0);
        }

        if (event.key === "End") {
          event.preventDefault();
          this.goTo(this.items.length - 1);
        }
      });

      this.root.addEventListener(
        "mouseenter",
        this.handleMouseEnter
      );

      this.root.addEventListener(
        "mouseleave",
        this.handleMouseLeave
      );

      // Touch swipe support.
      this.stage.addEventListener(
        "touchstart",
        (event) => {
          this.startX = event.changedTouches[0].clientX;
        },
        { passive: true }
      );

      this.stage.addEventListener(
        "touchend",
        (event) => {
          const endX = event.changedTouches[0].clientX;
          const difference = endX - this.startX;

          if (Math.abs(difference) < 45) return;

          if (difference > 0) {
            this.prev();
          } else {
            this.next();
          }
        },
        { passive: true }
      );

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.play();
        }
      });
    }

    /* ---------------------------------------------
       Navigation
    --------------------------------------------- */

    next() {
      this.goTo(this.index + 1);
    }

    prev() {
      this.goTo(this.index - 1);
    }

    goTo(nextIndex) {
      const count = this.items.length;

      if (!count) return;

      if (this.loop) {
        this.index = ((nextIndex % count) + count) % count;
      } else {
        this.index = Math.max(
          0,
          Math.min(nextIndex, count - 1)
        );
      }

      this.paint();
      this.restartAutoplay();

      this.dispatchEvent(
        new CustomEvent("slidechange", {
          bubbles: true,
          detail: {
            index: this.index,
            total: count
          }
        })
      );
    }

    /* ---------------------------------------------
       Update active slide and controls
    --------------------------------------------- */

    paint() {
      const slides = Array.from(
        this.slidesEl.children
      );

      const dots = Array.from(
        this.indicatorsEl.children
      );

      slides.forEach((slide, index) => {
        const active = index === this.index;

        slide.classList.toggle("is-active", active);

        slide.setAttribute(
          "aria-hidden",
          String(!active)
        );
      });

      dots.forEach((dot, index) => {
        const active = index === this.index;

        dot.classList.toggle("is-active", active);

        dot.setAttribute(
          "aria-current",
          active ? "true" : "false"
        );
      });

      const item = this.items[this.index];

      if (item && item.caption) {
        this.captionEl.textContent = item.caption;
        this.captionEl.classList.add("is-visible");
      } else {
        this.captionEl.textContent = "";
        this.captionEl.classList.remove("is-visible");
      }

      this.prevBtn.disabled =
        !this.loop && this.index === 0;

      this.nextBtn.disabled =
        !this.loop && this.index === this.items.length - 1;

      this.liveEl.textContent =
        `Slide ${this.index + 1} of ${this.items.length}` +
        (item.alt ? `: ${item.alt}` : "");
    }

    /* ---------------------------------------------
       Autoplay
    --------------------------------------------- */

    play() {
      this.pause();

      if (!this.autoplayEnabled) return;
      if (this.items.length < 2) return;
      if (document.hidden) return;

      this.timer = window.setInterval(() => {
        this.next();
      }, this.interval);
    }

    pause() {
      if (this.timer !== null) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }

    restartAutoplay() {
      this.play();
    }
  }

  customElements.define(
    "premium-carousel",
    PremiumCarousel
  );
})();
