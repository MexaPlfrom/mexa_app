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

async function loadHome() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "./login.html";
    return;
  }

  app.innerHTML = `
    <div class="mexa-home">

      <!-- HEADER -->
      <header class="mexa-header">

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

        <div class="mexa-search">
          <span>🔍</span>
          <input
            type="search"
            placeholder="Cari di MEXA..."
          >
        </div>

        <div class="mexa-header-actions">
          <button>🔔</button>
          <button>💬</button>
          <button>👤</button>
        </div>

      </header>

      <!-- BODY -->
      <div class="mexa-layout">

        <!-- SIDEBAR -->
        <aside class="mexa-sidebar">

          <button class="active">🏠 <span>Home</span></button>
          <button>👤 <span>Profil</span></button>
          <button>👥 <span>Teman</span></button>
          <button>📝 <span>Postingan</span></button>
          <button>📷 <span>Foto</span></button>
          <button>🎬 <span>Video</span></button>
          <button>▶️ <span>Reels</span></button>
          <button>💬 <span>Messenger</span></button>
          <button>🔔 <span>Notifikasi</span></button>
          <button>🤖 <span>MEXA AI</span></button>
          <button>⚙️ <span>Pengaturan</span></button>

          <button id="btn-logout">
            🚪 <span>Logout</span>
          </button>

        </aside>

        <!-- FEED -->
        <main class="mexa-feed">

          <!-- STORIES -->
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

          <!-- CREATE POST -->
          <section class="mexa-card create-post">

            <div class="post-input">
              <div class="default-avatar">M</div>

              <input
                type="text"
                placeholder="Apa yang kamu pikirkan?"
              >
            </div>

            <div class="post-actions">
              <button>📷 Foto</button>
              <button>🎥 Video</button>
              <button>😊 Perasaan</button>
            </div>

          </section>

          <!-- SAMPLE POST -->
          <article class="mexa-card post">

            <div class="post-header">

              <div class="post-avatar">M</div>

              <div>
                <strong>MEXA User</strong>
                <small>Baru saja</small>
              </div>

              <button class="post-menu">⋯</button>

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
              <button>👍 Like</button>
              <button>💬 Comment</button>
              <button>↗️ Share</button>
            </div>

          </article>

          <article class="mexa-card post">

            <div class="post-header">

              <div class="post-avatar">A</div>

              <div>
                <strong>Andi</strong>
                <small>1 jam lalu</small>
              </div>

              <button class="post-menu">⋯</button>

            </div>

            <div class="post-content">
              Hari ini semangat terus! ✨
            </div>

            <div class="post-buttons">
              <button>👍 Like</button>
              <button>💬 Comment</button>
              <button>↗️ Share</button>
            </div>

          </article>

        </main>

        <!-- RIGHT SIDEBAR -->
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

  document.getElementById("btn-logout").onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = "./login.html";
  };
}

loadHome();
```
