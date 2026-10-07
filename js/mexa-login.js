const app = document.getElementById("mexa-app");

app.innerHTML = `
  <div class="mexa-login-card">

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

    <div class="mexa-subtitle">
      Connect. Share. Grow.
    </div>

    <input
      type="email"
      placeholder="Email"
    >

    <input
      type="password"
      placeholder="Password"
    >

    <button>
      Login
    </button>

    <button class="mexa-secondary">
      Buat Akun Baru
    </button>

    <button class="mexa-secondary">
      Lupa Password
    </button>

  </div>
`;
