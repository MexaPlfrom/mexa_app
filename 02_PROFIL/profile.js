import { supabase } from "../01_LOGIN/login.js";

const app = document.getElementById("mexa-app");

export async function showProfile() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      avatar_url,
      cover_url,
      bio,
      location,
      website
    `)
    .eq("id", user.id)
    .single();

  if (error) {
    app.innerHTML = `
      <div>
        <h1>MEXA</h1>
        <p>Gagal memuat profil.</p>
        <p>${error.message}</p>
      </div>
    `;
    return;
  }

  const avatar = profile.avatar_url
    ? `<img src="${profile.avatar_url}" alt="Foto profil" width="100">`
    : `<div>👤</div>`;

  const cover = profile.cover_url
    ? `<img src="${profile.cover_url}" alt="Foto cover" width="100%">`
    : `<div style="height:120px;background:#ddd;"></div>`;

  app.innerHTML = `
    <div>

      ${cover}

      ${avatar}

      <h1>${escapeHtml(profile.display_name)}</h1>

      <p>
        @${escapeHtml(profile.username || "username")}
      </p>

      <p>
        ${escapeHtml(profile.bio || "Belum ada bio.")}
      </p>

      ${
        profile.location
          ? `<p>📍 ${escapeHtml(profile.location)}</p>`
          : ""
      }

      ${
        profile.website
          ? `<p>🌐 ${escapeHtml(profile.website)}</p>`
          : ""
      }

      <button id="btn-edit-profile">
        Edit Profil
      </button>

    </div>
  `;

  document
    .getElementById("btn-edit-profile")
    .onclick = showEditProfile;
}

function showEditProfile() {
  // Tahap berikutnya kita isi form edit profil.
  app.innerHTML = `
    <div>
      <h1>Edit Profil</h1>

      <p>Form edit profil akan kita pasang di tahap berikutnya.</p>

      <button id="btn-back-profile">
        Kembali
      </button>
    </div>
  `;

  document
    .getElementById("btn-back-profile")
    .onclick = showProfile;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
