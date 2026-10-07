import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://cnxmogmmeixhzjqzpzqf.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable__dnVVEE7jYGfiEGaXbszuw_DHBeWA7Y";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/* =========================================
   ELEMENT
========================================= */

const postModal = document.getElementById("postModal");
const openPostBtn = document.getElementById("openPostBtn");
const closePostModal = document.getElementById("closePostModal");
const publishBtn = document.getElementById("publishBtn");
const postText = document.getElementById("postText");

const feed = document.querySelector(".mexa-feed");

/* =========================================
   STATE
========================================= */

let currentUser = null;
let currentProfile = null;


/* =========================================
   UTIL
========================================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstLetter(name = "M") {
  return name.trim().charAt(0).toUpperCase() || "M";
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (seconds < 60) {
    return "Baru saja";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} hari lalu`;
  }

  return date.toLocaleDateString("id-ID");
}

function showMessage(message) {
  alert(message);
}


/* =========================================
   LOGIN CHECK
========================================= */

async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    window.location.href = "./login.html";
    return null;
  }

  return user;
}


/* =========================================
   PROFILE
========================================= */

async function loadProfile(user) {

  let {
    data: profile,
    error
  } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Profile error:", error);
    return null;
  }

  /*
   * Kalau profil belum ada, buat dari metadata
   * akun yang sudah login.
   */

  if (!profile) {

    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.name ||
      "MEXA User";

    const username =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "mexauser";

    const result =
      await supabase
        .from("profiles")
        .insert({
          id: user.id,
          display_name: displayName,
          username: username
        })
        .select()
        .single();

    if (result.error) {
      console.error(
        "Create profile error:",
        result.error
      );
      return null;
    }

    profile = result.data;
  }

  return profile;
}


/* =========================================
   UPDATE USER UI
========================================= */

function updateUserUI() {

  if (!currentProfile) return;

  const name =
    currentProfile.display_name ||
    "MEXA User";

  const username =
    currentProfile.username ||
    "mexauser";

  const letter =
    firstLetter(name);

  /*
   * Semua avatar
   */

  document
    .querySelectorAll(".mexa-avatar")
    .forEach((avatar) => {

      avatar.textContent = letter;

    });


  /*
   * Sidebar profile
   */

  const sidebar =
    document.querySelector(
      ".mexa-sidebar-profile"
    );

  if (sidebar) {

    const strong =
      sidebar.querySelector("strong");

    const small =
      sidebar.querySelector("small");

    if (strong) {
      strong.textContent = name;
    }

    if (small) {
      small.textContent =
        "@" + username;
    }
  }


  /*
   * Right profile
   */

  const profileCard =
    document.querySelector(
      ".profile-card"
    );

  if (profileCard) {

    const strong =
      profileCard.querySelector(
        ":scope > strong"
      );

    const small =
      profileCard.querySelector(
        ":scope > small"
      );

    if (strong) {
      strong.textContent = name;
    }

    if (small) {
      small.textContent =
        "@" + username;
    }
  }
}


/* =========================================
   LOAD POSTS
========================================= */

async function loadPosts() {

  const {
    data: posts,
    error
  } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {

    console.error(
      "Posts error:",
      error
    );

    showMessage(
      "Gagal mengambil postingan dari Supabase."
    );

    return;
  }


  /*
   * Ambil semua user ID
   */

  const userIds = [
    ...new Set(
      (posts || []).map(
        post => post.user_id
      )
    )
  ];


  let profiles = [];

  if (userIds.length) {

    const result =
      await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

    if (!result.error) {
      profiles = result.data || [];
    }
  }


  const profileMap =
    new Map(
      profiles.map(
        profile => [
          profile.id,
          profile
        ]
      )
    );


  /*
   * Ambil like/comment/share
   */

  const [
    likesResult,
    commentsResult,
    sharesResult
  ] = await Promise.all([

    supabase
      .from("post_likes")
      .select("post_id,user_id"),

    supabase
      .from("post_comments")
      .select("post_id"),

    supabase
      .from("post_shares")
      .select("post_id")

  ]);


  const likes =
    likesResult.data || [];

  const comments =
    commentsResult.data || [];

  const shares =
    sharesResult.data || [];


  /*
   * Hitung jumlah
   */

  const likeCounts = {};
  const commentCounts = {};
  const shareCounts = {};

  likes.forEach(item => {

    likeCounts[item.post_id] =
      (likeCounts[item.post_id] || 0) + 1;

  });

  comments.forEach(item => {

    commentCounts[item.post_id] =
      (commentCounts[item.post_id] || 0) + 1;

  });

  shares.forEach(item => {

    shareCounts[item.post_id] =
      (shareCounts[item.post_id] || 0) + 1;

  });


  /*
   * Apakah user sudah like?
   */

  const likedPosts =
    new Set(
      likes
        .filter(
          item =>
            item.user_id === currentUser.id
        )
        .map(
          item => item.post_id
        )
    );


  renderPosts(
    posts || [],
    profileMap,
    likeCounts,
    commentCounts,
    shareCounts,
    likedPosts
  );
}


/* =========================================
   RENDER POSTS
========================================= */

function renderPosts(
  posts,
  profileMap,
  likeCounts,
  commentCounts,
  shareCounts,
  likedPosts
) {

  /*
   * Jangan hapus Stories dan Create Post.
   * Hapus hanya postingan lama.
   */

  feed
    .querySelectorAll(".mexa-post")
    .forEach(post => post.remove());


  const createPost =
    feed.querySelector(
      ".mexa-create-post"
    );


  if (!posts.length) {

    const empty =
      document.createElement("article");

    empty.className =
      "mexa-card mexa-post";

    empty.innerHTML = `
      <div style="
        padding:35px 20px;
        text-align:center;
        color:#7d879d;
      ">
        <div style="
          font-size:35px;
          margin-bottom:10px;
        ">💙</div>

        <strong>
          Belum ada postingan
        </strong>

        <div style="
          margin-top:6px;
          font-size:13px;
        ">
          Jadilah yang pertama berbagi cerita di MEXA.
        </div>
      </div>
    `;

    createPost?.after(empty);

    return;
  }


  posts.forEach(post => {

    const profile =
      profileMap.get(
        post.user_id
      );

    const name =
      profile?.display_name ||
      "MEXA User";

    const username =
      profile?.username ||
      "mexauser";

    const letter =
      firstLetter(name);

    const likes =
      likeCounts[post.id] || 0;

    const comments =
      commentCounts[post.id] || 0;

    const shares =
      shareCounts[post.id] || 0;

    const isLiked =
      likedPosts.has(post.id);

    const isOwner =
      post.user_id === currentUser.id;


    const article =
      document.createElement("article");

    article.className =
      "mexa-card mexa-post";

    article.dataset.postId =
      post.id;

    article.innerHTML = `

      <div class="post-header">

        <div class="mexa-avatar">
          ${escapeHTML(letter)}
        </div>

        <div class="post-user">

          <strong>
            ${escapeHTML(name)}
          </strong>

          <small>
            @${escapeHTML(username)}
            · ${timeAgo(post.created_at)}
            · Publik
          </small>

        </div>

        <button
          class="post-more"
          data-post-menu="${post.id}"
          aria-label="Menu postingan"
        >
          ⋯
        </button>

      </div>


      <div class="post-content">
        ${escapeHTML(post.content)
          .replaceAll("\n", "<br>")}
      </div>


      <div class="post-stat">

        <span>
          ♥ ${likes} suka
        </span>

        <span>
          ${comments} komentar · ↗ ${shares}
        </span>

      </div>


      <div class="post-actions">

        <button
          class="like-btn ${isLiked ? "liked" : ""}"
          data-like="${post.id}"
        >
          ${isLiked ? "♥" : "♡"}
          <span>
            ${isLiked ? "Disukai" : "Suka"}
          </span>
        </button>

        <button
          class="comment-btn"
          data-comment="${post.id}"
        >
          ▢ <span>Komentar</span>
        </button>

        <button
          class="share-btn"
          data-share="${post.id}"
        >
          ↗ <span>Bagikan</span>
        </button>

      </div>


      <div class="comment-area">

        <div class="mexa-avatar small">
          ${escapeHTML(
            firstLetter(
              currentProfile?.display_name ||
              "MEXA"
            )
          )}
        </div>

        <input
          type="text"
          data-comment-input="${post.id}"
          placeholder="Tulis komentar..."
        >

        <button
          class="send-comment"
          data-send-comment="${post.id}"
        >
          ➤
        </button>

      </div>

    `;


    /*
     * Tambahkan tombol edit/hapus
     * hanya jika pemilik postingan.
     */

    if (isOwner) {

      const menuButton =
        article.querySelector(
          ".post-more"
        );

      menuButton.dataset.owner =
        "true";
    }


    createPost?.after(article);

  });


  attachPostEvents();
}


/* =========================================
   POST EVENTS
========================================= */

function attachPostEvents() {


  /*
   * LIKE
   */

  document
    .querySelectorAll("[data-like]")
    .forEach(button => {

      button.onclick =
        async () => {

          const postId =
            button.dataset.like;

          await toggleLike(
            postId
          );

        };

    });


  /*
   * COMMENT FOCUS
   */

  document
    .querySelectorAll("[data-comment]")
    .forEach(button => {

      button.onclick =
        () => {

          const postId =
            button.dataset.comment;

          const input =
            document.querySelector(
              `[data-comment-input="${postId}"]`
            );

          input?.focus();

        };

    });


  /*
   * SEND COMMENT
   */

  document
    .querySelectorAll(
      "[data-send-comment]"
    )
    .forEach(button => {

      button.onclick =
        async () => {

          const postId =
            button.dataset.sendComment;

          const input =
            document.querySelector(
              `[data-comment-input="${postId}"]`
            );

          if (!input) return;

          const text =
            input.value.trim();

          if (!text) return;

          button.disabled = true;

          await createComment(
            postId,
            text
          );

          button.disabled = false;

        };

    });


  /*
   * SHARE
   */

  document
    .querySelectorAll("[data-share]")
    .forEach(button => {

      button.onclick =
        async () => {

          const postId =
            button.dataset.share;

          await sharePost(
            postId
          );

        };

    });


  /*
   * THREE DOT
   */

  document
    .querySelectorAll(
      "[data-post-menu]"
    )
    .forEach(button => {

      button.onclick =
        () => {

          const postId =
            button.dataset.postMenu;

          showPostMenu(
            postId
          );

        };

    });

}


/* =========================================
   LIKE
========================================= */

async function toggleLike(postId) {

  const {
    data: existing,
    error
  } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", currentUser.id)
    .maybeSingle();


  if (error) {

    console.error(error);

    showMessage(
      "Gagal mengecek like."
    );

    return;
  }


  if (existing) {

    const result =
      await supabase
        .from("post_likes")
        .delete()
        .eq("id", existing.id)
        .eq("user_id", currentUser.id);

    if (result.error) {

      showMessage(
        "Gagal membatalkan like."
      );

      return;
    }

  } else {

    const result =
      await supabase
        .from("post_likes")
        .insert({
          post_id: postId,
          user_id: currentUser.id
        });

    if (result.error) {

      showMessage(
        "Gagal memberi like."
      );

      return;
    }
  }


  await loadPosts();
}


/* =========================================
   COMMENT
========================================= */

async function createComment(
  postId,
  content
) {

  const {
    error
  } = await supabase
    .from("post_comments")
    .insert({
      post_id: postId,
      user_id: currentUser.id,
      content
    });


  if (error) {

    console.error(error);

    showMessage(
      "Gagal menyimpan komentar."
    );

    return;
  }


  await loadPosts();
}


/* =========================================
   SHARE
========================================= */

async function sharePost(postId) {

  const {
    error
  } = await supabase
    .from("post_shares")
    .insert({
      post_id: postId,
      user_id: currentUser.id
    });


  if (error) {

    console.error(error);

    showMessage(
      "Gagal mencatat bagikan."
    );

    return;
  }


  const shareData = {
    title: "MEXA",
    text: "Lihat postingan di MEXA"
  };


  if (navigator.share) {

    try {

      await navigator.share(
        shareData
      );

    } catch (error) {

      /*
       * User membatalkan share.
       */

    }

  } else {

    showMessage(
      "Postingan berhasil dicatat untuk dibagikan."
    );

  }


  await loadPosts();
}


/* =========================================
   THREE DOT MENU
========================================= */

function showPostMenu(postId) {

  const post =
    document.querySelector(
      `[data-post-id="${postId}"]`
    );

  if (!post) return;


  /*
   * Cek kepemilikan dari database.
   */

  const ownerButton =
    post.querySelector(
      `[data-post-menu="${postId}"]`
    );


  if (
    !ownerButton ||
    ownerButton.dataset.owner !== "true"
  ) {

    showMessage(
      "Kamu hanya bisa mengelola postingan milikmu sendiri."
    );

    return;
  }


  const choice =
    prompt(
      "MENU POSTINGAN\n\n" +
      "1. Edit\n" +
      "2. Hapus\n\n" +
      "Ketik 1 atau 2:"
    );


  if (choice === "1") {

    editPost(postId);

  }

  if (choice === "2") {

    deletePost(postId);

  }
}


/* =========================================
   EDIT POST
========================================= */

async function editPost(postId) {

  const {
    data: post,
    error
  } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("user_id", currentUser.id)
    .single();


  if (error || !post) {

    showMessage(
      "Postingan tidak ditemukan atau bukan milik kamu."
    );

    return;
  }


  const newContent =
    prompt(
      "Edit postingan:",
      post.content
    );


  if (
    newContent === null
  ) {
    return;
  }


  const content =
    newContent.trim();


  if (!content) {

    showMessage(
      "Isi postingan tidak boleh kosong."
    );

    return;
  }


  const result =
    await supabase
      .from("posts")
      .update({
        content,
        updated_at:
          new Date().toISOString()
      })
      .eq("id", postId)
      .eq("user_id", currentUser.id);


  if (result.error) {

    console.error(result.error);

    showMessage(
      "Gagal mengedit postingan."
    );

    return;
  }


  await loadPosts();
}


/* =========================================
   DELETE POST
========================================= */

async function deletePost(postId) {

  const {
    data: post,
    error
  } = await supabase
    .from("posts")
    .select("id")
    .eq("id", postId)
    .eq("user_id", currentUser.id)
    .maybeSingle();


  if (error || !post) {

    showMessage(
      "Postingan tidak ditemukan atau bukan milik kamu."
    );

    return;
  }


  const confirmed =
    confirm(
      "Hapus postingan ini?"
    );


  if (!confirmed) {
    return;
  }


  const result =
    await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", currentUser.id);


  if (result.error) {

    console.error(result.error);

    showMessage(
      "Gagal menghapus postingan."
    );

    return;
  }


  await loadPosts();
}


/* =========================================
   CREATE POST
========================================= */

async function createPost() {

  const content =
    postText.value.trim();

  if (!content) {

    showMessage(
      "Tulis sesuatu terlebih dahulu."
    );

    return;
  }


  publishBtn.disabled = true;

  publishBtn.textContent =
    "Menyimpan...";


  const {
    error
  } = await supabase
    .from("posts")
    .insert({
      user_id: currentUser.id,
      content
    });


  if (error) {

    console.error(error);

    publishBtn.disabled = false;

    publishBtn.textContent =
      "Posting";

    showMessage(
      "Gagal menyimpan postingan ke Supabase."
    );

    return;
  }


  publishBtn.disabled = false;

  publishBtn.textContent =
    "Posting";


  closePost();

  await loadPosts();
}


/* =========================================
   POST MODAL
========================================= */

function openPost() {

  postModal?.classList.remove(
    "hidden"
  );

  postText?.focus();
}


function closePost() {

  postModal?.classList.add(
    "hidden"
  );

  if (postText) {
    postText.value = "";
  }

}


openPostBtn?.addEventListener(
  "click",
  openPost
);


closePostModal?.addEventListener(
  "click",
  closePost
);


postModal?.addEventListener(
  "click",
  event => {

    if (
      event.target === postModal
    ) {
      closePost();
    }

  }
);


publishBtn?.addEventListener(
  "click",
  createPost
);


/* =========================================
   PROFILE BUTTON
========================================= */

function openProfile() {

  if (!currentProfile) {
    return;
  }

  const name =
    currentProfile.display_name ||
    "MEXA User";

  const username =
    currentProfile.username ||
    "mexauser";

  showMessage(
    `Profil MEXA\n\n` +
    `${name}\n` +
    `@${username}`
  );
}


document
  .getElementById("profileBtn")
  ?.addEventListener(
    "click",
    openProfile
  );


/* =========================================
   PROFILE CARD
========================================= */

document
  .querySelector(".profile-button")
  ?.addEventListener(
    "click",
    openProfile
  );


/* =========================================
   MENU
========================================= */

document
  .querySelectorAll(
    ".mexa-menu button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".mexa-menu button"
          )
          .forEach(item => {

            item.classList.remove(
              "active"
            );

          });

        button.classList.add(
          "active"
        );


        const page =
          button.dataset.page;


        if (page === "profile") {

          openProfile();

          return;
        }


        if (page === "posts") {

          loadMyPosts();

          return;
        }


        if (page !== "home") {

          showMessage(
            `Halaman ${page} akan kita bangun berikutnya.`
          );

        }

      }
    );

  });


/* =========================================
   MY POSTS
========================================= */

async function loadMyPosts() {

  const {
    data,
    error
  } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", {
      ascending: false
    });


  if (error) {

    showMessage(
      "Gagal mengambil postingan kamu."
    );

    return;
  }


  showMessage(
    `Postingan saya: ${data?.length || 0}`
  );
}


/* =========================================
   HEADER
========================================= */

document
  .getElementById("notificationBtn")
  ?.addEventListener(
    "click",
    () => {

      showMessage(
        "Notifikasi MEXA akan kita sambungkan berikutnya."
      );

    }
  );


document
  .getElementById("messageBtn")
  ?.addEventListener(
    "click",
    () => {

      showMessage(
        "Pesan MEXA akan kita sambungkan berikutnya."
      );

    }
  );


/* =========================================
   SEARCH
========================================= */

document
  .getElementById("searchInput")
  ?.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Enter"
      ) {
        return;
      }

      const query =
        event.currentTarget.value.trim();

      if (!query) {
        return;
      }

      showMessage(
        `Pencarian MEXA:\n\n${query}`
      );

    }
  );


/* =========================================
   CREATE TOOLS
========================================= */

document
  .querySelectorAll(
    "[data-create]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const type =
          button.dataset.create;

        if (type === "photo") {

          showMessage(
            "Fitur Foto kita sambungkan berikutnya."
          );

        }

        if (type === "video") {

          showMessage(
            "Fitur Video kita sambungkan berikutnya."
          );

        }

        if (type === "location") {

          showMessage(
            "Fitur Lokasi kita sambungkan berikutnya."
          );

        }

        if (type === "tag") {

          showMessage(
            "Fitur Tag kita sambungkan berikutnya."
          );

        }

      }
    );

  });


/* =========================================
   MOBILE PLUS
========================================= */

document
  .querySelector(".mobile-add")
  ?.addEventListener(
    "click",
    openPost
  );


/* =========================================
   START MEXA
========================================= */

async function startMEXA() {

  currentUser =
    await getCurrentUser();

  if (!currentUser) {
    return;
  }


  currentProfile =
    await loadProfile(
      currentUser
    );


  updateUserUI();

  await loadPosts();

}


startMEXA();
