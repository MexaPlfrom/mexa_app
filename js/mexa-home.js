const postModal = document.getElementById("postModal");
const openPostBtn = document.getElementById("openPostBtn");
const closePostModal = document.getElementById("closePostModal");
const publishBtn = document.getElementById("publishBtn");
const postText = document.getElementById("postText");

/* ================= POST MODAL ================= */

function openPost(){
  postModal.classList.remove("hidden");
  postText.focus();
}

function closePost(){
  postModal.classList.add("hidden");
  postText.value = "";
}

openPostBtn?.addEventListener("click", openPost);

closePostModal?.addEventListener(
  "click",
  closePost
);

postModal?.addEventListener(
  "click",
  function(event){

    if(event.target === postModal){
      closePost();
    }

  }
);


/* ================= PUBLISH TEST ================= */

publishBtn?.addEventListener(
  "click",
  function(){

    const text =
      postText.value.trim();

    if(!text){

      alert(
        "Tulis sesuatu terlebih dahulu."
      );

      return;
    }

    alert(
      "Postingan siap disimpan ke Supabase.\n\n" +
      "Koneksi database kita pasang pada tahap berikutnya."
    );

    closePost();

  }
);


/* ================= LIKE ================= */

document
  .querySelectorAll(".like-btn")
  .forEach(function(button){

    button.addEventListener(
      "click",
      function(){

        button.classList.toggle("liked");

        const span =
          button.querySelector("span");

        if(
          button.classList.contains("liked")
        ){

          button.innerHTML =
            "♥ <span>Disukai</span>";

        }else{

          button.innerHTML =
            "♡ <span>Suka</span>";

        }

      }
    );

  });


/* ================= COMMENT ================= */

document
  .querySelectorAll(".comment-btn")
  .forEach(function(button){

    button.addEventListener(
      "click",
      function(){

        const post =
          button.closest(".mexa-post");

        const input =
          post?.querySelector(
            ".comment-area input"
          );

        if(input){
          input.focus();
        }

      }
    );

  });


/* ================= SEND COMMENT ================= */

document
  .querySelectorAll(".send-comment")
  .forEach(function(button){

    button.addEventListener(
      "click",
      function(){

        const area =
          button.closest(".comment-area");

        const input =
          area?.querySelector("input");

        if(!input) return;

        const text =
          input.value.trim();

        if(!text){
          return;
        }

        alert(
          "Komentar siap disimpan ke Supabase:\n\n" +
          text
        );

        input.value = "";

      }
    );

  });


/* ================= SHARE ================= */

document
  .querySelectorAll(".share-btn")
  .forEach(function(button){

    button.addEventListener(
      "click",
      async function(){

        const shareText =
          "Lihat postingan di MEXA";

        if(
          navigator.share
        ){

          try{

            await navigator.share({
              title:"MEXA",
              text:shareText
            });

          }catch(error){

            // pengguna membatalkan share

          }

        }else{

          alert(
            "Bagikan postingan MEXA"
          );

        }

      }
    );

  });


/* ================= MENU ================= */

document
  .querySelectorAll(".mexa-menu button")
  .forEach(function(button){

    button.addEventListener(
      "click",
      function(){

        document
          .querySelectorAll(
            ".mexa-menu button"
          )
          .forEach(function(item){
            item.classList.remove("active");
          });

        button.classList.add("active");

        const page =
          button.dataset.page;

        if(page !== "home"){

          alert(
            "Halaman " +
            page +
            " akan kita bangun berikutnya."
          );

        }

      }
    );

  });


/* ================= HEADER BUTTONS ================= */

document
  .getElementById("notificationBtn")
  ?.addEventListener(
    "click",
    function(){

      alert(
        "Notifikasi MEXA"
      );

    }
  );

document
  .getElementById("messageBtn")
  ?.addEventListener(
    "click",
    function(){

      alert(
        "Pesan MEXA"
      );

    }
  );

document
  .getElementById("profileBtn")
  ?.addEventListener(
    "click",
    function(){

      alert(
        "Profil MEXA User"
      );

    }
  );


/* ================= SEARCH ================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );

searchInput?.addEventListener(
  "keydown",
  function(event){

    if(event.key !== "Enter"){
      return;
    }

    const query =
      searchInput.value.trim();

    if(!query){
      return;
    }

    alert(
      "Pencarian MEXA:\n\n" +
      query
    );

  }
);


/* ================= CREATE TOOLS ================= */

document
  .querySelectorAll("[data-create]")
  .forEach(function(button){

    button.addEventListener(
      "click",
      function(){

        const type =
          button.dataset.create;

        if(type === "photo"){
          alert("Foto akan tersedia.");
        }

        if(type === "video"){
          alert("Video akan tersedia.");
        }

        if(type === "location"){
          alert("Lokasi akan tersedia.");
        }

        if(type === "tag"){
          alert("Tag teman akan tersedia.");
        }

      }
    );

  });


/* ================= MOBILE PLUS ================= */

document
  .querySelector(".mobile-add")
  ?.addEventListener(
    "click",
    openPost
  );
