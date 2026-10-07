const app = document.getElementById("mexa-app");

if (!app) {
  document.body.innerHTML = `
    <div style="
      padding:40px;
      color:white;
      background:#070b14;
      font-family:Arial,sans-serif;
    ">
      MEXA ERROR: #mexa-app tidak ditemukan.
    </div>
  `;
} else {
  app.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:30px;
      background:
        radial-gradient(
          circle at top,
          #30498a 0%,
          #111827 48%,
          #070b14 100%
        );
      color:#d9e2ff;
      font-family:Arial,sans-serif;
      text-align:center;
    ">

      <div>

        <div style="
          font-size:42px;
          font-weight:900;
          letter-spacing:3px;
          margin-bottom:15px;
          text-shadow:0 0 20px rgba(150,170,255,.35);
        ">
          MEXA
        </div>

        <h1 style="
          margin:0 0 10px;
          font-size:28px;
        ">
          MEXA HOME TEST
        </h1>

        <p style="
          margin:0;
          color:#9daaff;
          font-size:16px;
        ">
          hub.js berhasil dijalankan ✅
        </p>

      </div>

    </div>
  `;
}
