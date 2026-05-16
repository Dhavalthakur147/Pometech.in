const API_BASE_URL = "https://pometech-in.onrender.com/api";
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const portfolioGrid = document.querySelector("[data-portfolio-grid]");
const servicesGrid = document.querySelector("[data-services-grid]");
const demoWorkGrid = document.querySelector("[data-demo-work-grid]");
const estimateForm = document.querySelector("[data-estimate-form]");
const estimateTotal = document.querySelector("[data-estimate-total]");
const languageToggle = document.querySelector("[data-language-toggle]");
const languageKey = "pomotech-language";

const translations = {
  gu: {
    "nav.home": "હોમ",
    "nav.about": "અમારા વિશે",
    "nav.services": "સેવાઓ",
    "nav.demo": "ડેમો વર્ક",
    "nav.estimate": "અંદાજ",
    "nav.faq": "FAQ",
    "nav.contact": "સંપર્ક",
    "hero.eyebrow": "પોમેગ્રેનેટ ટેક્નોલોજી",
    "hero.title": "તમારો બિઝનેસ ડિજિટલ બનાવો",
    "hero.tagline": "ડિઝાઇન <span></span> ડેવલપ <span></span> ઓટોમેટ",
    "hero.copy": "નાના બિઝનેસ, સ્ટાર્ટઅપ અને સર્વિસ પ્રોવાઇડર માટે વેબસાઇટ, એપ, લોગો ડિઝાઇન, સોશિયલ મીડિયા ક્રિએટિવ્સ, શોપ સિસ્ટમ અને Excel automation.",
    "hero.primary": "પ્રોજેક્ટ શરૂ કરો",
    "hero.secondary": "સેવાઓ જુઓ",
    "stats.projects": "ક્રિએટિવ પ્રોજેક્ટ્સ",
    "stats.clients": "બિઝનેસ ક્લાયન્ટ્સ",
    "stats.launch": "ઝડપી લોન્ચ વિકલ્પ",
    "stats.support": "વોટ્સએપ સપોર્ટ",
    "trust.simple.title": "સરળ પ્રક્રિયા",
    "trust.simple.copy": "તમારી જરૂરિયાત જણાવો, પ્લાન approve કરો અને clear updates સાથે delivery track કરો.",
    "trust.secure.title": "સુરક્ષિત ડિલિવરી",
    "trust.secure.copy": "Admin access, business data અને project assets કાળજીપૂર્વક handle થાય છે.",
    "trust.growth.title": "ગ્રોથ માટે તૈયાર",
    "trust.growth.copy": "દરેક website, design અને system વધુ enquiries મેળવવા માટે બનાવવામાં આવે છે.",
    "about.eyebrow": "ઓલ-ઇન-વન ડિજિટલ પાર્ટનર",
    "about.title": "તમારી બિઝનેસ વેબસાઇટ, બ્રાન્ડિંગ અને automation એક જ જગ્યાએ.",
    "about.copy": "Pomegranate Technology retailers, service providers, agencies અને local businessesને strong online presence બનાવવા મદદ કરે છે. અમે real daily use માટે easy digital systems બનાવીએ છીએ.",
    "about.cta": "વધુ જાણો",
    "platform.website.title": "બિઝનેસ વેબસાઇટ",
    "platform.website.copy": "Landing pages, company sites અને portfolios",
    "platform.design.title": "ક્રિએટિવ ડિઝાઇન",
    "platform.design.copy": "Logo, posters, banners અને social media posts",
    "platform.automation.title": "ઓટોમેશન",
    "platform.automation.copy": "Excel dashboards, shop systems અને custom tools",
    "services.eyebrow": "ડિજિટલ સોલ્યુશન્સ",
    "services.title": "Real business work માટે બનેલી સેવાઓ.",
    "service.logo.title": "લોગો ડિઝાઇન",
    "service.logo.copy": "Professional first impression માટે યાદ રહી જાય તેવો brand mark અને identity visuals.",
    "service.website.title": "વેબસાઇટ ડેવલપમેન્ટ",
    "service.website.copy": "Visitorsને customersમાં ફેરવવા માટે modern, responsive, SEO-ready websites.",
    "service.app.title": "એપ ડેવલપમેન્ટ",
    "service.app.copy": "Services, shops, teams અને customer workflows માટે clean mobile અને web app experiences.",
    "service.data.title": "ડેટા એનાલિસિસ અને Excel Automation",
    "service.data.copy": "Dashboards, reports, formulas અને automations જે business data સરળ બનાવે છે.",
    "service.shop.title": "કસ્ટમ શોપ મેનેજમેન્ટ સિસ્ટમ",
    "service.shop.copy": "Inventory, billing, customer records અને shop operations તમારા process મુજબ.",
    "service.social.title": "સોશિયલ મીડિયા અને બેનર ડિઝાઇન",
    "service.social.copy": "Instagram posts, ad banners, festival creatives અને brand campaign graphics.",
    "demo.eyebrow": "ડેમો વર્ક",
    "demo.title": "તમારા બિઝનેસ માટે sample work જુઓ.",
    "demo.website.title": "બિઝનેસ વેબસાઇટ ડેમો",
    "demo.website.copy": "Service businesses માટે sample modern website layout.",
    "demo.logo.title": "લોગો ડિઝાઇન ડેમો",
    "demo.logo.copy": "Small business માટે professional brand identity sample.",
    "demo.dashboard.title": "ડેશબોર્ડ ડેમો",
    "demo.dashboard.copy": "Simple business dashboard અને report design sample.",
    "estimate.eyebrow": "પ્રોજેક્ટ અંદાજ",
    "estimate.title": "ઝડપી budget idea મેળવો.",
    "estimate.range": "અંદાજિત રેન્જ",
    "estimate.copy": "Final pricing pages, features, content અને delivery timeline પર આધારિત છે.",
    "estimate.projectType": "પ્રોજેક્ટ પ્રકાર",
    "estimate.pages": "Pages / Screens",
    "estimate.features": "Extra Features",
    "estimate.speed": "Delivery Speed",
    "estimate.button": "અંદાજ ગણો",
    "why.eyebrow": "અમને કેમ પસંદ કરશો",
    "why.title": "Premium quality, practical pricing અને સતત support.",
    "why.design": "Professional Design",
    "why.delivery": "Fast Delivery",
    "why.pricing": "Affordable Pricing",
    "why.support": "Lifetime Support",
    "why.growth": "Business Growth Focused",
    "transform.identity.title": "તમારી ઓળખ બનાવો",
    "transform.identity.copy": "Logo, brand visuals અને social media creativesથી business professional દેખાડો.",
    "transform.online.title": "Online Launch કરો",
    "transform.online.copy": "Clear services, contact forms અને WhatsApp leads સાથે fast mobile-friendly website મેળવો.",
    "transform.smart.title": "Smart રીતે manage કરો",
    "transform.smart.copy": "Manual work ઘટાડવા Excel dashboards, billing sheets અને custom systems વાપરો.",
    "faq.eyebrow": "FAQ",
    "faq.title": "શરૂ કરતા પહેલા સામાન્ય પ્રશ્નો.",
    "faq.delivery.q": "Website કેટલી ઝડપથી deliver થશે?",
    "faq.delivery.a": "Simple business website content અને requirements confirm થયા પછી 5 થી 7 working daysમાં શરૂ થઈ શકે છે.",
    "faq.update.q": "શું હું પછી website content update કરી શકું?",
    "faq.update.a": "હા. તમારું admin panel website text, services, portfolio અને images update કરી શકે છે.",
    "faq.design.q": "Logo અને social media designs મળે છે?",
    "faq.design.a": "હા. અમે logo design, posters, Instagram posts, banners, thumbnails અને festival creatives બનાવીએ છીએ.",
    "faq.tools.q": "Custom business tools બનાવી શકો?",
    "faq.tools.a": "હા. અમે Excel automation, dashboards, shop management systems અને simple web apps workflow મુજબ બનાવીએ છીએ.",
    "testimonials.one": "\"Clean website, quick support અને practical design મળ્યું.\"",
    "testimonials.owner": "Business Owner",
    "testimonials.two": "\"Posters અને logo professional લાગ્યા, delivery પણ fast હતી.\"",
    "testimonials.retail": "Retail Client",
    "testimonials.three": "\"Excel automationથી daily reporting અને billingમાં સમય બચ્યો.\"",
    "testimonials.provider": "Service Provider",
    "offer.eyebrow": "આજે શરૂ કરો",
    "offer.title": "Digital solutions Rs 2999/- થી શરૂ",
    "offer.copy": "Design અથવા landing pageથી શરૂઆત કરો, પછી websites, automation, apps અને business systemsમાં scale કરો.",
    "offer.button": "વોટ્સએપ કરો",
    "cta.eyebrow": "Grow કરવા તૈયાર?",
    "cta.title": "આજે તમારું digital business setup શરૂ કરો.",
    "cta.button": "Enquiry મોકલો",
    "footer.copy": "Pomegranate Technology businessesને modern digital solutions દ્વારા innovate, transform અને grow કરવામાં મદદ કરે છે.",
    "footer.quick": "ઝડપી લિંક્સ",
    "footer.portfolio": "પોર્ટફોલિયો",
    "footer.core": "Core Services",
    "footer.more": "More Services",
    "footer.connect": "કનેક્ટ"
  }
};

function applyLanguage(language = localStorage.getItem(languageKey) || "en") {
  document.documentElement.lang = language === "gu" ? "gu" : "en";
  document.querySelectorAll("[data-i18n]").forEach((item) => {
    if (!item.dataset.i18nDefault) item.dataset.i18nDefault = item.textContent;
    const value = language === "en" ? item.dataset.i18nDefault : translations[language]?.[item.dataset.i18n];
    if (value) item.textContent = value;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((item) => {
    if (!item.dataset.i18nDefaultHtml) item.dataset.i18nDefaultHtml = item.innerHTML;
    const value = language === "en" ? item.dataset.i18nDefaultHtml : translations[language]?.[item.dataset.i18nHtml];
    if (value) item.innerHTML = value;
  });
  if (languageToggle) languageToggle.textContent = language === "gu" ? "English" : "ગુજરાતી";
}

languageToggle?.addEventListener("click", () => {
  const next = (localStorage.getItem(languageKey) || "en") === "gu" ? "en" : "gu";
  localStorage.setItem(languageKey, next);
  applyLanguage(next);
});

async function applySiteContent() {
  const targets = document.querySelectorAll("[data-site-text]");
  if (!targets.length) return;

  try {
    const response = await fetch(`${API_BASE_URL}/site-content`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.data)) return;

    const content = new Map(result.data.map((item) => [item.key, item.value]));
    targets.forEach((target) => {
      const value = content.get(target.dataset.siteText);
      if (value) target.textContent = value;
    });
    applyLanguage();
  } catch (_error) {
    // Static fallback content remains visible if the API is unavailable.
  }
}

applySiteContent();
applyLanguage();

async function loadPortfolioGrid() {
  if (!portfolioGrid) return;

  try {
    const response = await fetch(`${API_BASE_URL}/portfolio`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.data) || !result.data.length) return;

    portfolioGrid.replaceChildren(...result.data.map((item) => {
      const card = document.createElement("article");
      card.className = "work-card reveal visible";

      const image = document.createElement("img");
      image.decoding = "async";
      image.loading = "lazy";
      image.src = item.image || "image/logo.webp";
      image.alt = `${item.title || item.category || "Portfolio"} portfolio`;

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title || item.category || "Portfolio Work";
      const description = document.createElement("p");
      description.textContent = item.description || item.category || "Pomegranate Technology portfolio work.";

      body.append(title, description);
      card.append(image, body);
      return card;
    }));
  } catch (_error) {
    // Static portfolio cards remain visible if the API is unavailable.
  }
}

loadPortfolioGrid();

async function loadDemoWorkGrid() {
  if (!demoWorkGrid) return;

  try {
    const response = await fetch(`${API_BASE_URL}/demo-work`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.data) || !result.data.length) return;

    demoWorkGrid.replaceChildren(...result.data.map((item) => {
      const card = document.createElement(item.link ? "a" : "article");
      card.className = "work-card reveal visible";
      if (item.link) {
        card.href = item.link;
        card.target = "_blank";
        card.rel = "noreferrer";
      }

      const image = document.createElement("img");
      image.decoding = "async";
      image.loading = "lazy";
      image.src = item.image || "image/logo.webp";
      image.alt = `${item.title || "Demo work"} sample`;

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title || "Demo Work";
      const description = document.createElement("p");
      description.textContent = item.description || item.category || "Sample demo work.";

      body.append(title, description);
      card.append(image, body);
      return card;
    }));
  } catch (_error) {
    // Static demo cards remain visible if the API is unavailable.
  }
}

loadDemoWorkGrid();

async function loadServicesGrid() {
  if (!servicesGrid) return;

  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.data) || !result.data.length) return;

    servicesGrid.replaceChildren(...result.data.map((item) => {
      const card = document.createElement("article");
      card.className = "service-card detailed-card reveal visible";

      const icon = document.createElement("span");
      icon.className = "service-icon";
      icon.textContent = item.icon || String(item.title || "PT").slice(0, 3).toUpperCase();

      const title = document.createElement("h2");
      title.textContent = item.title || "Service";

      const description = document.createElement("p");
      description.textContent = item.description || "Digital service by Pomegranate Technology.";

      const link = document.createElement("a");
      link.className = "card-cta";
      link.href = "contact.html";
      link.textContent = item.price ? `Start From Rs ${item.price}` : "Contact Now";

      card.append(icon, title, description, link);
      return card;
    }));
  } catch (_error) {
    // Static service cards remain visible if the API is unavailable.
  }
}

loadServicesGrid();

function updateEstimate() {
  if (!estimateForm || !estimateTotal) return;

  const form = new FormData(estimateForm);
  const base = Number(form.get("type") || 0);
  const pages = Math.max(1, Number(form.get("pages") || 1));
  const features = Number(form.get("features") || 0);
  const speed = Number(form.get("speed") || 0);
  const pageCost = Math.max(0, pages - 1) * 900;
  const low = base + pageCost + features + speed;
  const high = Math.round(low * 1.35);
  estimateTotal.textContent = `Rs ${low.toLocaleString("en-IN")} - Rs ${high.toLocaleString("en-IN")}`;
}

estimateForm?.addEventListener("input", updateEstimate);
estimateForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateEstimate();
});
updateEstimate();

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
  const startedAt = contactForm.querySelector("[data-started-at]");
  const recaptchaSiteKey = contactForm.dataset.recaptchaSiteKey?.trim() || "";
  const recaptchaTarget = contactForm.querySelector("[data-recaptcha]");
  let recaptchaWidgetId = null;

  if (startedAt) startedAt.value = String(Date.now());

  if (recaptchaSiteKey && recaptchaTarget) {
    window.pomotechRenderCaptcha = () => {
      if (!window.grecaptcha || recaptchaWidgetId !== null) return;
      recaptchaWidgetId = window.grecaptcha.render(recaptchaTarget, {
        sitekey: recaptchaSiteKey
      });
    };

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?onload=pomotechRenderCaptcha&render=explicit";
    script.async = true;
    script.defer = true;
    document.head.append(script);
  }

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
      website: String(form.get("website") || "").trim(),
      startedAt: Number(form.get("startedAt") || Date.now()),
      recaptchaToken: String(form.get("g-recaptcha-response") || "").trim(),
      message: `Service: ${service}\n\n${message || "Please contact me about this service."}`
    };

    try {
      if (recaptchaSiteKey && !payload.recaptchaToken) {
        throw new Error("Please complete the security check.");
      }

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
      if (startedAt) startedAt.value = String(Date.now());
      if (window.grecaptcha && recaptchaWidgetId !== null) window.grecaptcha.reset(recaptchaWidgetId);
      if (submitButton) submitButton.textContent = "Enquiry Sent";
      setTimeout(() => {
        if (submitButton) submitButton.textContent = originalText;
      }, 1800);
    } catch (error) {
      if (window.grecaptcha && recaptchaWidgetId !== null) window.grecaptcha.reset(recaptchaWidgetId);
      if (submitButton) submitButton.textContent = error.message || "Try Again";
      setTimeout(() => {
        if (submitButton) submitButton.textContent = originalText;
      }, 2200);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
