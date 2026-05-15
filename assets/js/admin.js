const API_BASE_URL = "https://pometech-in.onrender.com/api";
const authKey = "pomotech-admin-auth";
const adminKey = "pomotech-admin-user";
const historyKey = "pomotech-admin-history-clean";
const loginForm = document.querySelector("[data-login-form]");
const loginError = document.querySelector("[data-login-error]");
const forgotButton = document.querySelector("[data-forgot]");
const dashboardPage = document.body.classList.contains("dashboard-page");
const loader = document.querySelector("[data-loader]");

const getAuthToken = () => localStorage.getItem(authKey);
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`
});

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(getAuthToken() ? getAuthHeaders() : { "Content-Type": "application/json" })
    }
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Backend request failed.");
  }

  return result;
}

if (loginForm) {
  if (localStorage.getItem(authKey)) {
    window.location.href = "admin-dashboard.html";
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const submitButton = loginForm.querySelector("button[type='submit']");
    const originalText = submitButton?.textContent || "Login";

    if (!email.includes("@") || password.length < 6) {
      loginError.textContent = "Enter a valid email and a password with 6+ characters.";
      return;
    }

    try {
      loginError.textContent = "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Invalid email or password.");
      }

      localStorage.setItem(authKey, result.token);
      localStorage.setItem(adminKey, JSON.stringify(result.admin));
      localStorage.setItem("pomotech-admin-email", result.admin?.email || email);
      window.location.href = "admin-dashboard.html";
    } catch (error) {
      loginError.textContent = error.message || "Login failed. Please try again.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
}

if (forgotButton) {
  forgotButton.addEventListener("click", async () => {
    const email = String(new FormData(loginForm).get("email") || "");

    if (!email.includes("@")) {
      loginError.textContent = "Enter your admin email first.";
      return;
    }

    try {
      forgotButton.disabled = true;
      loginError.textContent = "";
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send reset email.");
      }

      loginError.textContent = result.message || "If the email exists, reset instructions were sent.";
    } catch (error) {
      loginError.textContent = error.message || "Unable to send reset email.";
    } finally {
      forgotButton.disabled = false;
    }
  });
}

if (dashboardPage && !localStorage.getItem(authKey)) {
  window.location.href = "admin-login.html";
}

window.addEventListener("load", async () => {
  setTimeout(() => loader?.classList.add("hidden"), 450);
  loadAdminProfile();
  if (dashboardPage) {
    await loadDashboardOverview();
    await Promise.all([loadAdminUsers(), loadSiteContent(), loadPortfolio(), loadServices(), loadDemoWork(), loadMessages()]);
    await loadAnalysisCharts();
  }
  drawCharts();
  animateCounters();
});

const sidebar = document.querySelector("[data-sidebar]");
const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
const menuButtons = document.querySelectorAll("[data-section-target]");
const sections = document.querySelectorAll("[data-section]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const globalSearch = document.querySelector("[data-global-search]");
const tableSearch = document.querySelector("[data-table-search]");
const statusFilter = document.querySelector("[data-status-filter]");
const logoutButtons = document.querySelectorAll("[data-logout]");
const adminUserForm = document.querySelector("[data-admin-user-form]");
const adminUsersBody = document.querySelector("[data-admin-users]");
const adminUserStatus = document.querySelector("[data-admin-user-status]");
const refreshAdminsButton = document.querySelector("[data-refresh-admins]");
const siteContentForm = document.querySelector("[data-site-content-form]");
const siteContentBody = document.querySelector("[data-site-content-list]");
const siteContentStatus = document.querySelector("[data-site-content-status]");
const refreshSiteContentButton = document.querySelector("[data-refresh-site-content]");
const siteContentPreset = document.querySelector("[data-site-content-preset]");
const historyForm = document.querySelector("[data-history-form]");
const clearHistoryButton = document.querySelector("[data-clear-history]");
const portfolioForm = document.querySelector("[data-portfolio-form]");
const portfolioBody = document.querySelector("[data-portfolio-list]");
const portfolioStatus = document.querySelector("[data-portfolio-status]");
const refreshPortfolioButton = document.querySelector("[data-refresh-portfolio]");
const portfolioImageInput = document.querySelector("[data-portfolio-image-input]");
const serviceForm = document.querySelector("[data-service-form]");
const serviceBody = document.querySelector("[data-service-list]");
const serviceStatus = document.querySelector("[data-service-status]");
const refreshServicesButton = document.querySelector("[data-refresh-services]");
const serviceImageInput = document.querySelector("[data-service-image-input]");
const demoWorkForm = document.querySelector("[data-demo-work-form]");
const demoWorkBody = document.querySelector("[data-demo-work-list]");
const demoWorkStatus = document.querySelector("[data-demo-work-status]");
const refreshDemoWorkButton = document.querySelector("[data-refresh-demo-work]");
const demoWorkImageInput = document.querySelector("[data-demo-work-image-input]");
const messageBody = document.querySelector("[data-message-list]");
const refreshMessagesButton = document.querySelector("[data-refresh-messages]");
const refreshAnalysisButton = document.querySelector("[data-refresh-analysis]");

const siteContentPresets = {
  "home.hero.eyebrow": { label: "Home brand eyebrow", type: "text", value: "Pomegranate Technology" },
  "home.hero.title": { label: "Home main title", type: "textarea", value: "Grow Your Business With Digital Services" },
  "home.hero.tagline": { label: "Home tagline", type: "text", value: "Design Develop Automate" },
  "home.hero.copy": { label: "Home hero description", type: "textarea", value: "Websites, apps, logo design, social media creatives, shop systems and Excel automation for small businesses, startups and service providers." },
  "site.footer.copy": { label: "Footer description", type: "textarea", value: "Pomegranate Technology helps businesses innovate, transform, and grow through modern digital solutions." }
};

sidebarToggle?.addEventListener("click", () => sidebar?.classList.toggle("open"));

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.sectionTarget;
    menuButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    sections.forEach((section) => section.classList.toggle("active", section.id === target));
    sidebar?.classList.remove("open");
    drawCharts();
  });
});

themeToggle?.addEventListener("click", () => {
  const isLight = document.body.dataset.theme === "light";
  document.body.dataset.theme = isLight ? "dark" : "light";
  themeToggle.textContent = isLight ? "Light" : "Dark";
  drawCharts();
});

logoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.removeItem(authKey);
    localStorage.removeItem(adminKey);
    localStorage.removeItem("pomotech-admin-email");
    window.location.href = "admin-login.html";
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "Ready";
    setTimeout(() => {
      button.textContent = button.dataset.action;
    }, 900);
  });
});

refreshAdminsButton?.addEventListener("click", loadAdminUsers);
refreshSiteContentButton?.addEventListener("click", loadSiteContent);
refreshPortfolioButton?.addEventListener("click", loadPortfolio);
portfolioImageInput?.addEventListener("change", uploadPortfolioImage);
refreshServicesButton?.addEventListener("click", loadServices);
serviceImageInput?.addEventListener("change", uploadServiceImage);
refreshDemoWorkButton?.addEventListener("click", loadDemoWork);
demoWorkImageInput?.addEventListener("change", uploadDemoWorkImage);
refreshMessagesButton?.addEventListener("click", loadMessages);
refreshAnalysisButton?.addEventListener("click", async () => {
  await loadDashboardOverview();
  await loadAnalysisCharts();
  animateCounters();
});

siteContentPreset?.addEventListener("change", () => {
  const key = siteContentPreset.value;
  const preset = siteContentPresets[key];
  if (!preset || !siteContentForm) return;

  siteContentForm.elements.key.value = key;
  siteContentForm.elements.label.value = preset.label;
  siteContentForm.elements.type.value = preset.type;
  siteContentForm.elements.value.value = preset.value;
  siteContentStatus.textContent = "Preset loaded. Edit text and save.";
});

document.querySelectorAll("[data-section-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`[data-section-target="${button.dataset.sectionJump}"]`)?.click();
  });
});

historyForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = historyForm.elements.history;
  const text = String(input.value || "").trim();
  if (!text) return;

  const history = getSavedHistory();
  history.unshift(text);
  saveHistory(history.slice(0, 20));
  input.value = "";
  renderHistory(history);
});

clearHistoryButton?.addEventListener("click", () => {
  saveHistory([]);
  renderHistory([]);
});

adminUserForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(adminUserForm);
  const id = String(form.get("id") || "");
  const payload = {
    name: String(form.get("name") || "").trim(),
    email: String(form.get("email") || "").trim(),
    password: String(form.get("password") || ""),
    role: String(form.get("role") || "admin")
  };
  if (!payload.password) delete payload.password;

  try {
    adminUserStatus.textContent = "";
    await apiRequest(id ? `/admin-users/${id}` : "/admin-users", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    adminUserForm.reset();
    adminUserForm.elements.role.value = "super_admin";
    adminUserStatus.textContent = "Admin saved successfully.";
    await loadAdminUsers();
  } catch (error) {
    adminUserStatus.textContent = error.message || "Unable to save admin.";
  }
});

adminUsersBody?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const row = button.closest("tr");

  if (button.dataset.editAdmin !== undefined) {
    adminUserForm.elements.id.value = row.dataset.id;
    adminUserForm.elements.name.value = row.dataset.name;
    adminUserForm.elements.email.value = row.dataset.email;
    adminUserForm.elements.role.value = row.dataset.role;
    adminUserForm.elements.password.value = "";
    adminUserStatus.textContent = "Editing selected admin. Leave password blank to keep old password.";
  }

  if (button.dataset.deleteAdmin !== undefined) {
    try {
      await apiRequest(`/admin-users/${row.dataset.id}`, { method: "DELETE" });
      await loadAdminUsers();
    } catch (error) {
      adminUserStatus.textContent = error.message || "Unable to delete admin.";
    }
  }
});

siteContentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(siteContentForm);
  const payload = {
    key: String(form.get("key") || "").trim(),
    label: String(form.get("label") || "").trim(),
    type: String(form.get("type") || "text"),
    value: String(form.get("value") || "").trim()
  };

  try {
    siteContentStatus.textContent = "";
    await apiRequest("/site-content", { method: "POST", body: JSON.stringify(payload) });
    siteContentForm.reset();
    siteContentStatus.textContent = "Website content saved. Refresh the site page to see it.";
    await loadSiteContent();
  } catch (error) {
    siteContentStatus.textContent = error.message || "Unable to save website content.";
  }
});

siteContentBody?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const row = button.closest("tr");

  if (button.dataset.editContent !== undefined) {
    siteContentForm.elements.key.value = row.dataset.key;
    siteContentForm.elements.label.value = row.dataset.label;
    siteContentForm.elements.type.value = row.dataset.type;
    siteContentForm.elements.value.value = row.dataset.value;
    siteContentStatus.textContent = "Editing selected website content key.";
  }

  if (button.dataset.deleteContent !== undefined) {
    try {
      await apiRequest(`/site-content/${encodeURIComponent(row.dataset.key)}`, { method: "DELETE" });
      await loadSiteContent();
    } catch (error) {
      siteContentStatus.textContent = error.message || "Unable to delete website content.";
    }
  }
});

portfolioForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(portfolioForm);
  const id = String(form.get("id") || "");
  const payload = {
    title: String(form.get("title") || "").trim(),
    category: String(form.get("category") || "").trim(),
    image: String(form.get("image") || "").trim(),
    description: String(form.get("description") || "").trim()
  };

  try {
    portfolioStatus.textContent = "";
    await apiRequest(id ? `/portfolio/${id}` : "/portfolio", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    portfolioForm.reset();
    portfolioStatus.textContent = "Portfolio saved successfully.";
    await loadPortfolio();
  } catch (error) {
    portfolioStatus.textContent = error.message || "Unable to save portfolio.";
  }
});

portfolioBody?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const row = button.closest("tr");

  if (button.dataset.editPortfolio !== undefined) {
    portfolioForm.elements.id.value = row.dataset.id;
    portfolioForm.elements.title.value = row.dataset.title;
    portfolioForm.elements.category.value = row.dataset.category;
    portfolioForm.elements.image.value = row.dataset.image;
    portfolioForm.elements.description.value = row.dataset.description;
    portfolioStatus.textContent = "Editing selected portfolio item.";
  }

  if (button.dataset.deletePortfolio !== undefined) {
    try {
      await apiRequest(`/portfolio/${row.dataset.id}`, { method: "DELETE" });
      portfolioStatus.textContent = "Portfolio deleted.";
      await loadPortfolio();
    } catch (error) {
      portfolioStatus.textContent = error.message || "Unable to delete portfolio.";
    }
  }
});

serviceForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(serviceForm);
  const id = String(form.get("id") || "");
  const price = String(form.get("price") || "").trim();
  const payload = {
    title: String(form.get("title") || "").trim(),
    description: String(form.get("description") || "").trim(),
    icon: String(form.get("icon") || "").trim(),
    image: String(form.get("image") || "").trim(),
    price: price ? Number(price) : null
  };

  try {
    serviceStatus.textContent = "";
    await apiRequest(id ? `/services/${id}` : "/services", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    serviceForm.reset();
    serviceStatus.textContent = "Service saved successfully.";
    await loadServices();
  } catch (error) {
    serviceStatus.textContent = error.message || "Unable to save service.";
  }
});

serviceBody?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const row = button.closest("tr");

  if (button.dataset.editService !== undefined) {
    serviceForm.elements.id.value = row.dataset.id;
    serviceForm.elements.title.value = row.dataset.title;
    serviceForm.elements.price.value = row.dataset.price;
    serviceForm.elements.icon.value = row.dataset.icon;
    serviceForm.elements.image.value = row.dataset.image;
    serviceForm.elements.description.value = row.dataset.description;
    serviceStatus.textContent = "Editing selected service.";
  }

  if (button.dataset.deleteService !== undefined) {
    try {
      await apiRequest(`/services/${row.dataset.id}`, { method: "DELETE" });
      serviceStatus.textContent = "Service deleted.";
      await loadServices();
    } catch (error) {
      serviceStatus.textContent = error.message || "Unable to delete service.";
    }
  }
});

demoWorkForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(demoWorkForm);
  const id = String(form.get("id") || "");
  const payload = {
    title: String(form.get("title") || "").trim(),
    category: String(form.get("category") || "").trim(),
    image: String(form.get("image") || "").trim(),
    link: String(form.get("link") || "").trim(),
    description: String(form.get("description") || "").trim()
  };

  try {
    demoWorkStatus.textContent = "";
    await apiRequest(id ? `/demo-work/${id}` : "/demo-work", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    demoWorkForm.reset();
    demoWorkStatus.textContent = "Demo work saved successfully.";
    await loadDemoWork();
  } catch (error) {
    demoWorkStatus.textContent = error.message || "Unable to save demo work.";
  }
});

demoWorkBody?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const row = button.closest("tr");

  if (button.dataset.editDemoWork !== undefined) {
    demoWorkForm.elements.id.value = row.dataset.id;
    demoWorkForm.elements.title.value = row.dataset.title;
    demoWorkForm.elements.category.value = row.dataset.category;
    demoWorkForm.elements.image.value = row.dataset.image;
    demoWorkForm.elements.link.value = row.dataset.link;
    demoWorkForm.elements.description.value = row.dataset.description;
    demoWorkStatus.textContent = "Editing selected demo work.";
  }

  if (button.dataset.deleteDemoWork !== undefined) {
    try {
      await apiRequest(`/demo-work/${row.dataset.id}`, { method: "DELETE" });
      demoWorkStatus.textContent = "Demo work deleted.";
      await loadDemoWork();
    } catch (error) {
      demoWorkStatus.textContent = error.message || "Unable to delete demo work.";
    }
  }
});

messageBody?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const row = button.closest("tr");

  if (button.dataset.deleteMessage !== undefined) {
    try {
      await apiRequest(`/messages/${row.dataset.id}`, { method: "DELETE" });
      await loadMessages();
    } catch (_error) {
      button.textContent = "Failed";
    }
  }
});

async function uploadPortfolioImage() {
  const file = portfolioImageInput.files?.[0];
  if (!file || !portfolioForm) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "portfolio");

  try {
    portfolioStatus.textContent = "Uploading image...";
    const response = await fetch(`${API_BASE_URL}/uploads?type=portfolio`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Unable to upload image.");
    }

    portfolioForm.elements.image.value = result.data?.url || "";
    portfolioStatus.textContent = "Image imported successfully.";
  } catch (error) {
    portfolioStatus.textContent = error.message || "Unable to upload image.";
  }
}

async function uploadServiceImage() {
  const file = serviceImageInput.files?.[0];
  if (!file || !serviceForm) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "services");

  try {
    serviceStatus.textContent = "Uploading image...";
    const response = await fetch(`${API_BASE_URL}/uploads?type=services`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.message || "Unable to upload image.");

    serviceForm.elements.image.value = result.data?.url || "";
    serviceStatus.textContent = "Image imported successfully.";
  } catch (error) {
    serviceStatus.textContent = error.message || "Unable to upload image.";
  }
}

async function uploadDemoWorkImage() {
  const file = demoWorkImageInput.files?.[0];
  if (!file || !demoWorkForm) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "demo-work");

  try {
    demoWorkStatus.textContent = "Uploading image...";
    const response = await fetch(`${API_BASE_URL}/uploads?type=demo-work`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) throw new Error(result.message || "Unable to upload image.");

    demoWorkForm.elements.image.value = result.data?.url || "";
    demoWorkStatus.textContent = "Image imported successfully.";
  } catch (error) {
    demoWorkStatus.textContent = error.message || "Unable to upload image.";
  }
}

globalSearch?.addEventListener("input", () => {
  const query = globalSearch.value.toLowerCase();
  if (!query) return;
  const match = Array.from(menuButtons).find((button) => button.textContent.toLowerCase().includes(query));
  match?.click();
});

tableSearch?.addEventListener("input", filterUsers);
statusFilter?.addEventListener("change", filterUsers);

function filterUsers() {
  const query = (tableSearch?.value || "").toLowerCase();
  const status = statusFilter?.value || "All Status";
  document.querySelectorAll("[data-user-table] tbody tr").forEach((row) => {
    const text = row.textContent.toLowerCase();
    const hasStatus = status === "All Status" || status === "Filter Users" || text.includes(status.toLowerCase());
    row.style.display = text.includes(query) && hasStatus ? "" : "none";
  });
}

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach((item) => {
    const target = Number(item.dataset.counter);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 48));
    const timer = setInterval(() => {
      current = Math.min(target, current + increment);
      item.textContent = formatMetric(current, item);
      if (current >= target) clearInterval(timer);
    }, 24);
  });
}

function loadAdminProfile() {
  const admin = JSON.parse(localStorage.getItem(adminKey) || "null");
  const adminName = document.querySelector("[data-admin-name]");
  const adminEmail = document.querySelector("[data-admin-email]");

  if (adminName && admin?.name) adminName.textContent = admin.name;
  if (adminEmail && admin?.email) adminEmail.textContent = admin.email;
}

async function loadDashboardOverview() {
  try {
    const { data } = await apiRequest("/dashboard/overview");

    document.querySelectorAll("[data-metric]").forEach((item) => {
      const value = Number(data[item.dataset.metric] || 0);
      item.dataset.counter = String(value);
      item.textContent = "0";
    });

    renderHistory(getSavedHistory());
  } catch (error) {
    if (error.message.toLowerCase().includes("token") || error.message.toLowerCase().includes("auth")) {
      localStorage.removeItem(authKey);
      window.location.href = "admin-login.html";
    }
  }
}

function getSavedHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    return Array.isArray(history) ? history : [];
  } catch (_error) {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(historyKey, JSON.stringify(history));
}

function renderHistory(history) {
  const recentActivities = document.querySelector("[data-recent-activities]");
  if (!recentActivities) return;

  const items = history.length ? history : ["No admin history yet."];
  recentActivities.replaceChildren(...items.map((activity) => {
    const item = document.createElement("li");
    item.textContent = activity;
    return item;
  }));
}

async function loadAdminUsers() {
  if (!adminUsersBody || !getAuthToken()) return;

  try {
    const { data } = await apiRequest("/admin-users");
    if (!data.length) {
      adminUsersBody.innerHTML = `<tr><td colspan="5">No admin users found.</td></tr>`;
      return;
    }

    adminUsersBody.innerHTML = data.map((admin) => `
      <tr data-id="${escapeHtml(admin.id)}" data-name="${escapeHtml(admin.name)}" data-email="${escapeHtml(admin.email)}" data-role="${escapeHtml(admin.role)}">
        <td>${escapeHtml(admin.name)}</td>
        <td>${escapeHtml(admin.email)}</td>
        <td><span class="status ${admin.role === "super_admin" ? "active" : "pending"}">${escapeHtml(admin.role)}</span></td>
        <td>${formatDate(admin.created_at)}</td>
        <td><button data-edit-admin>Edit</button><button data-delete-admin>Delete</button></td>
      </tr>
    `).join("");
  } catch (error) {
    adminUsersBody.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message || "Only super admin can view root accounts.")}</td></tr>`;
  }
}

async function loadSiteContent() {
  if (!siteContentBody) return;

  try {
    const { data } = await apiRequest("/site-content");
    if (!data.length) {
      siteContentBody.innerHTML = `<tr><td colspan="4">No content keys found.</td></tr>`;
      return;
    }

    siteContentBody.innerHTML = data.map((item) => `
      <tr data-key="${escapeHtml(item.key)}" data-label="${escapeHtml(item.label || "")}" data-type="${escapeHtml(item.type)}" data-value="${escapeHtml(item.value)}">
        <td>${escapeHtml(item.key)}</td>
        <td>${escapeHtml(item.label || "")}</td>
        <td>${escapeHtml(item.value).slice(0, 120)}</td>
        <td><button data-edit-content>Edit</button><button data-delete-content>Delete</button></td>
      </tr>
    `).join("");
  } catch (error) {
    siteContentBody.innerHTML = `<tr><td colspan="4">${escapeHtml(error.message || "Unable to load website content.")}</td></tr>`;
  }
}

async function loadPortfolio() {
  if (!portfolioBody) return;

  try {
    const { data } = await apiRequest("/portfolio");
    if (!data.length) {
      portfolioBody.innerHTML = `<tr><td colspan="4">No portfolio items found.</td></tr>`;
      return;
    }

    portfolioBody.innerHTML = data.map((item) => `
      <tr data-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}" data-category="${escapeHtml(item.category)}" data-image="${escapeHtml(item.image || "")}" data-description="${escapeHtml(item.description || "")}">
        <td>${escapeHtml(item.title)}</td>
        <td><span class="status active">${escapeHtml(item.category)}</span></td>
        <td>${item.image ? escapeHtml(item.image) : "-"}</td>
        <td><button data-edit-portfolio>Edit</button><button data-delete-portfolio>Delete</button></td>
      </tr>
    `).join("");
  } catch (error) {
    portfolioBody.innerHTML = `<tr><td colspan="4">${escapeHtml(error.message || "Unable to load portfolio.")}</td></tr>`;
  }
}

async function loadServices() {
  if (!serviceBody) return;

  try {
    const { data } = await apiRequest("/services");
    if (!data.length) {
      serviceBody.innerHTML = `<tr><td colspan="4">No services found.</td></tr>`;
      return;
    }

    serviceBody.innerHTML = data.map((item) => `
      <tr data-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}" data-price="${escapeHtml(item.price || "")}" data-icon="${escapeHtml(item.icon || "")}" data-image="${escapeHtml(item.image || "")}" data-description="${escapeHtml(item.description || "")}">
        <td>${escapeHtml(item.title)}</td>
        <td>${item.price ? `Rs ${escapeHtml(item.price)}` : "-"}</td>
        <td>${item.image ? escapeHtml(item.image) : "-"}</td>
        <td><button data-edit-service>Edit</button><button data-delete-service>Delete</button></td>
      </tr>
    `).join("");
  } catch (error) {
    serviceBody.innerHTML = `<tr><td colspan="4">${escapeHtml(error.message || "Unable to load services.")}</td></tr>`;
  }
}

async function loadDemoWork() {
  if (!demoWorkBody) return;

  try {
    const { data } = await apiRequest("/demo-work");
    if (!data.length) {
      demoWorkBody.innerHTML = `<tr><td colspan="4">No demo work found.</td></tr>`;
      return;
    }

    demoWorkBody.innerHTML = data.map((item) => `
      <tr data-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}" data-category="${escapeHtml(item.category)}" data-image="${escapeHtml(item.image || "")}" data-link="${escapeHtml(item.link || "")}" data-description="${escapeHtml(item.description || "")}">
        <td>${escapeHtml(item.title)}</td>
        <td><span class="status active">${escapeHtml(item.category)}</span></td>
        <td>${item.link ? escapeHtml(item.link) : "-"}</td>
        <td><button data-edit-demo-work>Edit</button><button data-delete-demo-work>Delete</button></td>
      </tr>
    `).join("");
  } catch (error) {
    demoWorkBody.innerHTML = `<tr><td colspan="4">${escapeHtml(error.message || "Unable to load demo work.")}</td></tr>`;
  }
}

async function loadMessages() {
  if (!messageBody || !getAuthToken()) return;

  try {
    const { data } = await apiRequest("/messages");
    if (!data.length) {
      messageBody.innerHTML = `<tr><td colspan="5">No leads yet.</td></tr>`;
      return;
    }

    messageBody.innerHTML = data.map((item) => `
      <tr data-id="${escapeHtml(item.id)}">
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.phone || item.email || "-")}</td>
        <td>${escapeHtml(item.message || "").slice(0, 160)}</td>
        <td><span class="status ${item.status === "read" ? "active" : "pending"}">${escapeHtml(item.status || "unread")}</span></td>
        <td><button data-delete-message>Delete</button></td>
      </tr>
    `).join("");
  } catch (error) {
    messageBody.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message || "Unable to load leads.")}</td></tr>`;
  }
}

async function loadAnalysisCharts() {
  if (!document.querySelector("[data-revenue-chart], [data-order-chart], [data-service-chart]")) return;

  try {
    const [revenue, orders, services] = await Promise.all([
      apiRequest("/dashboard/revenue-report"),
      apiRequest("/dashboard/order-statistics"),
      apiRequest("/dashboard/service-performance")
    ]);

    drawRevenueChart(document.querySelector("[data-revenue-chart]"), revenue.data || []);
    drawStatusChart(document.querySelector("[data-order-chart]"), orders.data || []);
    drawServiceRevenueChart(document.querySelector("[data-service-chart]"), services.data || []);
  } catch (_error) {
    drawEmptyChart(document.querySelector("[data-revenue-chart]"), "No revenue data");
    drawEmptyChart(document.querySelector("[data-order-chart]"), "No order data");
    drawEmptyChart(document.querySelector("[data-service-chart]"), "No service data");
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatMetric(value, item) {
  if (item.dataset.format === "currency") return `Rs ${Math.round(value / 1000)}K`;
  if (item.dataset.format === "percent") return `${value}%`;
  return value;
}

function drawCharts() {
  document.querySelectorAll("[data-line-chart]").forEach(drawLineChart);
  document.querySelectorAll("[data-pie-chart]").forEach(drawPieChart);
  loadAnalysisCharts();
}

function chartColors() {
  const light = document.body.dataset.theme === "light";
  return {
    grid: light ? "rgba(17,17,17,.12)" : "rgba(255,255,255,.14)",
    text: light ? "#171717" : "#FFFFFF",
    red: "#B5121B",
    gold: "#D4A238"
  };
}

function drawLineChart(canvas) {
  const ctx = canvas.getContext("2d");
  const { grid, text, red, gold } = chartColors();
  const width = canvas.width;
  const height = canvas.height;
  const values = [18, 24, 19, 34, 42, 39, 58, 64, 72, 88, 82, 104];
  const max = Math.max(...values);
  const pad = 34;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i += 1) {
    const y = pad + i * ((height - pad * 2) / 4);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, red);
  gradient.addColorStop(1, gold);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = pad + index * ((width - pad * 2) / (values.length - 1));
    const y = height - pad - (value / max) * (height - pad * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = text;
  ctx.font = "700 13px Inter, Arial";
  ctx.fillText("Jan", pad, height - 8);
  ctx.fillText("Dec", width - pad - 24, height - 8);
}

function drawPieChart(canvas) {
  const ctx = canvas.getContext("2d");
  const { red, gold, text } = chartColors();
  const values = [38, 26, 20, 16];
  const colors = [gold, red, "#ffffff", "#7D0C13"];
  const labels = ["Web", "Design", "Apps", "Excel"];
  const total = values.reduce((sum, value) => sum + value, 0);
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  values.forEach((value, index) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(125, 125);
    ctx.arc(125, 125, 88, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    start += angle;
  });

  ctx.fillStyle = text;
  ctx.font = "800 13px Inter, Arial";
  labels.forEach((label, index) => {
    ctx.fillText(`${label} ${values[index]}%`, 230, 70 + index * 30);
  });
}

function drawRevenueChart(canvas, payments) {
  if (!canvas) return;
  const monthly = new Array(12).fill(0);
  payments.filter((item) => item.payment_status === "paid").forEach((item) => {
    const date = new Date(item.created_at);
    if (!Number.isNaN(date.getTime())) monthly[date.getMonth()] += Number(item.amount || 0);
  });
  drawBarChart(canvas, monthly, ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
}

function drawStatusChart(canvas, rows) {
  if (!canvas) return;
  const counts = rows.reduce((acc, item) => {
    const key = item.order_status || "new";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  drawDonutChart(canvas, Object.keys(counts), Object.values(counts));
}

function drawServiceRevenueChart(canvas, rows) {
  if (!canvas) return;
  const totals = rows.reduce((acc, item) => {
    const key = item.service || "Other";
    acc[key] = (acc[key] || 0) + Number(item.amount || 0);
    return acc;
  }, {});
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 6);
  drawBarChart(canvas, entries.map(([, value]) => value), entries.map(([label]) => label.slice(0, 10)));
}

function drawBarChart(canvas, values, labels) {
  const ctx = canvas.getContext("2d");
  const { grid, text, gold, red } = chartColors();
  const width = canvas.width;
  const height = canvas.height;
  const pad = 34;
  const max = Math.max(1, ...values);

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = grid;
  for (let i = 0; i < 4; i += 1) {
    const y = pad + i * ((height - pad * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }

  const barWidth = (width - pad * 2) / Math.max(1, values.length) * 0.58;
  values.forEach((value, index) => {
    const x = pad + index * ((width - pad * 2) / Math.max(1, values.length)) + barWidth * 0.35;
    const barHeight = (Number(value || 0) / max) * (height - pad * 2);
    const y = height - pad - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, height - pad);
    gradient.addColorStop(0, gold);
    gradient.addColorStop(1, red);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight || 2);
  });

  ctx.fillStyle = text;
  ctx.font = "700 11px Inter, Arial";
  labels.forEach((label, index) => {
    const x = pad + index * ((width - pad * 2) / Math.max(1, labels.length));
    ctx.fillText(String(label), x, height - 8);
  });

  if (!values.some(Boolean)) drawEmptyChart(canvas, "No data yet");
}

function drawDonutChart(canvas, labels, values) {
  const ctx = canvas.getContext("2d");
  const { red, gold, text } = chartColors();
  const colors = [gold, red, "#ffffff", "#7D0C13", "#F1D17A"];
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  if (!total) return drawEmptyChart(canvas, "No data yet");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let start = -Math.PI / 2;
  values.forEach((value, index) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(125, 125);
    ctx.arc(125, 125, 84, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    start += angle;
  });
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(125, 125, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  ctx.fillStyle = text;
  ctx.font = "800 12px Inter, Arial";
  labels.forEach((label, index) => ctx.fillText(`${label}: ${values[index]}`, 230, 76 + index * 28));
}

function drawEmptyChart(canvas, label) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { text, grid } = chartColors();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = grid;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
  ctx.fillStyle = text;
  ctx.font = "800 16px Inter, Arial";
  ctx.fillText(label, 42, canvas.height / 2);
}
