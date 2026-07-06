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
        alert("Your message has been sent successfully.");
        contactForm.reset();
      })
      .catch((error) => {
        console.error(error);
        alert("Message could not be sent. Please try again.");
      });
  });
}
