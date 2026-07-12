const firebaseConfig = {
  apiKey: "AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",
  authDomain: "rapid-job-09.firebaseapp.com",
  databaseURL: "https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rapid-job-09",
  storageBucket: "rapid-job-09.firebasestorage.app",
  messagingSenderId: "129444686750",
  appId: "1:129444686750:web:6175ba1f1bfe7c9fff048f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const emailMobile = document.getElementById("emailMobile").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !emailMobile || !subject || !message) {
      alert("Please fill all fields.");
      return;
    }

    const messageData = {
      name: name,
      emailMobile: emailMobile,
      subject: subject,
      message: message,
      createdAt: new Date().toLocaleString("en-IN"),
      status: "New"
    };

    db.ref("contactMessages").push(messageData)
      .then(() => {
        showPopup("Your message has been sent successfully.");
        contactForm.reset();
      })
      .catch((error) => {
        console.error(error);
        alert("Message could not be sent. Please try again.");
      });
  });
}
function showPopup(msg){
  const box = document.createElement("div");
  box.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99999;">
      <div style="background:#fff;padding:28px;border-radius:18px;text-align:center;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.35);">
        <h2 style="margin:0 0 12px;color:#16a34a;">✅ Success</h2>
        <p style="font-size:16px;margin-bottom:20px;">${msg}</p>
        <button onclick="this.closest('div[style*=position]').remove()" style="padding:10px 28px;border:0;border-radius:10px;background:#075ee8;color:#fff;font-weight:800;cursor:pointer;">OK</button>
      </div>
    </div>`;
  document.body.appendChild(box);
}


// ===== Contact page live date and time =====
(function(){
  function updateContactClock(){
    const now = new Date();
    const dateEl = document.getElementById("contactLiveDate");
    const timeEl = document.getElementById("contactLiveTime");

    if(dateEl){
      dateEl.textContent = now.toLocaleDateString("en-GB",{
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
      });
    }

    if(timeEl){
      timeEl.textContent = now.toLocaleTimeString("en-IN",{
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:true
      });
    }
  }

  updateContactClock();
  setInterval(updateContactClock,1000);
})();
