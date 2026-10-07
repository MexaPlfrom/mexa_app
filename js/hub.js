import "./01_LOGIN/login.js";
import { showProfile } from "./02_PROFIL/profile.js";

console.log("MEXA HUB aktif");

window.addEventListener("mexa:login-success", () => {
  showProfile();
});
