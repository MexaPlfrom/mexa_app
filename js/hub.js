import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://cnxmogmmeixhzjqzpzqf.supabase.co";

const SUPABASE_KEY =
  "sb_publishable__dnVVEE7jYGfiEGaXbszuw_DHBeWA7Y";

const supabase = createClient(
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

function renderHome() {
  app.innerHTML = `
    <div class="mexa-home">

      <header class="mexa-header">

        ${mexaLogo()}

        <div class="mexa-search">
          <span>🔍</span>
          <input
            type="search"
            placeholder="Cari di MEXA..."
          >
        </div>

        <div class="mexa-header-actions">
          <button type="button">🔔</button>
          <button type="button">💬</button>
          <button type="button">👤</button>
        </div>

      </header>

      <div class="mexa-layout">

        <aside class="mexa-sidebar">

          <button type="button" class="active">
            🏠 <span>Home</span>
          </button>

          <button type="button">
            👤 <span>Profil</span>
          </button>

          <button type="button">
            👥 <span>Teman</span>
          </button>

          <button type="button">
            📝 <span>Postingan</span>
          </button>

          <button type="button">
            📷 <span>Foto</span>
          </button>

          <button type="button">
            🎬 <span>Video</span>
          </button>

          <button type="button">
            ▶️ <span>Reels</span>
          </button>

          <button type="button">
            💬 <span>Messenger</span>
          </button>

          <button type="button">
            🔔 <span>Notifikasi</span>
          </button>

          <button type="button">
            🤖 <span>MEXA AI</span>
          </button>

          <button type="button">
            ⚙️ <span>Pengaturan</span>
          </button>

          <button type="button" id="btn-logout">
            🚪 <span>Logout</span>
          </button>

        </aside>

        <main class="mexa-feed">

          <section class="mexa-card mexa-stories">

            <h3>Stories</h3>

            <div class="stories-row">

              <div class="story create-story">
                <div>＋</div>
                <span>Buat Story</span>
              </div>

              <div class="story">
                <div class="story-avatar">M</div>
                <span>Story kamu</span>
              </div>

              <div class="story">
                <div class="story-avatar">A</div>
                <span>Teman</span>
              </div>

              <div class="story">
                <div class="story-avatar">R</div>
                <span>Raka</span>
              </div>

            </div>

          </section>

          <section class="mexa-card create-post">

            <div class="post-input">

              <div class="default-avatar">
                M
              </div>

              <input
                type="text"
                placeholder="Apa yang kamu pikirkan?"
              >

            </div>

            <div class="post-actions">

              <button type="button">
                📷 Foto
              </button>

              <button type="button">
                🎥 Video
              </button>

              <button type="button">
                😊 Perasaan
              </button>

            </div>

          </section>

          <article class="mexa-card post">

            <div class="post-header">

              <div class="post-avatar">
                M
              </div>

              <div>
                <strong>MEXA</strong>
                <small>Baru saja</small>
              </div>

              <button
                type="button"
                class="post-menu"
              >
                ⋯
              </button>

            </div>

            <div class="post-content">
              Selamat datang di MEXA! 🚀
              <br>
              Connect. Share. Grow.
            </div>

            <div class="post-stats">
              <span>👍 12</span>
              <span>💬 4 komentar</span>
            </div>

            <div class="post-buttons">

              <button type="button">
                👍 Like
              </button>

              <button type="button">
                💬 Comment
              </button>

              <button type="button">
                ↗️ Share
              </button>

            </div>

          </article>

          <article class="mexa-card post">

            <div class="post-header">

              <div class="post-avatar">
                A
              </div>

              <div>
                <strong>Andi</strong>
                <small>1 jam lalu</small>
              </div>

              <button
                type="button"
                class="post-menu"
              >
                ⋯
              </button>

            </div>

            <div class="post-content">
              Hari ini semangat terus! ✨
            </div>

            <div class="post-buttons">

              <button type="button">
                👍 Like
              </button>

              <button type="button">
                💬 Comment
              </button>

              <button type="button">
                ↗️ Share
              </button>

            </div>

          </article>

        </main>

        <aside class="mexa-right">

          <section class="mexa-card online-card">

            <h3>Teman Online</h3>

            <div class="online-user">
              <span class="online-dot"></span>
              <div class="friend-avatar">A</div>
              <span>Andi</span>
            </div>

            <div class="online-user">
              <span class="online-dot"></span>
              <div class="friend-avatar">R</div>
              <span>Raka</span>
            </div>

            <div class="online-user">
              <span class="online-dot"></span>
              <div class="friend-avatar">S</div>
              <span>Sinta</span>
            </div>

          </section>

        </aside>

      </div>

    </div>
  `;

  const logoutButton =
    document.getElementById("btn-logout");

  logoutButton.addEventListener("click", async () => {

    logoutButton.disabled = true;
    logoutButton.innerHTML = "⏳ <span>Logout...</span>";

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      logoutButton.disabled = false;
      logoutButton.innerHTML = "🚪 <span>Logout</span>";
      alert("Gagal logout: " + error.message);
      return;
    }

    window.location.href = "./login.html";
  });
}

async function loadHome() {

  if (!app) {
    console.error("Elemen #mexa-app tidak ditemukan.");
    return;
  }

  try {

    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);

      renderHome();
      return;
    }

    if (!session) {
      window.location.href = "./login.html";
      return;
    }

    renderHome();

  } catch (error) {

    console.error("MEXA Home error:", error);

    renderHome();
  }
}

loadHome();
