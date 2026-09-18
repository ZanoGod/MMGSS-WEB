(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  const body = document.body;
  const loader = $("#pageLoader");
  const nav = $(".nav-shell");
  const progress = $("#scrollProgress");
  const backTop = $("#backTop");
  const cursorGlow = $("#cursorGlow");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const i18n = window.MMGSSI18n || null;

  function translate(key, options, fallback) {
    return i18n ? i18n.t(key, options, fallback) : fallback || key;
  }

  /* =========================================================
     PAGE LOADER
     ========================================================= */

  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      body.classList.add("loaded");

      if (loader) {
        setTimeout(() => {
          loader.classList.add("hide");
        }, 280);
      }
    });
  });

  /* =========================================================
     ACTIVE NAVIGATION
     ========================================================= */

  const currentPage =
    location.pathname.split("/").pop().toLowerCase() || "index.html";

  $$(".nav-link[data-page]").forEach((link) => {
    if (link.dataset.page.toLowerCase() === currentPage) {
      link.classList.add("active");
    }
  });

/* =========================================================
   LANGUAGE SELECTOR
   ========================================================= */

function initLanguageSelector() {
  const selector = document.querySelector('.language-selector');
  const pill = document.querySelector('.language-pill-bg');
  if (!selector || !pill) return;

  const buttons = selector.querySelectorAll('.language-btn');

  function updatePillPosition(activeBtn) {
    if (!activeBtn) return;
    pill.style.width = activeBtn.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + activeBtn.offsetLeft + 'px)';
  }

  function setActiveLanguage(btn) {
    buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    updatePillPosition(btn);
  }

  const initial = selector.querySelector('.language-btn[aria-pressed="true"]') || buttons[0];
  if (initial) setActiveLanguage(initial);

  window.addEventListener('resize', function () {
    const active = selector.querySelector('.language-btn[aria-pressed="true"]');
    if (active) updatePillPosition(active);
  });

  return { updatePillPosition, setActiveLanguage };
}

function syncLanguageSelectorFromI18n() {
  const selector = document.querySelector('.language-selector');
  if (!selector) return;
  
  const activeBtn = selector.querySelector('.language-btn[aria-pressed="true"]');
  if (activeBtn && window.languageSelector) {
    window.languageSelector.setActiveLanguage(activeBtn);
  }
}

document.addEventListener('i18n:ready', function () {
  window.languageSelector = initLanguageSelector();
});

document.addEventListener('i18n:languagechanged', function (e) {
  syncLanguageSelectorFromI18n();
  if (window.languageSelector) {
    const selector = document.querySelector('.language-selector');
    const activeBtn = selector?.querySelector('.language-btn[aria-pressed="true"]');
    if (activeBtn) {
      window.languageSelector.updatePillPosition(activeBtn);
    }
  }
});
  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  function closeNavigation() {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", translate("common.openNavigation", undefined, "Open navigation"));
    body.classList.remove("menu-open");
  }

  navToggle?.addEventListener("click", () => {
    if (!navLinks) return;

    const open = navLinks.classList.toggle("open");

    navToggle.setAttribute("aria-expanded", String(open));

    navToggle.setAttribute(
      "aria-label",
      translate(open ? "common.closeNavigation" : "common.openNavigation", undefined, open ? "Close navigation" : "Open navigation"),
    );

    body.classList.toggle("menu-open", open);
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeNavigation();
    }
  });

  /* =========================================================
     SCROLL BEHAVIOR
     ========================================================= */

  let lastY = window.scrollY;
  let ticking = false;

  function updateScroll() {
    const y = window.scrollY;
    const doc = document.documentElement;

    const max = Math.max(1, doc.scrollHeight - window.innerHeight);

    /* Scroll progress */

    if (progress) {
      progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    }

    /* Header */

    nav?.classList.toggle("scrolled", y > 10);

    /* Hide header while scrolling down */

    if (nav && window.innerWidth > 900) {
      if (y > lastY + 8 && y > 180) {
        nav.classList.add("nav-hidden");
      } else if (y < lastY - 8) {
        nav.classList.remove("nav-hidden");
      }
    } else {
      nav?.classList.remove("nav-hidden");
    }

    /* Back to top */

    backTop?.classList.toggle("show", y > 500);

    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);

        ticking = true;
      }
    },
    {
      passive: true,
    },
  );

  updateScroll();

  backTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* =========================================================
     CURSOR GLOW
     ========================================================= */

  if (cursorGlow && window.matchMedia("(pointer:fine)").matches) {
    body.classList.add("cursor-ready");

    window.addEventListener(
      "pointermove",
      (event) => {
        cursorGlow.style.left = `${event.clientX}px`;

        cursorGlow.style.top = `${event.clientY}px`;
      },
      {
        passive: true,
      },
    );
  }

  /* =========================================================
     REVEAL ANIMATIONS
     ========================================================= */

  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      },
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("show"));
  }

  /* =========================================================
     FOOTER YEAR
     ========================================================= */

  const year = $("[data-year]");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================================================
     RECRUITMENT FILTERS
     ========================================================= */

  const filters = $$(".filter[data-filter]");

  const jobs = $$(".job-item");

  const count = $("#roleCount");

  const heroRoleCount = $("#heroRoleCount");

  const empty = $("#recruitmentEmpty");

  function applyFilter(type) {
    let visible = 0;

    jobs.forEach((job) => {
      const show = type === "all" || job.dataset.type === type;

      job.hidden = !show;

      if (show) {
        visible++;
      }
    });

    if (count) {
      count.textContent = visible;
    }

    if (heroRoleCount) {
      heroRoleCount.textContent = visible;
    }

    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((item) => {
        item.classList.remove("active");
      });

      filter.classList.add("active");

      applyFilter(filter.dataset.filter);
    });
  });

  if (jobs.length) {
    applyFilter("all");
  }

  /* =========================================================
     RECRUITMENT ROLE DETAILS MODAL
     ========================================================= */

  const modal = $("#jobModal");

  const modalPanel = $(".modal-panel", modal || document);

  const modalRole = $("#modalRole");

  const modalType = $("#modalType");

  /*
   * These IDs must exist inside recruitment.html:
   *
   * modalLocation
   * modalSalary
   * modalLanguage
   * modalDuration
   * modalSummary
   * modalRequirements
   */

  const modalFields = [
    "Location",
    "Salary",
    "Language",
    "Duration",
    "Summary",
    "Requirements",
  ];

  const jobValueKeys = {
    Location: "location",
    Salary: "salary",
    Language: "language",
    Duration: "duration",
    Summary: "summary",
    Requirements: "requirements",
  };

  const jobTypeKeys = {
    professional: "recruitment.types.professional",
    ssw: "recruitment.types.ssw",
    "technical-intern": "recruitment.types.intern",
  };

  /* ---------------------------------------------------------
     Open modal
     --------------------------------------------------------- */

  function openModal(button) {
    if (!modal) {
      return;
    }


    const job = button.closest(".job-item");

    const jobId = button.dataset.job || job?.dataset.jobId || "";

    /* Role */

    if (modalRole) {
      modalRole.textContent = jobId
        ? translate(`recruitment.jobs.${jobId}.role`)
        : translate("recruitment.modal.fallbackRole", undefined, "Role details");
    }

    /* Type */

    if (modalType) {
      const typeKey = job ? jobTypeKeys[job.dataset.type] : null;

      modalType.textContent = typeKey
        ? translate(typeKey)
        : translate("recruitment.modal.eyebrow", undefined, "Recruitment opportunity");
    }

    /* Modal information */

    modalFields.forEach((field) => {
      const element = $(`#modal${field}`);

      if (!element) {
        return;
      }

      const value = jobId
        ? translate(`recruitment.jobs.${jobId}.${jobValueKeys[field]}`)
        : "";

      element.textContent = value || translate("common.detailsOnRequest", undefined, "Details available on request");
    });

    /* Show modal */

    modal.hidden = false;

    body.classList.add("modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("is-open");

      /*
       * Reset modal scroll position
       * every time it opens.
       */

      modalPanel?.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });

    /*
     * Move keyboard focus to
     * the close button.
     */

    $("#modalClose")?.focus();
  }

  /* ---------------------------------------------------------
     Close modal
     --------------------------------------------------------- */

  function closeModal() {
    if (!modal) {
      return;
    }

    modal.classList.remove("is-open");

    body.classList.remove("modal-open");

    /*
     * Wait for CSS fade-out animation.
     */

    setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 180);
  }

  /* ---------------------------------------------------------
     Open buttons
     --------------------------------------------------------- */

  $$("[data-job]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      openModal(button);
    });
  });

  /* ---------------------------------------------------------
     Close buttons
     --------------------------------------------------------- */

  $("#modalClose")?.addEventListener("click", closeModal);

  $("#modalCloseBottom")?.addEventListener("click", closeModal);

  /* ---------------------------------------------------------
     Close when clicking overlay
     --------------------------------------------------------- */

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  /*
   * Do not close when clicking
   * inside the modal panel.
   */

  modalPanel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  /* ---------------------------------------------------------
     ESC key
     --------------------------------------------------------- */

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal && !modal.hidden) {
        closeModal();
      }

      closeNavigation();
    }
  });

  /* =========================================================
     HERO BACKGROUND CAROUSEL
     =========================================================

     Requirements:

     - 3 background images
     - Automatic rotation
     - 6 second interval
     - Previous / next arrows
     - Dots
     - Keyboard controls
     - Touch swipe
     - Pause on hover
     - Pause while focused
     - Reduced-motion support
     ========================================================= */

  const slides = $$(".hero-slide");

  const dots = $$(".hero-carousel-dot");

  const hero = $(".hero");

  const prev = $("[data-carousel-prev]");

  const next = $("[data-carousel-next]");

  let slideIndex = 0;

  let carouselTimer = null;

  let touchStartX = 0;

  /* ---------------------------------------------------------
     Show slide
     --------------------------------------------------------- */

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    slideIndex = (index + slides.length) % slides.length;

    /* Activate background */

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === slideIndex);
    });

    /* Update dots */

    dots.forEach((dot, i) => {
      const selected = i === slideIndex;

      dot.classList.toggle("active", selected);

      dot.setAttribute("aria-selected", selected ? "true" : "false");
    });
  }

  /* ---------------------------------------------------------
     Stop carousel
     --------------------------------------------------------- */

  function stopCarousel() {
    if (carouselTimer) {
      clearInterval(carouselTimer);

      carouselTimer = null;
    }
  }

  /* ---------------------------------------------------------
     Start carousel
     --------------------------------------------------------- */

  function startCarousel() {
    stopCarousel();

    /*
     * Don't run if there is only
     * one slide.
     */

    if (slides.length < 2) {
      return;
    }

    /*
     * Respect user's reduced
     * motion preference.
     */

    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      return;
    }

    carouselTimer = setInterval(() => {
      showSlide(slideIndex + 1);
    }, 6000);
  }

  /* ---------------------------------------------------------
     Previous button
     --------------------------------------------------------- */

  prev?.addEventListener("click", (event) => {
    event.preventDefault();

    showSlide(slideIndex - 1);

    startCarousel();
  });

  /* ---------------------------------------------------------
     Next button
     --------------------------------------------------------- */

  next?.addEventListener("click", (event) => {
    event.preventDefault();

    showSlide(slideIndex + 1);

    startCarousel();
  });

  /* ---------------------------------------------------------
     Carousel dots
     --------------------------------------------------------- */

  dots.forEach((dot, index) => {
    dot.addEventListener("click", (event) => {
      event.preventDefault();

      showSlide(index);

      startCarousel();
    });
  });

  /* ---------------------------------------------------------
     Pause when mouse enters hero
     --------------------------------------------------------- */

  hero?.addEventListener("mouseenter", stopCarousel);

  /* ---------------------------------------------------------
     Resume when mouse leaves hero
     --------------------------------------------------------- */

  hero?.addEventListener("mouseleave", startCarousel);

  /* ---------------------------------------------------------
     Pause while hero has keyboard focus
     --------------------------------------------------------- */

  hero?.addEventListener("focusin", stopCarousel);

  /* ---------------------------------------------------------
     Resume after focus leaves hero
     --------------------------------------------------------- */

  hero?.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) {
      startCarousel();
    }
  });

  /* ---------------------------------------------------------
     Touch / swipe support
     --------------------------------------------------------- */

  hero?.addEventListener(
    "touchstart",
    (event) => {
      if (!event.changedTouches.length) {
        return;
      }

      touchStartX = event.changedTouches[0].clientX;

      stopCarousel();
    },
    {
      passive: true,
    },
  );

  hero?.addEventListener(
    "touchend",
    (event) => {
      if (!event.changedTouches.length) {
        return;
      }

      const endX = event.changedTouches[0].clientX;

      const distance = endX - touchStartX;

      /*
       * Minimum swipe distance:
       * 45px
       */

      if (Math.abs(distance) > 45) {
        showSlide(slideIndex + (distance < 0 ? 1 : -1));
      }

      startCarousel();
    },
    {
      passive: true,
    },
  );

  /* ---------------------------------------------------------
     Keyboard controls
     --------------------------------------------------------- */

  window.addEventListener("keydown", (event) => {
    if (!hero || !slides.length) {
      return;
    }

    const tag = event.target?.tagName;

    /*
     * Don't interfere with
     * form controls.
     */

    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
      return;
    }

    if (event.key === "ArrowRight") {
      showSlide(slideIndex + 1);

      startCarousel();
    }

    if (event.key === "ArrowLeft") {
      showSlide(slideIndex - 1);

      startCarousel();
    }
  });

/* =========================================================
   INITIALIZE HERO CAROUSEL
   ========================================================= */

showSlide(0);
startCarousel();


/* =========================================================
   COMPANY IMAGE CAROUSEL
   ========================================================= */

const companyCarousel = $(".company-carousel");

if (companyCarousel) {

  const companySlides = $$(".company-slide", companyCarousel);
  const companyDots = $$(".company-carousel-dot", companyCarousel);

  const companyPrev = $(".company-prev", companyCarousel);
  const companyNext = $(".company-next", companyCarousel);

  let companySlideIndex = 0;
  let companyCarouselTimer = null;

  const COMPANY_AUTOPLAY_DELAY = 5000;


  /* -------------------------------------------------------
     Show company slide
     ------------------------------------------------------- */

  function showCompanySlide(index) {

    if (!companySlides.length) {
      return;
    }

    companySlideIndex =
      (index + companySlides.length) % companySlides.length;


    /* Activate image */

    companySlides.forEach((slide, i) => {

      slide.classList.toggle(
        "active",
        i === companySlideIndex
      );

    });


    /* Update dots */

    companyDots.forEach((dot, i) => {

      const selected = i === companySlideIndex;

      dot.classList.toggle("active", selected);

      dot.setAttribute(
        "aria-current",
        selected ? "true" : "false"
      );

    });

  }


  /* -------------------------------------------------------
     Stop autoplay
     ------------------------------------------------------- */

  function stopCompanyCarousel() {

    if (companyCarouselTimer) {

      clearInterval(companyCarouselTimer);

      companyCarouselTimer = null;

    }

  }


  /* -------------------------------------------------------
     Start autoplay
     ------------------------------------------------------- */

  function startCompanyCarousel() {

    stopCompanyCarousel();


    if (companySlides.length < 2) {
      return;
    }


    /* Respect reduced motion */

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }


    companyCarouselTimer = setInterval(() => {

      showCompanySlide(companySlideIndex + 1);

    }, COMPANY_AUTOPLAY_DELAY);

  }


  /* -------------------------------------------------------
     Previous
     ------------------------------------------------------- */

  companyPrev?.addEventListener("click", (event) => {

    event.preventDefault();

    showCompanySlide(companySlideIndex - 1);

    startCompanyCarousel();

  });


  /* -------------------------------------------------------
     Next
     ------------------------------------------------------- */

  companyNext?.addEventListener("click", (event) => {

    event.preventDefault();

    showCompanySlide(companySlideIndex + 1);

    startCompanyCarousel();

  });


  /* -------------------------------------------------------
     Dots
     ------------------------------------------------------- */

  companyDots.forEach((dot, index) => {

    dot.addEventListener("click", (event) => {

      event.preventDefault();

      showCompanySlide(index);

      startCompanyCarousel();

    });

  });


  /* -------------------------------------------------------
     Pause on hover
     ------------------------------------------------------- */

  companyCarousel.addEventListener(
    "mouseenter",
    stopCompanyCarousel
  );


  /* -------------------------------------------------------
     Resume after hover
     ------------------------------------------------------- */

  companyCarousel.addEventListener(
    "mouseleave",
    startCompanyCarousel
  );


  /* -------------------------------------------------------
     Pause while focused
     ------------------------------------------------------- */

  companyCarousel.addEventListener(
    "focusin",
    stopCompanyCarousel
  );


  /* -------------------------------------------------------
     Resume after focus
     ------------------------------------------------------- */

  companyCarousel.addEventListener(
    "focusout",
    (event) => {

      if (
        !companyCarousel.contains(
          event.relatedTarget
        )
      ) {

        startCompanyCarousel();

      }

    }
  );


  /* -------------------------------------------------------
     Touch / swipe support
     ------------------------------------------------------- */

  let companyTouchStartX = 0;


  companyCarousel.addEventListener(
    "touchstart",
    (event) => {

      if (!event.changedTouches.length) {
        return;
      }

      companyTouchStartX =
        event.changedTouches[0].clientX;

      stopCompanyCarousel();

    },
    {
      passive: true
    }
  );


  companyCarousel.addEventListener(
    "touchend",
    (event) => {

      if (!event.changedTouches.length) {
        return;
      }

      const endX =
        event.changedTouches[0].clientX;

      const distance =
        endX - companyTouchStartX;


      if (Math.abs(distance) > 45) {

        showCompanySlide(
          companySlideIndex +
          (distance < 0 ? 1 : -1)
        );

      }


      startCompanyCarousel();

    },
    {
      passive: true
    }
  );


  /* -------------------------------------------------------
     Initialize
     ------------------------------------------------------- */

  showCompanySlide(0);
  startCompanyCarousel();
}
})();

     