
/* Rapid Job Firebase User Authentication */
(function(){
"use strict";
const FIREBASE_CONFIG={
  apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",
  authDomain:"rapid-job-09.firebaseapp.com",
  databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:"rapid-job-09",
  storageBucket:"rapid-job-09.firebasestorage.app",
  messagingSenderId:"129444686750",
  appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"
};
if(typeof firebase==="undefined"){console.error("Firebase SDK not loaded.");return}
try{if(!firebase.apps.length)firebase.initializeApp(FIREBASE_CONFIG)}catch(e){console.warn(e)}
const auth=firebase.auth();
const db=firebase.database();
const storage=firebase.storage?firebase.storage():null;
const $=id=>document.getElementById(id);
window.RapidJobAuth={auth,db,storage};

function esc(v){return String(v||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function authError(code,message){
  const map={
    "auth/email-already-in-use":"This email is already registered.",
    "auth/invalid-email":"Please enter a valid email address.",
    "auth/weak-password":"Password should be at least 6 characters.",
    "auth/user-not-found":"No account was found for this email.",
    "auth/wrong-password":"Incorrect password.",
    "auth/invalid-credential":"Incorrect email or password.",
    "auth/too-many-requests":"Too many attempts. Please try again later.",
    "auth/network-request-failed":"Network connection failed.",
    "auth/requires-recent-login":"Please log in again before this action."
  };
  return map[code]||message||"Something went wrong. Please try again."
}
function showMessage(text,type="error"){
  const el=$("authMessage");if(!el)return;
  el.textContent=text;el.className="auth-message show "+type
}
function setLoading(btn,loading){
  if(!btn)return;btn.disabled=loading;btn.classList.toggle("loading",loading)
}
function initials(name,email){return String(name||email||"U").trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function nowIso(){return new Date().toISOString()}
async function userProfile(uid){
  const snap=await db.ref("users/"+uid).once("value");return snap.val()||{}
}
async function upsertUser(user,extra={}){
  const ref=db.ref("users/"+user.uid),snap=await ref.once("value"),old=snap.val()||{};
  const data={
    uid:user.uid,name:extra.name||old.name||user.displayName||"",
    email:user.email||old.email||"",mobile:extra.mobile||old.mobile||"",
    state:extra.state||old.state||"",district:extra.district||old.district||"",
    qualification:extra.qualification||old.qualification||"",
    preferredExams:extra.preferredExams||old.preferredExams||"",
    photoURL:extra.photoURL||old.photoURL||user.photoURL||"",
    role:old.role||"User",status:old.status||"Active",premium:Boolean(old.premium),
    joinedAt:old.joinedAt||nowIso(),lastLogin:nowIso(),emailVerified:Boolean(user.emailVerified),
    savedJobs:old.savedJobs||{},bookmarks:old.bookmarks||{},quizHistory:old.quizHistory||{},
    mockHistory:old.mockHistory||{},savedTimetables:old.savedTimetables||{},
    downloadHistory:old.downloadHistory||{},recentlyViewed:old.recentlyViewed||{}
  };
  await ref.update(data);return {...old,...data}
}
function redirectAfterLogin(){
  const params=new URLSearchParams(location.search),next=params.get("next");
  location.href=next&&next.startsWith("/")===false?next:"user-dashboard.html"
}
function togglePassword(btn,input){
  if(!btn||!input)return;
  btn.addEventListener("click",()=>{input.type=input.type==="password"?"text":"password";btn.innerHTML=input.type==="password"?'<i class="fa-solid fa-eye"></i>':'<i class="fa-solid fa-eye-slash"></i>'})
}
function passwordStrength(value){
  let score=0;if(value.length>=8)score++;if(/[A-Z]/.test(value))score++;if(/[0-9]/.test(value))score++;if(/[^A-Za-z0-9]/.test(value))score++;
  return score
}
function initHeader(){
  const login=$("rjLoginLink"),signup=$("rjSignupLink"),menu=$("rjUserMenu"),trigger=$("rjUserTrigger"),logout=$("rjHeaderLogout");
  if(!login&&!menu)return;
  auth.onAuthStateChanged(async user=>{
    if(user){
      const p=await userProfile(user.uid);
      if(p.status==="Blocked"){await auth.signOut();alert("Your Rapid Job account is blocked.");return}
      login&&(login.hidden=true);signup&&(signup.hidden=true);menu&&(menu.hidden=false);
      const name=p.name||user.displayName||user.email.split("@")[0];
      $("rjUserName")&&($("rjUserName").textContent=name.split(" ")[0]);
      const avatar=$("rjUserAvatar");
      if(avatar)avatar.innerHTML=p.photoURL?`<img src="${esc(p.photoURL)}" alt="">`:esc(initials(name,user.email))
    }else{login&&(login.hidden=false);signup&&(signup.hidden=false);menu&&(menu.hidden=true)}
  });
  trigger?.addEventListener("click",e=>{e.stopPropagation();menu.classList.toggle("open")});
  document.addEventListener("click",()=>menu?.classList.remove("open"));
  logout?.addEventListener("click",async()=>{await auth.signOut();location.href="index.html"})
}
function initLogin(){
  const form=$("loginForm");if(!form)return;
  togglePassword($("showLoginPassword"),$("loginPassword"));
  form.addEventListener("submit",async e=>{
    e.preventDefault();const btn=$("loginSubmit"),email=$("loginEmail").value.trim(),password=$("loginPassword").value;
    setLoading(btn,true);
    try{
      const cred=await auth.signInWithEmailAndPassword(email,password);
      const p=await userProfile(cred.user.uid);
      if(p.status==="Blocked"){await auth.signOut();throw new Error("Your account has been blocked by admin.")}
      await upsertUser(cred.user);showMessage("Login successful. Redirecting...","success");setTimeout(redirectAfterLogin,600)
    }catch(err){showMessage(authError(err.code,err.message))}
    finally{setLoading(btn,false)}
  })
}
function initSignup(){
  const form=$("signupForm");if(!form)return;
  const pass=$("signupPassword"),confirm=$("signupConfirm"),meter=$("passwordMeterBar");
  togglePassword($("showSignupPassword"),pass);togglePassword($("showSignupConfirm"),confirm);
  pass.addEventListener("input",()=>{const s=passwordStrength(pass.value);meter.style.width=(s*25)+"%";meter.style.background=s<=1?"#ef4444":s===2?"#f59e0b":s===3?"#10b981":"#075ee8"});
  form.addEventListener("submit",async e=>{
    e.preventDefault();const btn=$("signupSubmit");
    const data={name:$("signupName").value.trim(),email:$("signupEmail").value.trim(),mobile:$("signupMobile").value.trim(),state:$("signupState").value,qualification:$("signupQualification").value,preferredExams:$("signupExams").value.trim()};
    if(pass.value!==confirm.value)return showMessage("Passwords do not match.");
    if(passwordStrength(pass.value)<2)return showMessage("Use at least 8 characters with a number or capital letter.");
    if(!$("acceptTerms").checked)return showMessage("Please accept the Terms and Privacy Policy.");
    setLoading(btn,true);
    try{
      const cred=await auth.createUserWithEmailAndPassword(data.email,pass.value);
      await cred.user.updateProfile({displayName:data.name});
      await upsertUser(cred.user,data);
      await cred.user.sendEmailVerification();
      showMessage("Account created. Verification email sent. Redirecting...","success");
      setTimeout(redirectAfterLogin,1000)
    }catch(err){showMessage(authError(err.code,err.message))}
    finally{setLoading(btn,false)}
  })
}
function initForgot(){
  const form=$("forgotForm");if(!form)return;
  form.addEventListener("submit",async e=>{
    e.preventDefault();const btn=$("forgotSubmit");setLoading(btn,true);
    try{await auth.sendPasswordResetEmail($("forgotEmail").value.trim());showMessage("Password reset link sent. Check your inbox and spam folder.","success")}
    catch(err){showMessage(authError(err.code,err.message))}
    finally{setLoading(btn,false)}
  })
}
function requireUser(callback){
  auth.onAuthStateChanged(async user=>{
    if(!user){location.href="login.html?next="+encodeURIComponent(location.pathname.split("/").pop());return}
    const p=await userProfile(user.uid);
    if(p.status==="Blocked"){await auth.signOut();location.href="login.html";return}
    callback(user,p)
  })
}
function renderProfileSummary(user,p){
  document.querySelectorAll("[data-user-name]").forEach(x=>x.textContent=p.name||user.displayName||"Rapid Job User");
  document.querySelectorAll("[data-user-email]").forEach(x=>x.textContent=user.email||"");
  document.querySelectorAll("[data-user-initials]").forEach(x=>x.textContent=initials(p.name,user.email));
  document.querySelectorAll("[data-user-photo]").forEach(x=>{if(p.photoURL)x.src=p.photoURL})
}
function initProfile(){
  const form=$("profileForm");if(!form)return;
  requireUser((user,p)=>{
    renderProfileSummary(user,p);
    ["name","mobile","state","district","qualification","preferredExams"].forEach(k=>{const el=$("profile_"+k);if(el)el.value=p[k]||""});
    $("profile_email").value=user.email||"";
    const photo=$("profilePhoto");if(p.photoURL)photo.src=p.photoURL;
    $("verificationStatus").textContent=user.emailVerified?"Verified":"Not Verified";
    $("verificationStatus").className="status-pill "+(user.emailVerified?"verified":"unverified");
    form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = $("profileSave");
  const oldButtonText = btn.innerHTML;

  btn.disabled = true;
  btn.classList.add("loading");

  try {
    let photoURL = p.photoURL || "";
    const fileInput = $("profilePhotoFile");
    const file = fileInput?.files?.[0];

    if (file) {
      if (!storage) {
        throw new Error("Firebase Storage is not available.");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please choose a valid JPG or PNG image.");
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Profile photo must be under 2 MB.");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");

      const storageRef = storage.ref(
        `user-profile/${user.uid}/${Date.now()}-${safeName}`
      );

      const uploadSnapshot = await Promise.race([
        storageRef.put(file),

        new Promise((_, reject) =>
          setTimeout(() => {
            reject(
              new Error(
                "Photo upload timed out. Firebase Storage rules check karein."
              )
            );
          }, 30000)
        )
      ]);

      photoURL = await uploadSnapshot.ref.getDownloadURL();
    }

    const extra = {
      name: $("profile_name").value.trim(),
      mobile: $("profile_mobile").value.trim(),
      state: $("profile_state").value,
      district: $("profile_district").value.trim(),
      qualification: $("profile_qualification").value,
      preferredExams: $("profile_preferredExams").value.trim(),
      photoURL
    };

    if (!extra.name) {
      throw new Error("Full name is required.");
    }

    if (extra.mobile && !/^[0-9]{10}$/.test(extra.mobile)) {
      throw new Error("Please enter a valid 10-digit mobile number.");
    }

    await user.updateProfile({
      displayName: extra.name,
      photoURL: photoURL || null
    });

    await db.ref("users/" + user.uid).update({
      ...extra,
      email: user.email,
      emailVerified: user.emailVerified,
      lastUpdated: new Date().toISOString()
    });

    if (photoURL) {
      $("profilePhoto").src = photoURL;
    }

    if (fileInput) {
      fileInput.value = "";
    }

    showMessage("Profile updated successfully.", "success");

  } catch (error) {
    console.error("Profile save error:", error);

    showMessage(
      error.message || "Profile save nahi hua. Please try again.",
      "error"
    );

  } finally {
    btn.disabled = false;
    btn.classList.remove("loading");
    btn.innerHTML = oldButtonText;
  }
});
    $("profilePhotoFile").addEventListener("change",e=>{const f=e.target.files[0];if(f)$("profilePhoto").src=URL.createObjectURL(f)});
    $("verifyEmailBtn").onclick=async()=>{try{await user.sendEmailVerification();showMessage("Verification email sent.","success")}catch(err){showMessage(authError(err.code,err.message))}};
    $("deleteAccountBtn").onclick=()=>openAuthModal();
    $("confirmDeleteAccount").onclick=async()=>{
      try{
        await db.ref("accountDeleteRequests/"+user.uid).set({uid:user.uid,email:user.email,name:p.name||"",reason:$("deleteReason").value||"",requestedAt:nowIso(),status:"Pending"});
        closeAuthModal();showMessage("Account deletion request sent to admin.","success")
      }catch(err){showMessage(authError(err.code,err.message))}
    }
  })
}
function countObject(obj){return obj&&typeof obj==="object"?Object.keys(obj).length:0}
function initDashboard(){
  if(!$("dashboardWelcome"))return;
  requireUser(async(user,p)=>{
    renderProfileSummary(user,p);
    $("dashboardWelcome").textContent="Welcome, "+(p.name||user.displayName||"User");
    $("statSaved").textContent=countObject(p.savedJobs);
    $("statBookmarks").textContent=countObject(p.bookmarks);
    $("statTests").textContent=countObject(p.mockHistory)+countObject(p.quizHistory);
    $("statDownloads").textContent=countObject(p.downloadHistory);
    const noticesSnap=await db.ref("userNotifications/"+user.uid).once("value");
    const globalSnap=await db.ref("notifications").once("value");
    const notices=[...Object.values(globalSnap.val()||{}),...Object.values(noticesSnap.val()||{})].filter(n=>n.enabled!==false);
    const box=$("userNotifications");
    box.innerHTML=notices.length?notices.slice(0,8).map(n=>`<div class="notification-user"><b>${esc(n.title||"Notification")}</b><p>${esc(n.message||"")}</p><small>${esc(n.date||n.createdAt||"")}</small></div>`).join(""):'<div class="empty-user">No personal notifications yet.</div>';
    $("savedJobsList").innerHTML=countObject(p.savedJobs)?Object.values(p.savedJobs).map(j=>`<div class="notification-user"><b>${esc(j.title||"Saved Job")}</b></div>`).join(""):'<div class="empty-user">No saved jobs yet.</div>';
    $("userLogout").onclick=async()=>{await auth.signOut();location.href="index.html"}
  })
}
function openAuthModal(){$("deleteModal")?.classList.add("show")}
function closeAuthModal(){$("deleteModal")?.classList.remove("show")}
window.closeAuthModal=closeAuthModal;

document.addEventListener("DOMContentLoaded",()=>{
  initHeader();initLogin();initSignup();initForgot();initProfile();initDashboard();
});
})();
