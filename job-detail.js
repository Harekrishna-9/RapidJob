/* Rapid Job Detail Page - Fixed Loading Issue */
const firebaseConfig = {
  apiKey: "AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",
  authDomain: "rapid-job-09.firebaseapp.com",
  databaseURL: "https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rapid-job-09",
  storageBucket: "rapid-job-09.firebasestorage.app",
  messagingSenderId: "129444686750",
  appId: "1:129444686750:web:6175ba1f1bfe7c9fff048f"
};

let db = null;
try {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.database();
} catch (e) {
  console.warn("Firebase init error:", e);
}

const $ = (id) => document.getElementById(id);
const detailBox = $("detailBox");
const params = new URLSearchParams(window.location.search);
const postId = params.get("id") || params.get("postId") || params.get("jobId");
const postCategory = params.get("category") || params.get("type") || "";

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeType(t) {
  t = String(t || "").toLowerCase().trim();
  const map = {
    "latest job": "job", "post management": "job", "current job": "job", "job": "job",
    "new update": "new", "new": "new",
    "admit card": "admit", "admit": "admit",
    "results": "result", "result": "result",
    "answer key": "answer", "answerkey": "answer", "answer-key": "answer", "answer_key": "answer",
    "syllabus": "syllabus",
    "admissions": "admission", "admission": "admission",
    "scholarships": "scholarship", "scholarship": "scholarship",
    "latest blog": "blog", "latestblog": "blog", "latest-blog": "blog", "latest_blog": "blog", "blog": "blog",
    "study material": "study", "study": "study",
    "document": "document", "documents": "document", "doc": "document",
    "government yojana": "yojana", "sarkari yojna": "yojana", "yojana": "yojana"
  };
  return map[t] || t;
}

function label(t) {
  return {
    job: "Current Job", new: "New Update", admit: "Admit Card", result: "Result",
    answer: "Answer Key", syllabus: "Syllabus", admission: "Admission",
    scholarship: "Scholarship", blog: "Latest Blog", study: "Study Material",
    document: "Document", yojana: "Government Yojana"
  }[normalizeType(t)] || "Update";
}

function field(p, keys, fallback = "") {
  for (const k of keys) {
    if (p && p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== "") return p[k];
  }
  return fallback;
}

function nl2br(v) {
  return esc(v).replace(/\n/g, "<br>");
}

function makeSection(title, value, icon) {
  if (!value || String(value).trim() === "") return "";
  return `
    <section class="detail-section">
      <h2>${icon || "📌"} ${esc(title)}</h2>
      <div class="detail-text">${nl2br(value)}</div>
    </section>`;
}

function renderImportantLinks(p) {
  const links = [];
  const add = (title, url, cls, icon) => {
    if (url && String(url).trim()) links.push({ title, url: String(url).trim(), cls, icon });
  };

  add("Apply Online", field(p, ["applyLink", "apply", "onlineApply", "applicationLink"]), "apply", "fa-solid fa-arrow-up-right-from-square");
  add("Official Website", field(p, ["officialWebsite", "officialLink", "website"]), "official", "fa-solid fa-globe");
  add("Download Notification", field(p, ["notificationLink", "noticeLink", "pdfLink", "notification"]), "notice", "fa-regular fa-file-pdf");
  add("Result Link", field(p, ["resultLink"]), "result", "fa-solid fa-square-poll-vertical");
  add("Admit Card Link", field(p, ["admitCardLink", "admitLink"]), "admit", "fa-solid fa-download");
  add("Answer Key Link", field(p, ["answerKeyLink", "answerLink"]), "answer", "fa-solid fa-key");

  if (!links.length && Array.isArray(p.importantLinks)) {
    p.importantLinks.forEach((l) => add(l.title || l.text || "Open Link", l.url || l.link, "apply", "fa-solid fa-link"));
  }

  if (!links.length) return "";
  return `
    <section class="detail-section">
      <h2>🔗 Important Links</h2>
      <div class="important-links">
        ${links.map(l => `<a class="imp-card ${esc(l.cls)}" href="${esc(l.url)}" target="_blank" rel="noopener"><i class="${esc(l.icon)}"></i><span>${esc(l.title)}</span></a>`).join("")}
      </div>
    </section>`;
}

function renderDetail(p) {
  const title = field(p, ["title", "postTitle", "name"], "Rapid Job Update");
  const type = field(p, ["type", "category"], "Update");
  const state = field(p, ["state", "location"], "All India");
  const lastDate = field(p, ["lastDate", "date", "endDate", "closingDate"], "Check details");
  const details = field(p, ["details", "description", "content", "postDetails", "summary"], "Please check official notification for full details.");

  document.title = `${title} - Rapid Job`;

  detailBox.innerHTML = `
    <div class="detail-top">
      <span class="tag">${esc(label(type))}</span>
      <h1>${esc(title)}</h1>
      <p><b>State:</b> ${esc(state)} &nbsp; | &nbsp; <b>Last Date:</b> ${esc(lastDate)}</p>
    </div>

    ${makeSection("Short Information", details, "ℹ️")}
    ${makeSection("Important Dates", field(p, ["importantDates", "dates"]), "📅")}
    ${makeSection("Application Fee", field(p, ["applicationFee", "fee", "fees"]), "💰")}
    ${makeSection("Age Limit", field(p, ["ageLimit", "age"]), "🎂")}
    ${makeSection("Vacancy Details", field(p, ["vacancyDetails", "vacancy", "posts"]), "📋")}
    ${makeSection("Eligibility", field(p, ["eligibility", "qualification", "education"]), "✅")}
    ${makeSection("Exam Pattern", field(p, ["examPattern", "pattern"]), "📝")}
    ${makeSection("Selection Process", field(p, ["selectionProcess", "selection"]), "🏆")}
    ${makeSection("How to Apply", field(p, ["howToApply", "applyProcess"]), "🖊️")}
    ${renderImportantLinks(p)}
  `;

  setupShare(title);
}

function renderError(msg) {
  detailBox.innerHTML = `
    <div class="not-found-box">
      <h2>Post Not Found</h2>
      <p>${esc(msg)}</p>
      <a href="index.html" class="back-home">Go Back Home</a>
    </div>`;
}

async function findPostById(id) {
  if (!db) throw new Error("Firebase database not connected.");

  if (postCategory) {
    const catSnap = await db.ref(`posts/${postCategory}/${id}`).once("value");
    if (catSnap.exists()) return { id, ...catSnap.val() };
  }

  const directSnap = await db.ref(`posts/${id}`).once("value");
  if (directSnap.exists()) return { id, ...directSnap.val() };

  const allSnap = await db.ref("posts").once("value");
  const data = allSnap.val() || {};
  if (data[id] && typeof data[id] === "object") return { id, ...data[id] };

  for (const [cat, group] of Object.entries(data)) {
    if (group && typeof group === "object" && group[id]) return { id, category: cat, ...group[id] };
  }

  return null;
}

async function loadPost() {
  if (!postId) {
    renderError("Post ID missing in URL. Example: job-detail.html?id=POST_ID");
    return;
  }

  try {
    const post = await findPostById(postId);
    if (!post) {
      renderError("This post is not available in Firebase database.");
      return;
    }
    renderDetail(post);
  } catch (err) {
    console.error(err);
    renderError("Unable to load details. Please check Firebase connection and database path.");
  }
}

function setupShare(title) {
  const url = window.location.href;
  const text = `${title} - Rapid Job`;
  if ($("shareFb")) $("shareFb").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if ($("shareTw")) $("shareTw").href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if ($("shareWa")) $("shareWa").href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
  if ($("shareTg")) $("shareTg").href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if ($("copyLink")) $("copyLink").onclick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url).then(() => alert("Link copied successfully!"));
  };
}

if ($("printPage")) $("printPage").onclick = () => window.print();
if ($("savePdf")) $("savePdf").onclick = () => window.print();
if ($("backTop")) $("backTop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
window.addEventListener("scroll", () => {
  if ($("backTop")) $("backTop").style.display = window.scrollY > 250 ? "grid" : "none";
});

if ($("openAgeCalc")) $("openAgeCalc").onclick = (e) => {
  e.preventDefault();
  if ($("ageModal")) {
    $("ageModal").classList.add("show");
    $("ageModal").setAttribute("aria-hidden", "false");
  }
};
if ($("closeAgeCalc")) $("closeAgeCalc").onclick = () => {
  if ($("ageModal")) {
    $("ageModal").classList.remove("show");
    $("ageModal").setAttribute("aria-hidden", "true");
  }
};
if ($("ageModal")) $("ageModal").onclick = (e) => {
  if (e.target === $("ageModal")) $("closeAgeCalc").click();
};
if ($("calcAgeBtn")) $("calcAgeBtn").onclick = () => {
  const dob = $("dobInput")?.value;
  if (!dob) {
    if ($("ageResult")) $("ageResult").innerHTML = "Please select date of birth.";
    return;
  }
  const birth = new Date(dob);
  const today = new Date();
  let y = today.getFullYear() - birth.getFullYear();
  let m = today.getMonth() - birth.getMonth();
  let d = today.getDate() - birth.getDate();
  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  if ($("ageResult")) $("ageResult").innerHTML = `<b>Your Age:</b> ${y} Years ${m} Months ${d} Days`;
};

loadPost();
