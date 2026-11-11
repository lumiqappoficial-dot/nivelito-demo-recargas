import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile
} from "firebase/auth";

// ======================================
// 1. CONFIGURACIÓN DE FIREBASE
// ======================================

const firebaseConfig = {
  apiKey: "AIzaSyBb4Rl_mVQm-2He6tNZJpi5iPJ2NTSnsR4",
  authDomain: "recarga-oficial.firebaseapp.com",
  projectId: "recarga-oficial",
  storageBucket: "recarga-oficial.firebasestorage.app",
  messagingSenderId: "905992050389",
  appId: "1:905992050389:web:a5a10a8bb5a85a9b9b345c",
  measurementId: "G-9R0C9CLPJ5"
};

// ======================================
// 2. INICIALIZAR FIREBASE
// ======================================

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// ======================================
// 3. GOOGLE ANALYTICS
// ======================================

let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((error) => {
    console.warn("Analytics no disponible:", error);
  });

// ======================================
// 4. AUTENTICACIÓN
// ======================================

const auth = getAuth(app);

// Proveedores
const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

// ======================================
// 5. INICIAR SESIÓN CON GOOGLE
// ======================================

window.signInWithGoogle = async function () {
  try {
    const result = await signInWithPopup(auth, providerGoogle);
    const user = result.user;

    console.log("Usuario logueado con Google:", user.email);

    showToast(`Bienvenido, ${user.displayName || user.email}`);

    return user;

  } catch (error) {
    console.error("Error en login Google:", error);
    showToast("Error al iniciar sesión con Google: " + error.message);
    return null;
  }
};

// ======================================
// 6. INICIAR SESIÓN CON FACEBOOK
// ======================================

window.signInWithFacebook = async function () {
  try {
    const result = await signInWithPopup(auth, providerFacebook);
    const user = result.user;

    console.log("Usuario logueado con Facebook:", user.email);

    showToast(`Bienvenido, ${user.displayName || user.email}`);

    return user;

  } catch (error) {
    console.error("Error en login Facebook:", error);
    showToast("Error al iniciar sesión con Facebook: " + error.message);
    return null;
  }
};

// ======================================
// 7. INICIAR SESIÓN CON CORREO
// ======================================

window.signInWithEmail = async function (email, password, playerId) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    if (playerId) {
      await updateProfile(user, {
        displayName: `${user.email} | ID: ${playerId}`
      });
    }

    console.log("Usuario logueado:", user.email);

    showToast(`Bienvenido, ${user.email}`);

    return user;

  } catch (error) {
    console.error("Error en login email:", error);
    showToast("Error: " + error.message);
    return null;
  }
};

// ======================================
// 8. REGISTRAR USUARIO CON CORREO
// ======================================

window.signUpWithEmail = async function (email, password, playerId) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    if (playerId) {
      await updateProfile(user, {
        displayName: `${user.email} | ID: ${playerId}`
      });
    }

    console.log("Cuenta creada:", user.email);

    showToast(`Cuenta creada: ${user.email}`);

    return user;

  } catch (error) {
    console.error("Error en signup:", error);
    showToast("Error: " + error.message);
    return null;
  }
};

// ======================================
// 9. LÓGICA DE TIENDA Y JUEGOS
// ======================================

// Envolvemos el código de interfaz en una IIFE limpia
(function () {
  const games = {
    freefire: {
      name: "Free Fire",
      token: "FF",
      unit: "diamantes",
      unitCaption: "Diamantes · paquetes demo",
      idTitle: "ID de jugador",
      placeholder: "Ej. 847201356",
      quantities: ["100", "310", "520", "1.060", "2.180", "5.600"],
      prices: {
        MX: [19, 49, 79, 159, 319, 799],
        AR: [735, 1820, 2940, 5910, 11850, 29700],
        CO: [3700, 9200, 14800, 29900, 59800, 149500],
        CL: [1100, 2800, 4400, 8900, 17900, 44900],
        PE: [3.8, 9.5, 15.2, 30.5, 61, 152]
      }
    },

    ml: {
      name: "Mobile Legends",
      token: "ML",
      unit: "diamantes",
      unitCaption: "Diamantes · paquetes demo",
      idTitle: "ID de jugador",
      placeholder: "Ej. 43082176",
      quantities: ["86", "172", "257", "706", "1.413", "2.828"],
      prices: {
        MX: [19, 39, 59, 149, 299, 599],
        AR: [710, 1430, 2150, 5730, 11460, 22950],
        CO: [3600, 7200, 10800, 28800, 57600, 115000],
        CL: [1000, 2000, 3000, 8000, 16000, 32000],
        PE: [3.7, 7.4, 11.1, 29.6, 59.2, 118.4]
      }
    },

    coc: {
      name: "Clash of Clans",
      token: "CoC",
      unit: "gemas",
      unitCaption: "Gemas · paquetes demo",
      idTitle: "ID de jugador",
      placeholder: "Ej. P2L8Y0ABC",
      quantities: ["80", "500", "1.200", "2.500", "6.500", "14.000"],
      prices: {
        MX: [19, 79, 159, 319, 799, 1599],
        AR: [720, 2960, 5920, 11850, 29700, 59400],
        CO: [3650, 14800, 29900, 59800, 149500, 299000],
        CL: [1050, 4400, 8900, 17900, 44900, 89900],
        PE: [3.7, 15.2, 30.5, 61, 152, 304]
      }
    }
  };

  const regions = {
    MX: { label: "México", currency: "MXN", locale: "es-MX", digits: 0 },
    AR: { label: "Argentina", currency: "ARS", locale: "es-AR", digits: 0 },
    CO: { label: "Colombia", currency: "COP", locale: "es-CO", digits: 0 },
    CL: { label: "Chile", currency: "CLP", locale: "es-CL", digits: 0 },
    PE: { label: "Perú", currency: "PEN", locale: "es-PE", digits: 2 }
  };

  const packageNames = ["Paquete inicial", "Un poco más de juego", "Para ir con todo", "Sesión extendida", "Para el escuadrón", "La carga grande"];
  const state = { game: "freefire", packageIndex: null };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const packageGrid = $("#package-grid");
  const regionSelect = $("#region");
  const playerId = $("#player-id");
  const idError = $("#id-error");
  const summary = $("#selection-summary");
  const modalBackdrop = $("#confirmation-modal");
  const reviewState = $("#review-state");
  const successState = $("#success-state");
  let previousFocus = null;
  let toastTimer;

  function money(value) {
    const region = regions[regionSelect.value];
    return new Intl.NumberFormat(region.locale, {
      style: "currency",
      currency: region.currency,
      minimumFractionDigits: region.digits,
      maximumFractionDigits: region.digits
    }).format(value);
  }

  function currentPrice() {
    if (state.packageIndex === null) return null;
    return games[state.game].prices[regionSelect.value][state.packageIndex];
  }

  function renderPackages() {
    const game = games[state.game];
    $$(".package-card", packageGrid).forEach((card, index) => {
      const quantity = game.quantities[index];
      $(".package-amount", card).textContent = `${quantity} ${game.unit}`;
      $(".package-sub", card).textContent = packageNames[index];
      $(".package-price", card).textContent = money(game.prices[regionSelect.value][index]);
      card.setAttribute("aria-pressed", String(state.packageIndex === index));
    });
    $("#game-token").textContent = game.token;
    $("#game-token").className = `game-token${state.game === "ml" ? " ml" : state.game === "coc" ? " coc" : ""}`;
    $("#active-game-name").textContent = game.name;
    $("#package-unit").textContent = game.unitCaption;
    $("#player-id-title").textContent = game.idTitle;
    playerId.placeholder = game.placeholder;
    summary.textContent = state.packageIndex === null
      ? "Elige un paquete"
      : `${game.quantities[state.packageIndex]} ${game.unit} · ${money(currentPrice())}`;
  }

  function changeGame(gameKey) {
    if (!games[gameKey]) return;
    state.game = gameKey;
    state.packageIndex = null;
    idError.textContent = "";
    $$(".nav-game").forEach((button) => {
      if (button.dataset.game === gameKey) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    $$(".game-tile").forEach((button) => {
      const active = button.dataset.game === gameKey;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderPackages();
    $("#main-nav").classList.remove("open");
    $(".menu-toggle").setAttribute("aria-expanded", "false");
    $(".menu-toggle").setAttribute("aria-label", "Abrir menú de juegos");
  }

  function setError(message) {
    idError.textContent = message;
    playerId.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) playerId.focus();
  }

  function openModal() {
    const game = games[state.game];
    const region = regions[regionSelect.value];
    $("#receipt-game").textContent = game.name;
    $("#receipt-package").textContent = `${game.quantities[state.packageIndex]} ${game.unit}`;
    $("#receipt-id").textContent = playerId.value.trim();
    $("#receipt-region").textContent = `${region.label} · ${region.currency}`;
    $("#receipt-price").textContent = money(currentPrice());
    previousFocus = document.activeElement;
    reviewState.hidden = false;
    successState.hidden = true;
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    $("[data-close-modal]", modalBackdrop).focus();
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  // Se expone showToast globalmente para que las funciones de autenticación arriba puedan llamarla
  window.showToast = function (message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
  };

  packageGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".package-card");
    if (!card) return;
    state.packageIndex = Number(card.dataset.package);
    setError("");
    renderPackages();
  });

  $$(".nav-game, .game-tile").forEach((button) => {
    button.addEventListener("click", () => changeGame(button.dataset.game));
  });

  regionSelect.addEventListener("change", renderPackages);
  playerId.addEventListener("input", () => {
    if (idError.textContent) setError("");
  });

  $("#purchase-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.packageIndex === null) {
      setError("Primero elige un paquete para ver el resumen de demo.");
      packageGrid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const value = playerId.value.trim();
    if (!value) {
      setError("Escribe un ID de jugador de prueba para continuar.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]{4,20}$/.test(value)) {
      setError("Usa solo letras, números, guion o guion bajo (4 a 20 caracteres).");
      return;
    }
    setError("");
    openModal();
  });

  $$("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalBackdrop.hidden) closeModal();
    if (event.key === "Tab" && !modalBackdrop.hidden) {
      const focusable = $$("button:not([disabled])", modalBackdrop).filter((element) => !element.closest("[hidden]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  $("#confirm-demo").addEventListener("click", () => {
    reviewState.hidden = true;
    successState.hidden = false;
    $("#finish-demo").focus();
  });
  $("#finish-demo").addEventListener("click", () => {
    closeModal();
    playerId.value = "";
    showToast("Demo completada. No se realizó ninguna compra.");
  });

  $(".menu-toggle").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Cerrar menú de juegos" : "Abrir menú de juegos");
    $("#main-nav").classList.toggle("open", open);
  });

  renderPackages();
})();