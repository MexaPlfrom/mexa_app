import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://cnxmogmmeixhzjqzpzqf.supabase.co";

const SUPABASE_KEY =
  "sb_publishable__dnVVEE7jYGfiEGaXbszuw_DHBeWA7Y";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ======================================
// MEXA FUNCTIONS
// Edit & Hapus Postingan Milik Sendiri
// ======================================

async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

// --------------------------------------
// EDIT POSTINGAN
// --------------------------------------

window.mexaEditPost = async function (postId, oldContent = "") {

  const user = await getCurrentUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const { data: post, error: checkError } =
    await supabase
      .from("posts")
      .select("id,user_id,content")
      .eq("id", postId)
      .single();

  if (checkError || !post) {
    alert("Postingan tidak ditemukan.");
    return;
  }

  // Hanya pemilik postingan yang boleh edit
  if (post.user_id !== user.id) {
    alert("Kamu hanya bisa mengedit postingan milikmu sendiri.");
    return;
  }

  const content =
    prompt(
      "Edit postingan kamu:",
      post.content || oldContent
    );

  if (content === null) {
    return;
  }

  const newContent = content.trim();

  if (!newContent) {
    alert("Postingan tidak boleh kosong.");
    return;
  }

  const { error } =
    await supabase
      .from("posts")
      .update({
        content: newContent,
        updated_at: new Date().toISOString()
      })
      .eq("id", postId)
      .eq("user_id", user.id);

  if (error) {
    console.error(error);
    alert("Gagal mengedit postingan.");
    return;
  }

  alert("Postingan berhasil diedit.");

  // Refresh halaman agar perubahan langsung terlihat
  window.location.reload();
};


// --------------------------------------
// HAPUS POSTINGAN
// --------------------------------------

window.mexaDeletePost = async function (postId) {

  const user = await getCurrentUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const { data: post, error: checkError } =
    await supabase
      .from("posts")
      .select("id,user_id")
      .eq("id", postId)
      .single();

  if (checkError || !post) {
    alert("Postingan tidak ditemukan.");
    return;
  }

  // Hanya pemilik postingan yang boleh hapus
  if (post.user_id !== user.id) {
    alert("Kamu hanya bisa menghapus postingan milikmu sendiri.");
    return;
  }

  const yakin =
    confirm(
      "Hapus postingan ini?\n\nTindakan ini tidak bisa dibatalkan."
    );

  if (!yakin) {
    return;
  }

  const { error } =
    await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", user.id);

  if (error) {
    console.error(error);
    alert("Gagal menghapus postingan.");
    return;
  }

  alert("Postingan berhasil dihapus.");

  // Refresh halaman
  window.location.reload();
};


// --------------------------------------
// MENU 3 TITIK
// --------------------------------------

window.mexaPostMenu = async function (
  postId,
  oldContent = ""
) {

  const user = await getCurrentUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const { data: post, error } =
    await supabase
      .from("posts")
      .select("id,user_id,content")
      .eq("id", postId)
      .single();

  if (error || !post) {
    alert("Postingan tidak ditemukan.");
    return;
  }

  // ----------------------------------
  // POSTINGAN SENDIRI
  // ----------------------------------

  if (post.user_id === user.id) {

    const pilihan = prompt(
      "MENU POSTINGAN MEXA\n\n" +
      "1 = Edit postingan\n" +
      "2 = Hapus postingan\n\n" +
      "Masukkan pilihan:"
    );

    if (pilihan === "1") {
      await window.mexaEditPost(
        postId,
        post.content || oldContent
      );
      return;
    }

    if (pilihan === "2") {
      await window.mexaDeletePost(postId);
      return;
    }

    return;
  }

  // ----------------------------------
  // POSTINGAN ORANG LAIN
  // ----------------------------------

  const pilihan = prompt(
    "MENU POSTINGAN\n\n" +
    "Postingan ini bukan milikmu.\n\n" +
    "1 = Laporkan postingan\n" +
    "2 = Tutup"
  );

  if (pilihan === "1") {
    alert("Fitur laporan akan kita sambungkan berikutnya.");
  }
};


// --------------------------------------
// TEST
// --------------------------------------

window.mexaFunctionsReady = true;

console.log(
  "MEXA Functions aktif: Edit, Hapus, Menu 3 Titik"
);
