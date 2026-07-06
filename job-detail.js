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

const detailBox = document.getElementById("detailBox");
const id = new URLSearchParams(location.search).get("id");
const safe = value => (value ?? "").toString().trim();
const esc = value => safe(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const br = value => esc(value).replaceAll("\n", "<br>");
const val = (post, key, fallback = "Check Notification") => safe(post[key]) || fallback;

const demoPost = {
  title: "RRB Ministerial & Isolated Categories Online Form 2026",
  organization: "Railway Recruitment Board",
  updatedOn: "04 July 2026 10:42 PM",
  description: "Railway Recruitment Board (RRB) invites online applications for the recruitment of various ministerial and isolated categories posts. A total of 312 vacancies are available. Interested and eligible candidates can apply online from 30th December 2025 to 29th January 2026. Read the full notification before applying.",
  startDate: "30-12-2025",
  lastDate: "29-01-2026",
  feeDate: "31-01-2026",
  examDate: "14 & 15 July 2026",
  ageAsOn: "01.01.2026",
  minAge: "18 Years",
  maxAge: "See Below Post Wise",
  totalPost: "312",
  applyLink: "#",
  pdfLink: "#",
  officialLink: "#",
  fee: "SC / ST / Female / ESM / Minorities / EBC: Rs.250/-\nAll Other Candidates: Rs.500/-\nPayment can be made through Debit Card, Credit Card, Internet Banking or UPI.",
  selectionProcess: "Computer Based Test (CBT)\nSkill Test / Typing Test (Post Wise)\nDocument Verification\nMedical Examination",
  howToApply: "Visit the official website of RRB.\nClick on the Apply Online link.\nFill the application form carefully.\nUpload required documents and pay the fee.\nSubmit and take a printout for future reference.",
  salary: "Pay Level-2 to Pay Level-7\nAs per 7th CPC Pay Matrix and other allowances as applicable.",
  eligibility: "Read the official notification carefully for post wise eligibility, educational qualification, age limit and other details.",
  vacancyRows: [
    ["Chief Law Assistant", "Level-6", "54", "Degree in Law with 3 Years Practice"],
    ["Junior Translator (Hindi)", "Level-6", "130", "Master Degree with Hindi & English"],
    ["Staff and Welfare Inspector", "Level-6", "08", "Graduate + Relevant Diploma"],
    ["Scientific Assistant / Training", "Level-6", "16", "Master Degree in Psychology"],
    ["Lab Assistant Grade-III", "Level-2", "12", "12th with Science (PCM)"]
  ],
  examRows: [
    ["General Intelligence & Reasoning", "50", "50", "90 Minutes"],
    ["General Awareness", "40", "40", ""],
    ["General Science", "40", "40", ""],
    ["Mathematics", "40", "40", ""]
  ],
  faq: "What is the last date to apply? | 29-01-2026\nWhat is the application fee? | Rs.250/- for reserved and Rs.500/- for others.\nWhat is the total number of vacancies? | 312 Posts"
};

function list(value, fallback = []) {
  let items = Array.isArray(value) ? value : safe(value).split("\n").filter(Boolean);
  if (!items.length) items = fallback;
  return items.map(item => `<li>${br(item)}</li>`).join("");
}

function vacancyTable(post) {
  if (safe(post.vacancyTable)) return post.vacancyTable;
  const rows = post.vacancyRows || [[val(post, "postName", val(post, "title", "Post Name")), "-", val(post, "totalPost", "--"), val(post, "eligibility", "Read official notification for eligibility details.")]];
  return `<table class="vacancy-table"><tr><th>Post Name</th><th>Pay Level</th><th>Total Post</th><th>Eligibility</th></tr>${rows.map(row => `<tr><td>${br(row[0])}</td><td>${br(row[1])}</td><td>${br(row[2])}</td><td>${br(row[3])}</td></tr>`).join("")}</table>`;
}

function examTable(post) {
  const rows = post.examRows || demoPost.examRows;
  return `<table class="exam-table"><tr><th>Subject</th><th>Questions</th><th>Marks</th><th>Duration</th></tr>${rows.map(row => `<tr><td>${br(row[0])}</td><td>${br(row[1])}</td><td>${br(row[2])}</td><td>${br(row[3])}</td></tr>`).join("")}</table>`;
}

function faqHtml(post) {
  const lines = safe(post.faq).split("\n").filter(Boolean);
  if (!lines.length) return "<p><b>Q.</b> What is the last date to apply?<br><b>Ans:</b> Check notification.</p>";
  return lines.map(line => {
    const [question, answer] = line.split("|");
    return `<p><b>Q.</b> ${br(question)}<br><b>Ans:</b> ${br(answer || "Check notification")}</p>`;
  }).join("");
}

function setShare() {
  const pageUrl = encodeURIComponent(location.href);
  const pageTitle = encodeURIComponent(document.title);
  const links = {
    shareFb: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    shareTw: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
    shareWa: `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`,
    shareTg: `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`
  };

  Object.entries(links).forEach(([id, href]) => {
    const element = document.getElementById(id);
    if (element) element.href = href;
  });

  const copyLink = document.getElementById("copyLink");
  if (copyLink) {
    copyLink.onclick = event => {
      event.preventDefault();
      navigator.clipboard.writeText(location.href);
      alert("Link copied successfully");
    };
  }
}

function renderDetail(post) {
  const data = { ...demoPost, ...post };
  const title = val(data, "title", "Rapid Job Details");
  document.title = `${title} | Rapid Job`;

  detailBox.innerHTML = `
    <div class="breadcrumb"><i class="fa-solid fa-house"></i> Home / Current Job / ${br(title)}</div>
    <div class="job-card">
      <div class="top-flex">
        <div class="job-main">
          <h1 class="job-title">${br(title)}</h1>
          <p class="updated"><i class="fa-regular fa-clock"></i> Updated On : ${br(val(data, "updatedOn"))}</p>
          <p class="desc">${br(val(data, "description")).replace(/312|30th December 2025|29th January 2026/g, match => `<b>${match}</b>`)}</p>
        </div>
        <div class="job-logo"><i class="fa-solid fa-briefcase"></i></div>
      </div>

      <div class="btn-row">
        <a class="btn btn-yellow" href="index.html#latest"><i class="fa-solid fa-list"></i> View All Jobs</a>
        <a class="btn btn-green" href="${val(data, "applyLink", "#")}" target="_blank"><i class="fa-solid fa-paper-plane"></i> Apply Online</a>
        <a class="btn btn-blue" href="${val(data, "officialLink", "#")}" target="_blank"><i class="fa-solid fa-globe"></i> Official Website</a>
      </div>

      <div class="info-grid">
        <div class="info-box"><h2><i class="fa-solid fa-calendar-check"></i> Important Dates</h2><div class="body"><ul><li>Application Start Date : <b>${br(val(data, "startDate"))}</b></li><li>Application Last Date : <span class="red">${br(val(data, "lastDate"))}</span></li><li>Fee Payment Last Date : <b>${br(val(data, "feeDate"))}</b></li><li>Exam Date : <b>${br(val(data, "examDate"))}</b></li></ul></div></div>
        <div class="info-box"><h2><i class="fa-solid fa-indian-rupee-sign"></i> Application Fee</h2><div class="body"><ul>${list(data.fee)}</ul></div></div>
        <div class="info-box"><h2><i class="fa-solid fa-user-clock"></i> Age Limit (As on ${br(val(data, "ageAsOn", "01-01-2026"))})</h2><div class="body"><ul><li>Minimum Age : <b>${br(val(data, "minAge"))}</b></li><li>Maximum Age : <b>${br(val(data, "maxAge"))}</b></li><li>Age Relaxation : As per Government Rules</li></ul><a href="#" class="imp-card apply age-text-link">
    <i class="fa-solid fa-calendar-days"></i>
    <span>Age Calculator</span>
</a></div></div>
        <div class="info-box"><h2><i class="fa-solid fa-layer-group"></i> Total Post</h2><div class="total-post">${br(val(data, "totalPost", "--"))}</div></div>
      </div>

      <div class="section-title"><i class="fa-solid fa-table"></i> Vacancy Details</div>
      ${vacancyTable(data)}

      <div class="notice-box"><div><b>✅ Vacancy Criteria</b><br>Candidates must read the official notification carefully before applying. Post wise eligibility, educational qualification, age limit, experience and other details are available in the official notification.</div><a class="download-btn" href="${val(data, "pdfLink", "#")}" target="_blank"><i class="fa-solid fa-download"></i> Download Notification</a></div>

      <div class="two-col">
        <div class="mini-panel"><h3><i class="fa-solid fa-trophy"></i> Selection Process</h3><ul>${list(data.selectionProcess)}</ul></div>
        <div class="mini-panel"><h3><i class="fa-solid fa-clipboard-list"></i> Exam Pattern (CBT)</h3>${examTable(data)}</div>
        <div class="mini-panel"><h3><i class="fa-solid fa-money-bill-wave"></i> Salary / Pay Scale</h3><p>${br(val(data, "salary", "Check notification for salary details."))}</p></div>
        <div class="mini-panel"><h3><i class="fa-solid fa-file-pen"></i> How to Apply</h3><ol>${list(data.howToApply)}</ol></div>
        <div class="mini-panel links-panel"><h3><i class="fa-solid fa-link"></i> Important Links</h3><div class="important-links"><a class="imp-card apply" href="${val(data, "applyLink", "#")}" target="_blank"><i class="fa-solid fa-paper-plane"></i><span>Apply</span></a><a class="imp-card notification" href="${val(data, "pdfLink", "#")}" target="_blank"><i class="fa-solid fa-file-lines"></i><span>Notification</span></a><a class="imp-card syllabus" href="index.html#syllabus"><i class="fa-solid fa-book-open"></i><span>Syllabus</span></a><a class="imp-card website" href="${val(data, "officialLink", "#")}" target="_blank"><i class="fa-solid fa-globe"></i><span>Website</span></a></div></div>
        <div class="mini-panel faq-panel"><h3><i class="fa-solid fa-circle-question"></i> FAQ</h3>${faqHtml(data)}</div>
      </div>

      <div class="bottom-disclaimer disclaimer"><b><i class="fa-solid fa-shield-halved"></i> Disclaimer</b>This website will not be responsible for minor or major mistakes or inaccuracy. Before taking any action, please check the official notification or portal.</div>
    </div>`;

  setShare();
  makeInlineAgeCard();
}

function makeInlineAgeCard() {
    // Disabled - Sidebar button is used instead.
}

function initAgeCalculator() {
  const modal = document.getElementById("ageModal");
  const dob = document.getElementById("dobInput");
  const result = document.getElementById("ageResult");

  const openAge = event => {
    if (event) event.preventDefault();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    setTimeout(() => dob.focus(), 100);
  };

  const closeAge = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  const calculateAge = () => {
    if (!dob.value) {
      result.style.display = "block";
      result.innerHTML = "<strong>⚠</strong>Please select your date of birth.";
      return;
    }

    const birth = new Date(dob.value);
    const today = new Date();

    if (birth > today) {
      result.style.display = "block";
      result.innerHTML = "<strong>⚠</strong>Date of birth cannot be future date.";
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    result.style.display = "block";
    result.innerHTML = `<strong>${years} Years</strong>${months} Months, ${days} Days`;
  };

  document.getElementById("openAgeCalc")?.addEventListener("click", openAge);
  document.getElementById("closeAgeCalc")?.addEventListener("click", closeAge);
  document.getElementById("calcAgeBtn")?.addEventListener("click", calculateAge);
  modal?.addEventListener("click", event => { if (event.target === modal) closeAge(); });
 document.addEventListener("click", event => {
  if (event.target.closest(".age-inline-card, .age-text-link")) openAge(event);
});
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAge();
    if ((event.key === "Enter" || event.key === " ") && event.target.closest?.(".age-inline-card")) openAge(event);
  });
}

function initPageButtons() {
  document.getElementById("printPage")?.addEventListener("click", () => window.print());
  document.getElementById("savePdf")?.addEventListener("click", () => window.print());
  document.getElementById("backTop")?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

function loadPost() {
  if (!id || id === "demo3") {
    renderDetail(demoPost);
    return;
  }

  firebase.database().ref(`posts/${id}`).once("value")
    .then(snapshot => renderDetail(snapshot.val() || demoPost))
    .catch(() => renderDetail(demoPost));
}

initAgeCalculator();
initPageButtons();
loadPost();
