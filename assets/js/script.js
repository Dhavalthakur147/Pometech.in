const API_BASE_URL = "https://pometech-in.onrender.com/api";
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  observer.observe(item);
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const form = new FormData(contactForm);
    const service = String(form.get("service") || "").trim();
    const message = String(form.get("message") || "").trim();
    const originalText = submitButton?.textContent || "Send Enquiry";

    const payload = {
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim(),
      service: String(form.get("service") || "").trim(),
      message: `Service: ${service}\n\n${message || "Please contact me about this service."}`
    };

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send enquiry right now.");
      }

      contactForm.reset();
      if (submitButton) submitButton.textContent = "Enquiry Sent";
      setTimeout(() => {
        if (submitButton) submitButton.textContent = originalText;
      }, 1800);
    } catch (error) {
      if (submitButton) submitButton.textContent = error.message || "Try Again";
      setTimeout(() => {
        if (submitButton) submitButton.textContent = originalText;
      }, 2200);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
