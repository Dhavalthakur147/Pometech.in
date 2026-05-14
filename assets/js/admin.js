const API_BASE_URL = "https://pometech-in.onrender.com/api";
const authKey = "pomotech-admin-auth";
const adminKey = "pomotech-admin-user";
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
  if (dashboardPage) await loadDashboardOverview();
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

    const recentActivities = document.querySelector("[data-recent-activities]");
    if (recentActivities && Array.isArray(data.recentActivities)) {
      recentActivities.replaceChildren(...data.recentActivities.map((activity) => {
        const item = document.createElement("li");
        item.textContent = activity;
        return item;
      }));
    }
  } catch (error) {
    if (error.message.toLowerCase().includes("token") || error.message.toLowerCase().includes("auth")) {
      localStorage.removeItem(authKey);
      window.location.href = "admin-login.html";
    }
  }
}

function formatMetric(value, item) {
  if (item.dataset.format === "currency") return `Rs ${Math.round(value / 1000)}K`;
  if (item.dataset.format === "percent") return `${value}%`;
  return value;
}

function drawCharts() {
  document.querySelectorAll("[data-line-chart]").forEach(drawLineChart);
  document.querySelectorAll("[data-pie-chart]").forEach(drawPieChart);
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
