document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const header = document.querySelector(".site-header");

  // ===== DARK / LIGHT MODE =====
  function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark-mode", dark);

    if (themeToggle) {
      themeToggle.setAttribute("aria-label", dark ? "Switch to white mode" : "Switch to dark mode");
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.dataset.theme = dark ? "dark" : "light";
    }
  }

  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("education-page-theme") || "light";
  } catch (error) {
    savedTheme = "light";
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode")
        ? "light"
        : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("education-page-theme", nextTheme);
      } catch (error) {
        // Theme switching still works if storage is unavailable.
      }
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  function updateHeaderOnScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
  }

  updateHeaderOnScroll();

  window.addEventListener("scroll", updateHeaderOnScroll, {
    passive: true
  });

  // ===== FOOTER YEAR =====
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ===== SOCIAL LINKS =====
  const socialLinks = {
    instagram: "https://www.instagram.com/digitaltechassist_2026/",
    youtube: "https://www.youtube.com/@crazy_meet"
  };

  const instagramLink = document.getElementById("instagramLink");
  const youtubeLink = document.getElementById("youtubeLink");

  if (instagramLink) {
    instagramLink.href = socialLinks.instagram;
  }

  if (youtubeLink) {
    youtubeLink.href = socialLinks.youtube;
  }
});


/* ===== LIVE WEBSITE COLOR TESTER ===== */

const colorTester = document.getElementById("colorTester");

if (colorTester) {
  const colorButtons = colorTester.querySelectorAll("[data-color]");
  const selectedColor = document.getElementById("selectedColor");
  const root = document.documentElement;

  // Save the original theme variables.
  const originalColors = {
    purple: getComputedStyle(root).getPropertyValue("--purple").trim(),
    purpleDark: getComputedStyle(root)
      .getPropertyValue("--purple-dark").trim(),
    purpleLight: getComputedStyle(root)
      .getPropertyValue("--purple-light").trim()
  };

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color;

      // Update the main website theme variables.
      root.style.setProperty("--purple", color);
      root.style.setProperty("--purple-dark", color);
      root.style.setProperty("--purple-light", color);

      root.style.setProperty("--primary", color);
      root.style.setProperty("--accent", color);
      root.style.setProperty("--theme-color", color);

      // Update the selected color label.
      if (selectedColor) {
        selectedColor.textContent = color;
      }

      // Update the selected button.
      colorButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  // Do not automatically change the website theme on startup.
}


/* ===== MOBILE UPI DETAILS — COPY ONLY, NO PAYMENT APP REDIRECTS ===== */
document.addEventListener("DOMContentLoaded", () => {
  const mobileOnly = window.matchMedia("(max-width: 600px)");

  async function copyPaymentDetail(value, statusElement, button) {
    if (!mobileOnly.matches) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = value;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.left = "-9999px";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Copy was not completed");
      }

      statusElement.textContent = "Copied. Open your UPI app and verify the recipient.";
      const originalLabel = button.dataset.originalLabel || button.textContent;
      button.dataset.originalLabel = originalLabel;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1800);
    } catch (error) {
      statusElement.textContent = "Copy unavailable. Please select and copy the details manually.";
    }
  }

  const copyTargets = [
    {
      button: document.getElementById("copyUpiId"),
      value: document.getElementById("mobileUpiId"),
      status: document.getElementById("upiIdCopyStatus")
    },
    {
      button: document.getElementById("copyUpiNumber"),
      value: document.getElementById("mobileUpiNumber"),
      status: document.getElementById("upiNumberCopyStatus")
    }
  ];

  copyTargets.forEach(({ button, value, status }) => {
    if (!button || !value || !status) return;
    button.addEventListener("click", () => {
      copyPaymentDetail(value.textContent.trim(), status, button);
    });
  });
});


/* ===== Accessible scroll-reveal animation ===== */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-visual, .section-heading, .story-card, .learning-card, .experience-card, .support-copy, .payment-card, .opportunity-card, .social-content, .closing-section"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("active"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -35px 0px"
  });

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });
});
