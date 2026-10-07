import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://cnxmogmmeixhzjqzpzqf.supabase.co";

const SUPABASE_KEY =
  "sb_publishable__dnVVEE7jYGfiEGaXbszuw_DHBeWA7Y";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const app = document.getElementById("mexa-app");

function mexaLogo() {
  return `
    <div class="mexa-logo" aria-label="MEXA">

      <span class="logo-m">M</span>

      <span class="logo-e" aria-label="E">
        <i></i>
        <i></i>
        <i></i>
      </span>

      <span class="logo-x">X</span>

      <span class="logo-a">A</span>

    </div>
  `;
}

function showLogin() {
  app.innerHTML = `
    <div class="mexa-login-card">

      ${mexaLogo()}

      <div class="mexa-subtitle">
        Connect. Share. Grow.
      </div>

      <input
        id="login-email"
        type="email"
        placeholder="Email"
      >

      <input
        id="login-password"
        type="password"
        placeholder="Password"
      >

      <button id="btn-login">
        Login
      </button>

      <button id="btn-register" class="mexa-secondary">
        Buat Akun Baru
      </button>

      <button id="btn-forgot" class="mexa-secondary">
        Lupa Password
      </button>

      <p id="login-message"></p>

    </div>
  `;

  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-register").onclick = showRegister;
  document.getElementById("btn-forgot").onclick = forgotPassword;
}

function showRegister() {
  app.innerHTML = `
    <div class="mexa-login-card">

      ${mexaLogo()}

      <div class="mexa-subtitle">
        Buat akun MEXA kamu
      </div>

      <input
        id="register-name"
        type="text"
        placeholder="Nama panggilan"
      >

      <input
        id="register-username"
        type="text"
        placeholder="Username"
      >

      <input
        id="register-email"
        type="email"
        placeholder="Email"
      >

      <input
        id="register-password"
        type="password"
        placeholder="Password"
      >

      <button id="btn-create-account">
        Buat Akun
      </button>

      <button id="btn-back-login" class="mexa-secondary">
        Kembali ke Login
      </button>

      <p id="register-message"></p>

    </div>
  `;

  document.getElementById("btn-create-account").onclick = register;
  document.getElementById("btn-back-login").onclick = showLogin;
}

async function login() {
  const email =
    document.getElementById("login-email").value.trim();

  const password =
    document.getElementById("login-password").value;

  const message =
    document.getElementById("login-message");

  if (!email || !password) {
    message.textContent =
      "Email dan password wajib diisi.";
    return;
  }

  message.textContent = "Sedang login...";

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    message.textContent = error.message;
    return;
  }

  window.location.href = "./index.html";
}

async function register() {
  const displayName =
    document.getElementById("register-name").value.trim();

  const username =
    document.getElementById("register-username").value.trim();

  const email =
    document.getElementById("register-email").value.trim();

  const password =
    document.getElementById("register-password").value;

  const message =
    document.getElementById("register-message");

  if (!displayName || !username || !email || !password) {
    message.textContent =
      "Semua data wajib diisi.";
    return;
  }

  message.textContent = "Membuat akun...";

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          username: username
        }
      }
    });

  if (error) {
    message.textContent = error.message;
    return;
  }

  if (data.session) {
    window.location.href = "./index.html";
  } else {
    message.textContent =
      "Akun berhasil dibuat. Silakan cek email untuk verifikasi.";
  }
}

async function forgotPassword() {
  const email =
    document.getElementById("login-email").value.trim();

  const message =
    document.getElementById("login-message");

  if (!email) {
    message.textContent =
      "Masukkan email terlebih dahulu.";
    return;
  }

  message.textContent =
    "Mengirim link reset password...";

  const { error } =
    await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    message.textContent = error.message;
    return;
  }

  message.textContent =
    "Link reset password sudah dikirim ke email.";
}

showLogin();
```
