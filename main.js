// TaQnivo — main.js
// Software-first company website with scroll animations, counters, theme toggle, and form handling

// ── Theme Toggle (dark/light) ─────────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

// Load saved preference or default to dark
const savedTheme = localStorage.getItem("taqnivo-theme") || "dark";
if (savedTheme === "light") {
  htmlEl.setAttribute("data-theme", "light");
}

themeToggle.addEventListener("click", () => {
  const isLight = htmlEl.getAttribute("data-theme") === "light";
  if (isLight) {
    htmlEl.removeAttribute("data-theme");
    localStorage.setItem("taqnivo-theme", "dark");
  } else {
    htmlEl.setAttribute("data-theme", "light");
    localStorage.setItem("taqnivo-theme", "light");
  }
});

// ── Google Translate Init ─────────────────────────────────────────────────────
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,ar,hi,ur,fr",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element"
  );
}
// Expose globally for Google's callback
window.googleTranslateElementInit = googleTranslateElementInit;

// ── Language Switcher ─────────────────────────────────────────────────────────
const langSwitcher = document.getElementById("langSwitcher");
const langBtn = document.getElementById("langBtn");
const langDropdown = document.getElementById("langDropdown");
const langCodeEl = document.getElementById("langCode");
const langOptions = langDropdown.querySelectorAll(".lang-option");

const langLabels = { en: "EN", ar: "AR", hi: "HI", ur: "UR", fr: "FR" };

// Toggle dropdown
langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  langSwitcher.classList.toggle("open");
});

// Close on outside click
document.addEventListener("click", (e) => {
  if (!langSwitcher.contains(e.target)) {
    langSwitcher.classList.remove("open");
  }
});

// Select a language
langOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const lang = option.getAttribute("data-lang");

    // Update active state
    langOptions.forEach((o) => o.classList.remove("active"));
    option.classList.add("active");

    // Update button label
    langCodeEl.textContent = langLabels[lang] || lang.toUpperCase();

    // Close dropdown
    langSwitcher.classList.remove("open");

    // Trigger Google Translate
    triggerGoogleTranslate(lang);
  });
});

function triggerGoogleTranslate(lang) {
  const domain = window.location.hostname;
  
  // Clear any existing translation cookies to prevent conflicts
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;

  if (lang !== "en") {
    // Set the new translation cookie (format: /source/target)
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    document.cookie = `googtrans=/en/${lang}; domain=${domain}; path=/;`;
    document.cookie = `googtrans=/en/${lang}; domain=.${domain}; path=/;`;
  }
  
  // Reload to let Google Translate script read the cookie and auto-translate
  window.location.reload();
}

// ── Navbar scroll effect ──────────────────────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});

// ── Hamburger menu ────────────────────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("mobile-open");
});

// Close menu when a nav link is tapped
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("mobile-open");
  });
});

// Close menu on outside tap
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove("open");
    navLinks.classList.remove("mobile-open");
  }
});

// ── Scroll Reveal Animations ──────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Once revealed, stop observing for performance
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ── Animated Counters ─────────────────────────────────────────────────────────
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "+";
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
          return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutQuart(progress);
          const currentValue = Math.floor(easedProgress * target);

          el.textContent = currentValue + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((el) => {
  counterObserver.observe(el);
});

// ── Active Nav Link Highlighting ──────────────────────────────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-links a[href^='#']");

const navHighlightObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinksAll.forEach((link) => {
          link.style.color = "";
          if (link.getAttribute("href") === `#${id}`) {
            link.style.color = "var(--accent-light)";
          }
        });
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: "-20% 0px -60% 0px",
  }
);

sections.forEach((section) => {
  navHighlightObserver.observe(section);
});

// ── Smooth parallax on hero glow orbs ─────────────────────────────────────────
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const hero = document.getElementById("hero");
      if (hero && scrollY < window.innerHeight) {
        hero.style.setProperty("--scroll-y", `${scrollY * 0.3}px`);
      }
      ticking = false;
    });
    ticking = true;
  }
});

// ── Contact Form (Formspree) ──────────────────────────────────────────────────
const FORMSPREE_ID = "xzdqajev";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact .contact-form");
  if (!form) return;

  const status = document.createElement("div");
  status.className = "form-status";
  status.style.cssText = `
    display: none;
    padding: 0.85rem 1rem;
    border-radius: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  `;
  form.insertBefore(status, form.querySelector("button[type='submit']"));

  const rules = {
    name: {
      min: 2,
      message: "Please enter your full name (at least 2 characters).",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address.",
    },
    subject: { min: 4, message: "Subject must be at least 4 characters." },
    message: { min: 10, message: "Message must be at least 10 characters." },
  };

  function getErrorEl(input) {
    let el = input.nextElementSibling;
    if (!el || !el.classList.contains("field-error")) {
      el = document.createElement("span");
      el.className = "field-error";
      el.style.cssText = `
        display: block;
        font-size: 0.75rem;
        color: rgba(255,100,100,0.9);
        margin-top: 4px;
        font-family: 'DM Sans', sans-serif;
      `;
      input.insertAdjacentElement("afterend", el);
    }
    return el;
  }

  function validateField(input) {
    const name = input.getAttribute("data-field");
    const rule = rules[name];
    if (!rule) return true;
    const val = input.value.trim();
    let valid = true;
    if (!val) valid = false;
    else if (rule.min && val.length < rule.min) valid = false;
    else if (rule.pattern && !rule.pattern.test(val)) valid = false;
    const errEl = getErrorEl(input);
    if (!valid) {
      input.style.borderColor = "rgba(255,80,80,0.5)";
      input.style.boxShadow = "0 0 12px rgba(255,80,80,0.15)";
      errEl.textContent = rule.message;
      errEl.style.display = "block";
    } else {
      input.style.borderColor = "var(--border)";
      input.style.boxShadow = "none";
      errEl.textContent = "";
      errEl.style.display = "none";
    }
    return valid;
  }

  form.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => {
      if (el.style.borderColor === "rgba(255,80,80,0.5)") validateField(el);
    });
  });

  function showStatus(msg, success) {
    status.textContent = msg;
    status.style.display = "block";
    if (success) {
      status.style.background = "rgba(0,206,201,0.1)";
      status.style.color = "rgba(0,206,201,0.95)";
      status.style.border = "1px solid rgba(0,206,201,0.25)";
    } else {
      status.style.background = "rgba(255,80,80,0.1)";
      status.style.color = "rgba(255,150,150,0.95)";
      status.style.border = "1px solid rgba(255,80,80,0.25)";
    }
    setTimeout(() => {
      status.style.display = "none";
    }, 6000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (!validateField(el)) allValid = false;
    });
    if (!allValid) return;

    const btn = form.querySelector("button[type='submit']");
    const original = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;
    btn.style.opacity = "0.65";

    const data = {
      name: form.querySelector("[data-field='name']").value.trim(),
      email: form.querySelector("[data-field='email']").value.trim(),
      subject: form.querySelector("[data-field='subject']").value.trim(),
      message: form.querySelector("[data-field='message']").value.trim(),
    };

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showStatus(
          "✓ Message sent! We'll get back to you within 24 hours.",
          true,
        );
        form.reset();
        form.querySelectorAll("input, textarea").forEach((el) => {
          el.style.borderColor = "";
          el.style.boxShadow = "";
          const err = getErrorEl(el);
          err.style.display = "none";
        });
      } else {
        const json = await res.json();
        const msg =
          json?.errors?.[0]?.message ||
          "Something went wrong. Please try again.";
        showStatus("✗ " + msg, false);
      }
    } catch {
      showStatus(
        "✗ Network error. Please check your connection and try again.",
        false,
      );
    } finally {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  });
});