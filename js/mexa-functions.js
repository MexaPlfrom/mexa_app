import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* =========================================
   MEXA SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
  "https://cnxmogmmeixhzjqzpzqf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable__dnVVEE7jYGfiEGaXbszuw_DHBeWA7Y";

/*
 * Satu Supabase client untuk seluruh fungsi MEXA.
 *
 * Catatan:
 * Gunakan hanya publishable/anon key di frontend.
 * Jangan pernah memasukkan service_role/secret key
 * ke GitHub atau browser.
 */

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/* =========================================
   ERROR HELPER
========================================= */

export function mexaError(label, error) {
  console.error(`[MEXA] ${label}:`, error);

  if (!error) {
    return "Terjadi kesalahan.";
  }

  if (typeof error === "string") {
    return error;
  }

  return (
    error.message ||
    error.details ||
    error.hint ||
    "Terjadi kesalahan pada server."
  );
}

/* =========================================
   CURRENT USER
========================================= */

export async function getCurrentUser() {
  try {
    const {
      data,
      error
    } = await supabase.auth.getUser();

    if (error) {
      mexaError(
        "Gagal mengambil sesi pengguna",
        error
      );

      return null;
    }

    if (!data?.user) {
      console.warn(
        "[MEXA] Tidak ada pengguna yang sedang login."
      );

      return null;
    }

    return data.user;

  } catch (error) {
    mexaError(
      "Auth exception",
      error
    );

    return null;
  }
}

/* =========================================
   CHECK POST OWNER
========================================= */

async function getOwnedPost(postId, userId) {
  if (!postId || !userId) {
    return {
      post: null,
      error: "Data postingan tidak lengkap."
    };
  }

  try {
    const {
      data,
      error
    } = await supabase
      .from("posts")
      .select("id,user_id,content,created_at,updated_at")
      .eq("id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return {
        post: null,
        error: mexaError(
          "Gagal memeriksa kepemilikan postingan",
          error
        )
      };
    }

    if (!data) {
      return {
        post: null,
        error:
          "Postingan tidak ditemukan atau bukan milik kamu."
      };
    }

    return {
      post: data,
      error: null
    };

  } catch (error) {
    return {
      post: null,
      error: mexaError(
        "Exception pemeriksaan postingan",
        error
      )
    };
  }
}

/* =========================================
   EDIT POST
========================================= */

export async function editPost(postId, oldContent = "") {
  const user = await getCurrentUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return false;
  }

  const result =
    await getOwnedPost(
      postId,
      user.id
    );

  if (result.error || !result.post) {
    alert(
      result.error ||
      "Postingan tidak ditemukan."
    );

    return false;
  }

  const content =
    prompt(
      "Edit postingan kamu:",
      result.post.content || oldContent
    );

  if (content === null) {
    return false;
  }

  const newContent =
    content.trim();

  if (!newContent) {
    alert(
      "Postingan tidak boleh kosong."
    );

    return false;
  }

  try {
    const {
      error
    } = await supabase
      .from("posts")
      .update({
        content: newContent,
        updated_at:
          new Date().toISOString()
      })
      .eq("id", postId)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "[MEXA] Edit post error:",
        error
      );

      alert(
        mexaError(
          "Gagal mengedit postingan",
          error
        )
      );

      return false;
    }

    alert(
      "Postingan berhasil diedit."
    );

    /*
     * Refresh agar Home mengambil data terbaru.
     */

    window.location.reload();

    return true;

  } catch (error) {
    alert(
      mexaError(
        "Exception edit postingan",
        error
      )
    );

    return false;
  }
}

/* =========================================
   DELETE POST
========================================= */

export async function deletePost(postId) {
  const user = await getCurrentUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return false;
  }

  const result =
    await getOwnedPost(
      postId,
      user.id
    );

  if (result.error || !result.post) {
    alert(
      result.error ||
      "Postingan tidak ditemukan."
    );

    return false;
  }

  const confirmed =
    confirm(
      "Hapus postingan ini?\n\n" +
      "Tindakan ini tidak bisa dibatalkan."
    );

  if (!confirmed) {
    return false;
  }

  try {
    const {
      error
    } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "[MEXA] Delete post error:",
        error
      );

      alert(
        mexaError(
          "Gagal menghapus postingan",
          error
        )
      );

      return false;
    }

    alert(
      "Postingan berhasil dihapus."
    );

    window.location.reload();

    return true;

  } catch (error) {
    alert(
      mexaError(
        "Exception hapus postingan",
        error
      )
    );

    return false;
  }
}

/* =========================================
   POST MENU
========================================= */

export async function mexaPostMenu(
  postId,
  oldContent = ""
) {
  const user = await getCurrentUser();

  if (!user) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  try {
    const {
      data: post,
      error
    } = await supabase
      .from("posts")
      .select("id,user_id,content")
      .eq("id", postId)
      .maybeSingle();

    if (error) {
      alert(
        mexaError(
          "Gagal mengambil postingan",
          error
        )
      );

      return;
    }

    if (!post) {
      alert(
        "Postingan tidak ditemukan."
      );

      return;
    }

    /*
     * POSTINGAN SENDIRI
     */

    if (post.user_id === user.id) {
      const pilihan =
        prompt(
          "MENU POSTINGAN MEXA\n\n" +
          "1 = Edit postingan\n" +
          "2 = Hapus postingan\n\n" +
          "Masukkan pilihan:"
        );

      if (pilihan === "1") {
        await editPost(
          postId,
          post.content || oldContent
        );

        return;
      }

      if (pilihan === "2") {
        await deletePost(
          postId
        );

        return;
      }

      return;
    }

    /*
     * POSTINGAN ORANG LAIN
     */

    const pilihan =
      prompt(
        "MENU POSTINGAN\n\n" +
        "Postingan ini bukan milikmu.\n\n" +
        "1 = Laporkan postingan\n" +
        "2 = Tutup"
      );

    if (pilihan === "1") {
      alert(
        "Fitur laporan akan kita sambungkan berikutnya."
      );
    }

  } catch (error) {
    alert(
      mexaError(
        "Exception menu postingan",
        error
      )
    );
  }
}

/* =========================================
   GLOBAL COMPATIBILITY
========================================= */

window.mexaEditPost = editPost;
window.mexaDeletePost = deletePost;
window.mexaPostMenu = mexaPostMenu;

window.mexaFunctionsReady = true;

console.log(
  "[MEXA] Functions aktif."
);
