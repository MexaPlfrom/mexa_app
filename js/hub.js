
import "./01_LOGIN/login.js";
import { supabase } from "./01_LOGIN/login.js";
import { showProfile } from "./02_PROFIL/profile.js";

console.log("MEXA HUB aktif");

window.addEventListener("mexa:login-success", () => {
  showProfile();
});

async function startMEXA() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    showProfile();
  }
}

startMEXA();
