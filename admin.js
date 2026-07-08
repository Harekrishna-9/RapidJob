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
const $ = q => document.querySelector(q);

let posts = [];
let messages = [];
let current = "dashboard";
let editId = null;

const categories = [
  ["job", "Current Job"],
  ["admit", "Admit Card"],
  ["result", "Result"],
  ["answer", "Answer Key"],
  ["admission", "Admission"],
  ["scholarship", "Scholarship"],
  ["syllabus", "Syllabus"],
  ["blog", "Latest Blog"],
  ["study", "Study Material"],
  ["yojana", "Government Yojana"],
  ["state", "State Job"],
  ["important", "Important Link"],
  ["document", "Document"],
  ["new", "New Update"]
];

const demo = {
  title: "RRB Ministerial & Isolated Categories Online Form 2026",
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
  examRows: [["General Intelligence & Reasoning", "50", "50", "90 Minutes"], ["General Awareness", "40", "40", ""], ["General Science", "40", "40", ""], ["Mathematics", "40", "40", ""]],
  importantLinkRows: [["Download Admit Card", "Link Active On 07.07.2026", "#"], ["Download Center List", "Click Here To Download Center List", "#"], ["Apply Online", "Click Here To Apply", "#"], ["Applicant Login", "Click Here To Login", "#"], ["Download Notification", "Click Here For Notification", "#"], ["Official Website", "Click Here To Open Official Website", "#"], ["Join Telegram Channel", "Click Here To Join Telegram", "#"], ["Join WhatsApp Channel", "Click Here To Join WhatsApp", "#"]],
  fee: "SC / ST / Female / ESM / Minorities / EBC: Rs.250/-\nAll Other Candidates: Rs.500/-\nPayment can be made through Debit Card, Credit Card, Internet Banking or UPI.",
  selectionProcess: "Computer Based Test (CBT)\nSkill Test / Typing Test (Post Wise)\nDocument Verification\nMedical Examination",
  howToApply: "Visit the official website of RRB.\nClick on the Apply Online link.\nFill the application form carefully.\nUpload required documents and pay the fee.\nSubmit and take a printout for future reference.",
  salary: "Pay Level-2 to Pay Level-7\nAs per 7th CPC Pay Matrix and other allowances as applicable.",
  faq: "What is the last date to apply? | 29-01-2026\nWhat is the application fee? | Rs.250/- for reserved and Rs.500/- for others.\nWhat is the total number of vacancies? | 312 Posts"
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function br(value) {
  return esc(value).replaceAll("\n", "<br>");
}


function injectDesignerAdminStyle() {
  if (document.getElementById("designerAdminStyle")) return;
  const style = document.createElement("style");
  style.id = "designerAdminStyle";
  style.textContent = `
    .designer-builder{display:grid;gap:14px;margin:12px 0 18px}
    .design-row{display:grid;grid-template-columns:1.1fr .85fr 1.8fr 90px auto;gap:10px;align-items:start;background:linear-gradient(135deg,#f8fbff,#fff);border:1px solid #d8e7fb;border-radius:16px;padding:12px;box-shadow:0 8px 22px rgba(15,23,42,.05)}
    .design-row:before{content:"CMS Block";grid-column:1/-1;font-size:12px;font-weight:950;color:#0b72ff;text-transform:uppercase;letter-spacing:.4px}
    .design-row input,.design-row select,.design-row textarea{width:100%;border:1px solid #cfe0f5;border-radius:12px;padding:12px;font:inherit;background:#fff;outline:none}
    .design-row textarea{min-height:82px;resize:vertical;line-height:1.5}
    .design-row input:focus,.design-row select:focus,.design-row textarea:focus{border-color:#0b72ff;box-shadow:0 0 0 4px rgba(11,114,255,.10)}
    .designer-note{background:linear-gradient(135deg,#fff7ed,#fff);border:1px solid #fed7aa;color:#9a3412;padding:13px 15px;border-radius:15px;margin:12px 0;font-size:13px;line-height:1.55}
    @media(max-width:900px){.design-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}
function catName(value) {
  return (categories.find(c => c[0] === value) || ["", value || "Current Job"])[1];
}

function ensureModal() {
  if (document.getElementById("adminModal")) return;
  const modal = document.createElement("div");
  modal.id = "adminModal";
  modal.className = "admin-modal";
  modal.innerHTML = `
    <div class="admin-modal-box">
      <button class="admin-modal-close" type="button" onclick="closeAdminModal()">×</button>
      <div id="adminModalContent"></div>
    </div>`;
  document.body.appendChild(modal);
}

function openAdminModal(html, size = "normal") {
  ensureModal();
  const modal = document.getElementById("adminModal");
  const box = modal.querySelector(".admin-modal-box");
  box.classList.toggle("wide", size === "wide");
  document.getElementById("adminModalContent").innerHTML = html;
  modal.classList.add("show");
}

function closeAdminModal() {
  const modal = document.getElementById("adminModal");
  if (modal) modal.classList.remove("show");
}

function alertPopup(message, type = "success") {
  const icon = type === "error" ? "fa-circle-xmark" : type === "warning" ? "fa-triangle-exclamation" : "fa-circle-check";
  const title = type === "error" ? "Error" : type === "warning" ? "Warning" : "Success";
  openAdminModal(`
    <div class="popup-alert ${type}">
      <i class="fa-solid ${icon}"></i>
      <h2>${title}</h2>
      <p>${esc(message)}</p>
      <button class="btn" onclick="closeAdminModal()">OK</button>
    </div>`);
}

function confirmPopup(message, onYes) {
  openAdminModal(`
    <div class="popup-alert warning">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h2>Confirm Action</h2>
      <p>${esc(message)}</p>
      <div class="modal-actions">
        <button class="btn red" id="confirmYes">Yes, Delete</button>
        <button class="btn light" onclick="closeAdminModal()">Cancel</button>
      </div>
    </div>`);
  document.getElementById("confirmYes").onclick = async () => {
    closeAdminModal();
    await onYes();
  };
}

function toast(message, type = "success") {
  alertPopup(message, type);
}

function page(title, sub, body) {
  return `<div class="hero"><span class="tag">Rapid Job Admin</span><h1>${title}</h1><p>${sub}</p></div>${body}`;
}

function dashboard() {
  const pub = posts.filter(p => p.status === "Published").length;
  const draft = posts.filter(p => p.status === "Draft").length;
  return page("Dashboard", "Rapid Job ka complete control center.", `
    <div class="stats">
      <div class="stat"><p>Total Posts</p><h2>${posts.length}</h2></div>
      <div class="stat"><p>Published</p><h2>${pub}</h2></div>
      <div class="stat"><p>Draft</p><h2>${draft}</h2></div>
      <div class="stat"><p>Messages</p><h2>${messages.length}</h2></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2>Recent Posts</h2><button class="btn" onclick="openPostForm()">+ Add Post</button></div>
      ${postTable(posts.slice(0, 8))}
    </div>`);
}

function postTable(list) {
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>${list.map(p => `
    <tr>
      <td>${esc(p.title || "")}</td>
      <td>${esc(catName(p.type))}</td>
      <td><span class="badge ${p.status === "Draft" ? "draft" : ""}">${esc(p.status || "Published")}</span></td>
      <td>${esc(p.date || p.updatedOn || "")}</td>
      <td>
        <button class="mini view" onclick="previewSavedPost('${p.id}')">Preview</button>
        <button class="mini edit" onclick="openPostForm('${p.id}')">Edit</button>
        <button class="mini del" onclick="deletePost('${p.id}')">Delete</button>
      </td>
    </tr>`).join("") || '<tr><td colspan="5">No posts found.</td></tr>'}</tbody></table></div>`;
}

function postsPage() {
  return page("Post Management", "Job-detail page ke same format me post add/edit karein.", `
    <div class="panel">
      <div class="panel-head"><h2>All Posts</h2><button class="btn" onclick="openPostForm()">+ Add New Post</button></div>
      ${postTable(posts)}
    </div>`);
}

function input(id, label, value = "", type = "text") {
  return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" value="${esc(value)}" /></div>`;
}

function textarea(id, label, value = "") {
  return `<div class="field full"><label>${label}</label><textarea id="${id}">${esc(value)}</textarea></div>`;
}

function openPostForm(id = null) {
  editId = id;
  const p = id ? posts.find(x => x.id === id) || demo : demo;
  $("#app").innerHTML = page(id ? "Edit Post" : "Add New Post", "Publish karne se pehle Draft Preview center popup me dekh sakte ho.", `
    <div class="panel">
      <div class="grid2">
        <div class="field"><label>Category / Section</label><select id="type">${categories.map(c => `<option value="${c[0]}" ${(p.type || p.category) === c[0] ? "selected" : ""}>${c[1]}</option>`).join("")}</select><small class="hint">Jo category select karoge, post website ke usi section me jayega.</small></div>
        <div class="field"><label>Status</label><select id="status"><option>Published</option><option>Draft</option><option>Pending</option></select></div>
        <div class="field"><label>State</label><select id="state"><option>All India</option><option>Bihar</option><option>Jharkhand</option><option>UP</option><option>Delhi</option><option>Rajasthan</option><option>MP</option><option>HP</option><option>Haryana</option><option>Odisha</option><option>West Bengal</option><option>Telangana</option></select></div>
        <div class="field"><label>Show Options</label><select id="featured"><option value="false">Normal Post</option><option value="true">Featured / Trending</option></select></div>
        ${input("title", "Post Title", p.title)}
        ${input("updatedOn", "Updated On", p.updatedOn)}
        ${textarea("description", "Description", p.description)}
        ${input("startDate", "Application Start Date", p.startDate)}
        ${input("lastDate", "Application Last Date", p.lastDate)}
        ${input("feeDate", "Fee Payment Last Date", p.feeDate)}
        ${input("examDate", "Exam Date", p.examDate)}
        ${input("ageAsOn", "Age As On", p.ageAsOn)}
        ${input("minAge", "Minimum Age", p.minAge)}
        ${input("maxAge", "Maximum Age", p.maxAge)}
        ${input("totalPost", "Total Post", p.totalPost)}
        ${textarea("fee", "Application Fee", p.fee)}
        ${textarea("selectionProcess", "Selection Process", p.selectionProcess)}
        ${textarea("howToApply", "How To Apply", p.howToApply)}
        ${textarea("salary", "Salary / Pay Scale", p.salary)}
        ${textarea("faq", "FAQ  (Question | Answer)", p.faq)}
        ${input("applyLink", "Apply Link", p.applyLink || "")}
        ${input("pdfLink", "Notification PDF Link", p.pdfLink || "")}
        ${input("officialLink", "Official Website Link", p.officialLink || "")}
      </div>
      <h2>Vacancy Table</h2>
      <div class="vacancy-builder" id="vacancyRows"></div>
      <button class="btn light" onclick="addVacancyRow()">+ Add Vacancy Row</button>

      <h2 class="builder-title">Exam Pattern (CBT)</h2>
      <p class="builder-hint">Subject, Questions, Marks aur Duration add karo. Ye website par table ke form me show hoga.</p>
      <div class="exam-builder" id="examRows"></div>
      <button class="btn light" onclick="addExamRow()">+ Add Exam Row</button>

      <h2 class="builder-title">Important Links Table</h2>
      <p class="builder-hint">FastJobSearchers jaisi yellow link table ke liye row add karo. Ye job-detail page me show hogi.</p>
      <div class="link-builder" id="importantLinkRows"></div>
      <button class="btn light" onclick="addImportantLinkRow()">+ Add Link Row</button>

      <h2 class="builder-title">Custom Job Details Designer</h2>
      <div class="designer-note"><b>Use this when you want your own job details design.</b><br>Section Title, style, content aur order set karo. Content me table banana ho to line format use karo: <b>Column 1 | Column 2 | Column 3</b></div>
      <div class="template-actions">
        <button class="btn" onclick="addFastJobTemplate()"><i class="fa-solid fa-wand-magic-sparkles"></i> Add FastJob Template</button>
        <button class="btn light" onclick="addDetailSection({style:'twoCard', title:'Important Dates + Application Fee', content:'Important Dates\nApplication Start Date : 30-12-2025\nApplication Last Date : 29-01-2026\n---\nApplication Fee\nSC/ST/Female : Rs.250/-\nGeneral/OBC : Rs.500/-'})">+ Two Card</button>
        <button class="btn light" onclick="addDetailSection({style:'table', title:'Vacancy Details', content:'Post Name | Total Post | Eligibility\nJunior Assistant | 120 | 12th Pass'})">+ Table</button>
        <button class="btn light" onclick="addDetailSection({style:'links', title:'Important Links', content:'Apply Online | Click Here | #\nOfficial Website | Click Here | #'})">+ Links</button>
        <button class="btn light" onclick="addDetailSection({style:'notice', title:'Latest Update', content:'Online form started. Apply before last date.'})">+ Notice</button>
      </div>
      <div class="designer-builder" id="detailSections"></div>
      <button class="btn light" onclick="addDetailSection()">+ Add Custom Section</button>

      <div class="actions sticky-actions">
        <button class="btn preview" onclick="previewDraft()"><i class="fa-solid fa-eye"></i> Draft Preview</button>
        <button class="btn light" onclick="saveDraft()"><i class="fa-solid fa-file-lines"></i> Save Draft</button>
        <button class="btn green" onclick="savePost('Published')"><i class="fa-solid fa-paper-plane"></i> Publish Post</button>
        <button class="btn light" onclick="render('posts')">Cancel</button>
      </div>
    </div>`);
  $("#status").value = p.status || "Published";
  if ($("#state")) $("#state").value = p.state || "All India";
  if ($("#featured")) $("#featured").value = String(!!p.featured || !!p.trending);
  (p.vacancyRows || [["Chief Law Assistant", "Level-6", "54", "Degree in Law with 3 Years Practice"], ["Junior Translator (Hindi)", "Level-6", "130", "Master Degree with Hindi & English"]]).forEach(r => addVacancyRow(r));
  (p.examRows || demo.examRows || [["General Intelligence & Reasoning", "50", "50", "90 Minutes"], ["General Awareness", "40", "40", ""], ["General Science", "40", "40", ""], ["Mathematics", "40", "40", ""]]).forEach(r => addExamRow(r));
  (p.importantLinkRows || demo.importantLinkRows || []).forEach(r => addImportantLinkRow(r));
  injectDesignerAdminStyle();
  (p.detailSections || []).forEach(r => addDetailSection(r));
}

function addVacancyRow(r = ["", "", "", ""]) {
  const d = document.createElement("div");
  d.className = "vac-row";
  d.innerHTML = `<input placeholder="Post Name" value="${esc(r[0])}"><input placeholder="Pay Level" value="${esc(r[1])}"><input placeholder="Total" value="${esc(r[2])}"><input placeholder="Eligibility" value="${esc(r[3])}"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;
  $("#vacancyRows").appendChild(d);
}

function addExamRow(r = ["", "", "", ""]) {
  const d = document.createElement("div");
  d.className = "exam-row";
  d.innerHTML = `<input placeholder="Subject" value="${esc(r[0])}"><input placeholder="Questions" value="${esc(r[1])}"><input placeholder="Marks" value="${esc(r[2])}"><input placeholder="Duration" value="${esc(r[3])}"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;
  $("#examRows").appendChild(d);
}

function addImportantLinkRow(r = ["", "", ""]) {
  const d = document.createElement("div");
  d.className = "link-row";
  d.innerHTML = `<input placeholder="Left Title: Download Admit Card" value="${esc(r[0])}"><input placeholder="Right Text: Click Here To Apply" value="${esc(r[1])}"><input placeholder="URL / Link" value="${esc(r[2])}"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;
  $("#importantLinkRows").appendChild(d);
}

function addDetailSection(r = {}) {
  injectDesignerAdminStyle();
  const d = document.createElement("div");
  d.className = "design-row";
  const title = Array.isArray(r) ? (r[0] || "") : (r.title || "");
  const style = Array.isArray(r) ? (r[1] || "card") : (r.style || "card");
  const content = Array.isArray(r) ? (r[2] || "") : (r.content || "");
  const order = Array.isArray(r) ? (r[3] || "50") : (r.order || "50");
  d.innerHTML = `
    <input class="ds-title" placeholder="Section Title: Important Dates" value="${esc(title)}">
    <select class="ds-style">
      <option value="card" ${style === "card" ? "selected" : ""}>Card Box</option>
      <option value="twoCard" ${style === "twoCard" ? "selected" : ""}>Two Column Cards</option>
      <option value="table" ${style === "table" ? "selected" : ""}>Table</option>
      <option value="linkTable" ${style === "linkTable" ? "selected" : ""}>Yellow Link Table</option>
      <option value="notice" ${style === "notice" ? "selected" : ""}>Notice Box</option>
      <option value="alert" ${style === "alert" ? "selected" : ""}>Red Alert Box</option>
      <option value="links" ${style === "links" ? "selected" : ""}>Link Buttons</option>
      <option value="faq" ${style === "faq" ? "selected" : ""}>FAQ</option>
    </select>
    <textarea class="ds-content" placeholder="Content. Table/Links format: Title | Text | URL">${esc(content)}</textarea>
    <input class="ds-order" type="number" placeholder="Order" value="${esc(order)}">
    <button class="mini del" onclick="this.parentElement.remove()">X</button>`;
  $("#detailSections").appendChild(d);
}

function addFastJobTemplate() {
  const box = document.getElementById("detailSections");
  if (box) box.innerHTML = "";
  const template = [
    {title:"Important Dates + Application Fee", style:"twoCard", order:10, content:"Important Dates\nApplication Start Date : 30-12-2025\nApplication Last Date : 29-01-2026\nFee Payment Last Date : 31-01-2026\nExam Date : 14 & 15 July 2026\n---\nApplication Fee\nSC / ST / Female / ESM : Rs.250/-\nAll Other Candidates : Rs.500/-\nPayment Mode : Debit Card, Credit Card, Net Banking or UPI"},
    {title:"Age Limit + Total Post", style:"twoCard", order:20, content:"Age Limit (As on 01.01.2026)\nMinimum Age : 18 Years\nMaximum Age : See Below Post Wise\nAge Relaxation : As per Rules\n---\nTotal Post\n312"},
    {title:"Vacancy Details", style:"table", order:30, content:"Post Name | Pay Level | Total Post | Eligibility\nChief Law Assistant | Level-6 | 54 | Degree in Law with 3 Years Practice\nJunior Translator (Hindi) | Level-6 | 130 | Master Degree with Hindi & English"},
    {title:"Selection Process", style:"card", order:40, content:"Computer Based Test (CBT)\nSkill Test / Typing Test\nDocument Verification\nMedical Examination"},
    {title:"Exam Pattern (CBT)", style:"table", order:50, content:"Subject | Questions | Marks | Duration\nGeneral Intelligence & Reasoning | 50 | 50 | 90 Minutes\nGeneral Awareness | 40 | 40 | \nMathematics | 40 | 40 |"},
    {title:"Important Links", style:"linkTable", order:60, content:"Apply Online | Click Here To Apply | #\nDownload Notification | Click Here For Notification | #\nOfficial Website | Click Here To Open Official Website | #\nJoin Telegram Channel | Click Here To Join Telegram | #"},
    {title:"How To Apply", style:"card", order:70, content:"Visit the official website.\nClick on Apply Online link.\nFill the application form carefully.\nUpload documents and pay the fee.\nSubmit and take a printout."},
    {title:"Important Notice", style:"notice", order:80, content:"Before applying, candidates must read the official notification carefully."}
  ];
  template.forEach(sec => addDetailSection(sec));
  alertPopup("FastJob style template added. Ab text apne hisab se edit kar sakte ho.");
}

function collectPostData(statusOverride = null) {
  const get = id => $("#" + id)?.value.trim() || "";
  const vacancyRows = [...document.querySelectorAll(".vac-row")]
    .map(row => [...row.querySelectorAll("input")].map(i => i.value.trim()))
    .filter(r => r.some(Boolean));
  const examRows = [...document.querySelectorAll(".exam-row")]
    .map(row => [...row.querySelectorAll("input")].map(i => i.value.trim()))
    .filter(r => r.some(Boolean));
  const importantLinkRows = [...document.querySelectorAll(".link-row")]
    .map(row => [...row.querySelectorAll("input")].map(i => i.value.trim()))
    .filter(r => r.some(Boolean));
  const detailSections = [...document.querySelectorAll(".design-row")]
    .map(row => ({
      title: row.querySelector(".ds-title")?.value.trim() || "",
      style: row.querySelector(".ds-style")?.value || "card",
      content: row.querySelector(".ds-content")?.value.trim() || "",
      order: Number(row.querySelector(".ds-order")?.value || 50)
    }))
    .filter(r => r.title || r.content);
  const selectedType = get("type");
  const id = editId || ("post_" + Date.now());
  return {
    id,
    type: selectedType,
    category: selectedType,
    section: selectedType,
    categoryName: catName(selectedType),
    status: statusOverride || get("status") || "Published",
    state: get("state") || "All India",
    featured: get("featured") === "true",
    trending: get("featured") === "true",
    title: get("title"),
    updatedOn: get("updatedOn"),
    description: get("description"),
    startDate: get("startDate"),
    lastDate: get("lastDate"),
    feeDate: get("feeDate"),
    examDate: get("examDate"),
    ageAsOn: get("ageAsOn"),
    minAge: get("minAge"),
    maxAge: get("maxAge"),
    totalPost: get("totalPost"),
    fee: get("fee"),
    selectionProcess: get("selectionProcess"),
    howToApply: get("howToApply"),
    salary: get("salary"),
    faq: get("faq"),
    applyLink: get("applyLink"),
    pdfLink: get("pdfLink"),
    officialLink: get("officialLink"),
    vacancyRows,
    examRows,
    importantLinkRows,
    detailSections,
    time: Date.now(),
    date: new Date().toISOString().slice(0, 10)
  };
}

function previewHtml(data) {
  const list = value => br(value).split("<br>").filter(Boolean).map(x => `<li>${x}</li>`).join("");
  const faq = String(data.faq || "").split("\n").filter(Boolean).map(line => {
    const [q, a] = line.split("|");
    return `<p><b>Q.</b> ${br(q || "")}<br><b>Ans:</b> ${br(a || "Check notification")}</p>`;
  }).join("");
  const rows = (data.vacancyRows || []).map(r => `<tr><td>${br(r[0])}</td><td>${br(r[1])}</td><td>${br(r[2])}</td><td>${br(r[3])}</td></tr>`).join("");
  const examRows = (data.examRows || []).map(r => `<tr><td>${br(r[0])}</td><td>${br(r[1])}</td><td>${br(r[2])}</td><td>${br(r[3])}</td></tr>`).join("");
  const linkRows = (data.importantLinkRows || []).map(r => `<tr><td>${br(r[0])}</td><td><a href="${esc(r[2] || '#')}" target="_blank">${br(r[1])}</a></td></tr>`).join("");
  const customSections = (data.detailSections || []).sort((a,b)=>(a.order||50)-(b.order||50)).map(sec => {
    const title = `<h2>${br(sec.title || "Custom Section")}</h2>`;
    const contentLines = String(sec.content || "").split("\n").filter(Boolean);
    if (sec.style === "table") {
      const rows = contentLines.map(line => `<tr>${line.split("|").map(c => `<td>${br(c.trim())}</td>`).join("")}</tr>`).join("");
      return `${title}<table class="preview-table"><tbody>${rows || "<tr><td>No table data.</td></tr>"}</tbody></table>`;
    }
    if (sec.style === "links") {
      return `${title}<div class="preview-btns">${contentLines.map(line => { const p=line.split("|"); return `<a href="${esc((p[2]||'#').trim())}" target="_blank">${br((p[1]||p[0]||'Open Link').trim())}</a>`; }).join("")}</div>`;
    }
    if (sec.style === "linkTable") {
      return `${title}<table class="preview-table link-preview-table"><tbody>${contentLines.map(line => { const p=line.split("|"); return `<tr><td>${br((p[0]||'Link').trim())}</td><td><a href="${esc((p[2]||'#').trim())}" target="_blank">${br((p[1]||'Click Here').trim())}</a></td></tr>`; }).join("")}</tbody></table>`;
    }
    if (sec.style === "twoCard") {
      const parts = String(sec.content || "").split("---");
      return `<div class="preview-grid"><div><h3>${br((parts[0]||sec.title).split("\n")[0]||"Details")}</h3><p>${br((parts[0]||"").split("\n").slice(1).join("\n"))}</p></div><div><h3>${br((parts[1]||"").split("\n")[0]||"Details")}</h3><p>${br((parts[1]||"").split("\n").slice(1).join("\n"))}</p></div></div>`;
    }
    if (sec.style === "alert") return `<div class="preview-grid"><div style="border-color:#fecaca;background:#fff1f2"><h3>${br(sec.title || "Alert")}</h3><p>${br(sec.content || "")}</p></div></div>`;
    return `<div class="preview-grid"><div><h3>${br(sec.title || "Custom Section")}</h3><p>${br(sec.content || "")}</p></div></div>`;
  }).join("");
  return `
    <div class="preview-post">
      <div class="preview-head">
        <span>${esc(data.categoryName || catName(data.type))}</span>
        <h1>${br(data.title || "Post Title")}</h1>
        <p><i class="fa-regular fa-clock"></i> Updated On : ${br(data.updatedOn || "")}</p>
      </div>
      <p class="preview-desc">${br(data.description || "")}</p>
      <div class="preview-btns">
        <a>View All Jobs</a><a>Apply Online</a><a>Official Website</a>
      </div>
      <div class="preview-grid">
        <div><h3>Important Dates</h3><ul><li>Application Start Date : <b>${br(data.startDate)}</b></li><li>Application Last Date : <b>${br(data.lastDate)}</b></li><li>Fee Payment Last Date : <b>${br(data.feeDate)}</b></li><li>Exam Date : <b>${br(data.examDate)}</b></li></ul></div>
        <div><h3>Application Fee</h3><ul>${list(data.fee)}</ul></div>
        <div><h3>Age Limit</h3><ul><li>Age As On : <b>${br(data.ageAsOn)}</b></li><li>Minimum Age : <b>${br(data.minAge)}</b></li><li>Maximum Age : <b>${br(data.maxAge)}</b></li></ul></div>
        <div><h3>Total Post</h3><strong class="preview-total">${br(data.totalPost || "--")}</strong></div>
      </div>
      <h2>Vacancy Details</h2>
      <table class="preview-table"><thead><tr><th>Post Name</th><th>Pay Level</th><th>Total Post</th><th>Eligibility</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No vacancy row added.</td></tr>'}</tbody></table>
      <h2>Important Links</h2>
      <table class="preview-table link-preview-table"><tbody>${linkRows || '<tr><td colspan="2">No important link row added.</td></tr>'}</tbody></table>
      ${customSections}
      <div class="preview-grid">
        <div><h3>Selection Process</h3><ul>${list(data.selectionProcess)}</ul></div>
        <div><h3>Exam Pattern (CBT)</h3><table class="preview-table compact"><thead><tr><th>Subject</th><th>Questions</th><th>Marks</th><th>Duration</th></tr></thead><tbody>${examRows || '<tr><td colspan="4">No exam pattern row added.</td></tr>'}</tbody></table></div>
        <div><h3>How To Apply</h3><ul>${list(data.howToApply)}</ul></div>
        <div><h3>Salary / Pay Scale</h3><p>${br(data.salary)}</p></div>
        <div><h3>FAQ</h3>${faq || "<p>No FAQ added.</p>"}</div>
      </div>
    </div>`;
}

function previewDraft() {
  const data = collectPostData();
  if (!data.title) return alertPopup("Title required before preview.", "warning");
  openAdminModal(`
    <div class="modal-title-row">
      <div><span class="tag dark-tag">Draft Preview</span><h2>Post Preview Before Publish</h2></div>
      <button class="btn green" onclick="closeAdminModal();savePost('Published')">Publish Now</button>
    </div>
    ${previewHtml(data)}`, "wide");
}

function previewSavedPost(id) {
  const data = posts.find(p => p.id === id);
  if (!data) return alertPopup("Post not found.", "error");
  openAdminModal(`<div class="modal-title-row"><div><span class="tag dark-tag">Saved Preview</span><h2>${esc(data.title || "Post Preview")}</h2></div><button class="btn" onclick="window.open('job-detail.html?id=${id}','_blank')">Open Page</button></div>${previewHtml(data)}`, "wide");
}

async function saveDraft() {
  await savePost("Draft");
}

async function savePost(statusOverride = null) {
  const data = collectPostData(statusOverride);
  if (!data.title) return alertPopup("Title required.", "warning");
  try {
    await db.ref("posts/" + data.id).set(data);
    alertPopup(data.status === "Draft" ? "Draft saved successfully." : "Post published successfully.");
    render("posts");
  } catch (error) {
    console.error(error);
    alertPopup("Firebase save error. Please try again.", "error");
  }
}

async function deletePost(id) {
  confirmPopup("Delete this post?", async () => {
    await db.ref("posts/" + id).remove();
    alertPopup("Post deleted successfully.");
  });
}

function messagesPage() {
  return page("Contact Messages", "Contact page se aaye hue messages yahan dikhenge.", `<div class="panel"><div class="panel-head"><h2>Messages</h2><button class="btn light" onclick="loadMessages()">Refresh</button></div>${messages.map(m => `<div class="message-card"><b>${esc(m.name || "No Name")} | ${esc(m.emailMobile || "")}</b><span>${esc(m.subject || "")}</span><p>${esc(m.message || "")}</p><small>${esc(m.createdAt || "")}</small><button class="mini del" onclick="deleteMessage('${m.id}')">Delete</button></div>`).join("") || '<div class="empty">No messages yet.</div>'}</div>`);
}

async function deleteMessage(id) {
  confirmPopup("Delete this contact message?", async () => {
    await db.ref("contactMessages/" + id).remove();
    alertPopup("Message deleted successfully.");
  });
}

function breaking() {
  return page("Breaking News", "Ticker update manage karein.", `<div class="panel"><div class="field"><label>Breaking News Text</label><textarea id="breakingText" placeholder="Enter breaking news..."></textarea></div><button class="btn" onclick="saveBreakingNews()">Save</button></div>`);
}

async function saveBreakingNews() {
  await db.ref("settings/breakingNews").set($("#breakingText").value);
  alertPopup("Breaking news saved successfully.");
}

function media() {
  return page("Media Manager", "Image/PDF link save karne ke liye simple section.", `<div class="panel"><div class="grid2">${input("mediaTitle", "Media Title")}${input("mediaUrl", "Media URL")}</div><button class="btn" onclick="alertPopup('Media placeholder saved successfully.')">Save Media</button></div>`);
}

function settings() {
  return page("Settings", "Website name, email, phone settings.", `<div class="panel"><div class="grid2">${input("siteName", "Website Name", "Rapid Job")}${input("email", "Email", "rapidjob@gmail.com")}${input("phone", "Phone", "1800259630")}</div><button class="btn" onclick="alertPopup('Settings saved successfully.')">Save Settings</button></div>`);
}

function render(pageName = current) {
  current = pageName;
  document.querySelectorAll("#sideNav button").forEach(b => b.classList.toggle("active", b.dataset.page === pageName));
  const map = { dashboard, posts: postsPage, messages: messagesPage, breaking, media, settings };
  $("#app").innerHTML = (map[pageName] || dashboard)();
  if (innerWidth < 1000) $("#sidebar").classList.remove("show");
}

function loadPosts() {
  db.ref("posts").on("value", snapshot => {
    posts = Object.entries(snapshot.val() || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => (b.time || 0) - (a.time || 0));
    render(current);
  });
}

function loadMessages() {
  db.ref("contactMessages").on("value", snapshot => {
    messages = Object.entries(snapshot.val() || {}).map(([id, m]) => ({ id, ...m })).reverse();
    $("#msgBadge").textContent = messages.length;
    render(current);
  });
}

document.addEventListener("click", event => {
  if (event.target.id === "adminModal") closeAdminModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeAdminModal();
});

$("#sideNav").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (button) render(button.dataset.page);
});
$("#quickPost").onclick = () => openPostForm();
$("#menuBtn").onclick = () => $("#sidebar").classList.toggle("show");
$("#themeBtn").onclick = () => document.documentElement.classList.toggle("dark");
$("#searchInput").addEventListener("input", event => {
  const query = event.target.value.toLowerCase();
  if (current !== "posts") return;
  const filtered = posts.filter(p => (p.title || "").toLowerCase().includes(query));
  $("#app").innerHTML = page("Search Results", "Filtered posts.", `<div class="panel">${postTable(filtered)}</div>`);
});

loadPosts();
loadMessages();
render();
