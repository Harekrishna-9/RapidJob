/* Rapid Job Detail Page - FastJob Live Output + Firebase Loading Fix */
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
} catch (e) { console.warn("Firebase init error:", e); }

const $ = id => document.getElementById(id);
const detailBox = $("detailBox");
const params = new URLSearchParams(window.location.search);
const postId = params.get("id") || params.get("postId") || params.get("jobId");
const postCategory = params.get("category") || params.get("type") || "";

function esc(v){return String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
function plain(v){return String(v ?? "").trim();}
function nl2br(v){return esc(v).replace(/\n/g,"<br>");}
function lines(v){return plain(v).split(/\n|\r|•|;/).map(x=>x.trim()).filter(Boolean);}
function field(p, keys, fallback=""){for(const k of keys){if(p && p[k]!==undefined && p[k]!==null && plain(p[k])!=="") return p[k];} return fallback;}
function normalizeType(t){
  t=String(t||"").toLowerCase().trim();
  const map={"latest job":"job","post management":"job","current job":"job","job":"job","new update":"new","new":"new","admit card":"admit","admit":"admit","results":"result","result":"result","answer key":"answer","answerkey":"answer","answer-key":"answer","answer_key":"answer","syllabus":"syllabus","admissions":"admission","admission":"admission","scholarships":"scholarship","scholarship":"scholarship","latest blog":"blog","latestblog":"blog","latest-blog":"blog","latest_blog":"blog","blog":"blog","study material":"study","study":"study","document":"document","documents":"document","doc":"document","government yojana":"yojana","sarkari yojna":"yojana","yojana":"yojana"};
  return map[t]||t;
}
function label(t){return {job:"Current Job",new:"New Update",admit:"Admit Card",result:"Result",answer:"Answer Key",syllabus:"Syllabus",admission:"Admission",scholarship:"Scholarship",blog:"Latest Blog",study:"Study Material",document:"Document",yojana:"Government Yojana"}[normalizeType(t)]||"Current Job";}
function todayText(){try{return new Date().toLocaleString("en-IN",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});}catch(e){return "";}}

function injectFastJobStyles(){
  if(document.getElementById("fastJobLiveCss")) return;
  const s=document.createElement("style");
  s.id="fastJobLiveCss";
  s.textContent=`
    #detailBox.detail-box{background:#fff;border:0;border-radius:0;padding:16px 18px;box-shadow:none;color:#06162f;}
    .fj-top-card{border:1px solid #d7e6f8;border-radius:14px;background:#fff;padding:18px 20px;margin-bottom:18px;box-shadow:0 8px 22px rgba(15,23,42,.04)}
    .fj-tag{display:inline-flex;background:#dbeafe;color:#005df2;font-weight:900;border-radius:18px;padding:8px 14px;margin-bottom:12px;font-size:14px}.fj-title{font-size:30px;line-height:1.18;margin:0 0 12px;font-weight:900;color:#07172f}.fj-updated{display:inline-flex;gap:8px;align-items:center;background:#eef5ff;color:#005df2;border-radius:18px;padding:8px 12px;font-weight:900;font-size:14px}.fj-desc{font-size:16px;line-height:1.7;margin:16px 0;color:#07172f}.fj-desc b,.fj-desc strong{color:#e11d48;font-weight:900}
    .fj-buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:14px 0 16px}.fj-buttons a{height:48px;border-radius:9px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:#fff;font-weight:900;font-size:16px;box-shadow:0 8px 18px rgba(15,23,42,.12)}.fj-buttons .all{background:linear-gradient(135deg,#facc15,#f59e0b);color:#070707}.fj-buttons .apply{background:linear-gradient(135deg,#18c36d,#0ea45d)}.fj-buttons .official{background:linear-gradient(135deg,#1d7af0,#0757dd)}
    .fj-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 18px}.fj-card{border:1px solid #d7e6f8;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.04)}.fj-card h2{margin:0;background:#fff;color:#0061e8;font-size:18px;font-weight:900;padding:13px 15px}.fj-card .body{padding:0 18px 16px;font-size:15px;line-height:1.45;min-height:92px}.fj-card ul{margin:0;padding-left:18px}.fj-card li{margin:5px 0}.fj-total{font-size:44px!important;color:#e11d48!important;font-weight:900;text-align:center;display:block;padding-top:24px}.fj-section-title{font-size:24px;margin:18px 0 12px;font-weight:900;color:#07172f}
    .fj-table-wrap{border:1px solid #d7e6f8;border-radius:10px;overflow:hidden;margin:0 0 18px;background:#fff}.fj-table{width:100%;border-collapse:collapse;font-size:14px}.fj-table th{background:#1471e8;color:#fff;padding:11px;text-align:left;font-weight:900}.fj-table td{padding:10px 12px;border-bottom:1px solid #e7eef8}.fj-table tr:last-child td{border-bottom:0}.fj-yellow-table td{background:#ffe76a!important;border:2px solid #fff;text-align:center;font-weight:900}.fj-yellow-table td a{color:#0066ff;text-decoration:none;font-weight:900}.fj-yellow-table td:first-child{color:#050505}.fj-mini-table th{font-size:12px}.fj-mini-table td{font-size:13px}
    .fj-full-card{border:1px solid #d7e6f8;border-radius:10px;background:#fff;margin:0 0 18px;padding:16px 18px;box-shadow:0 6px 18px rgba(15,23,42,.04);font-size:15px;line-height:1.55}.fj-full-card h2{margin:0 0 12px;color:#0061e8;font-size:18px;font-weight:900}.fj-full-card ul{margin:0;padding-left:18px}.fj-full-card li{margin:5px 0}.fj-notice{border-color:#fbbf24;background:#fffbeb;color:#78350f}.fj-notice h2{color:#b45309}.fj-alert{border-color:#fecaca;background:#fff1f2;color:#7f1d1d}.fj-alert h2{color:#dc2626}.fj-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}.fj-links a{min-height:45px;border-radius:8px;background:#16b85f;color:#fff;text-decoration:none;font-weight:900;display:flex;align-items:center;justify-content:center}.not-found-box{text-align:center;padding:46px 20px}.back-home{display:inline-block;background:#1167df;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:800;margin-top:12px}
    @media(max-width:800px){#detailBox.detail-box{padding:12px}.fj-title{font-size:24px}.fj-buttons,.fj-grid{grid-template-columns:1fr}.fj-table{font-size:12px}.fj-table-wrap{overflow-x:auto}.fj-table{min-width:620px}}
  `;
  document.head.appendChild(s);
}

function listHtml(value, fallback=""){
  const arr=lines(value);
  if(!arr.length) return fallback ? esc(fallback) : "";
  if(arr.length===1) return nl2br(arr[0]);
  return `<ul>${arr.map(x=>`<li>${nl2br(x)}</li>`).join("")}</ul>`;
}
function rowsFromText(text){return plain(text).split(/\n|\r/).map(x=>x.trim()).filter(Boolean).map(line=>line.split("|").map(c=>c.trim()));}
function tableHtml(title, headers, rows, cls=""){
  if(!rows || !rows.length) return "";
  return `<h2 class="fj-section-title">${esc(title)}</h2><div class="fj-table-wrap"><table class="fj-table ${cls}">${headers && headers.length ? `<thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead>` : ""}<tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${nl2br(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function card(title, body){return `<div class="fj-card"><h2>${esc(title)}</h2><div class="body">${body}</div></div>`;}
function fullCard(title, body, extra=""){if(!plain(body)) return ""; return `<section class="fj-full-card ${extra}"><h2>${esc(title)}</h2>${listHtml(body)}</section>`;}

function standardDates(p){
  const custom=field(p,["importantDates","dates"],"");
  if(plain(custom)) return listHtml(custom);
  const rows=[];
  if(plain(p.startDate)) rows.push(`Application Start Date : <b>${esc(p.startDate)}</b>`);
  if(plain(p.lastDate)) rows.push(`Application Last Date : <b>${esc(p.lastDate)}</b>`);
  if(plain(p.feeDate)) rows.push(`Fee Payment Last Date : <b>${esc(p.feeDate)}</b>`);
  if(plain(p.examDate)) rows.push(`Exam Date : <b>${esc(p.examDate)}</b>`);
  return rows.length ? `<ul>${rows.map(x=>`<li>${x}</li>`).join("")}</ul>` : `<ul><li>Check official notification.</li></ul>`;
}
function standardAge(p){
  const custom=field(p,["ageLimit","age"],"");
  if(plain(custom)) return listHtml(custom)+`<div style="margin-top:8px"><a href="#" id="ageCalcInline">Age Calculator</a></div>`;
  const rows=[];
  if(plain(p.ageAsOn)) rows.push(`Age As On : <b>${esc(p.ageAsOn)}</b>`);
  if(plain(p.minAge)) rows.push(`Minimum Age : <b>${esc(p.minAge)}</b>`);
  if(plain(p.maxAge)) rows.push(`Maximum Age : <b>${esc(p.maxAge)}</b>`);
  return (rows.length ? `<ul>${rows.map(x=>`<li>${x}</li>`).join("")}</ul>` : `<ul><li>Check official notification.</li></ul>`)+`<div style="margin-top:8px"><a href="#" id="ageCalcInline">Age Calculator</a></div>`;
}
function vacancyRows(p){
  if(Array.isArray(p.vacancyRows) && p.vacancyRows.length) return p.vacancyRows.map(r=>[r[0]||"",r[1]||"",r[2]||"",r[3]||""]);
  const v=field(p,["vacancyDetails","vacancy","posts"],"");
  return rowsFromText(v);
}
function examRows(p){
  if(Array.isArray(p.examRows) && p.examRows.length) return p.examRows.map(r=>[r[0]||"",r[1]||"",r[2]||"",r[3]||""]);
  return rowsFromText(field(p,["examPattern","pattern"],""));
}
function importantLinkRows(p){
  if(Array.isArray(p.importantLinkRows) && p.importantLinkRows.length) return p.importantLinkRows.map(r=>[r[0]||"",r[1]||"Click Here",r[2]||"#"]);
  return [];
}
function yellowLinkTable(rows){
  if(!rows.length) return "";
  return `<h2 class="fj-section-title">Important Links</h2><div class="fj-table-wrap"><table class="fj-table fj-yellow-table"><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"Link")}</td><td><a href="${esc(r[2]||"#")}" ${(r[2]&&r[2]!=="#")?"target='_blank' rel='noopener'":""}>${esc(r[1]||"Click Here")}</a></td></tr>`).join("")}</tbody></table></div>`;
}
function collectTopLinks(p){
  const arr=[];
  const add=(title,url)=>{if(plain(url)) arr.push({title,url:plain(url)});};
  add("Apply Online", field(p,["applyLink","apply","onlineApply","applicationLink"]));
  add("Official Website", field(p,["officialLink","officialWebsite","website"]));
  add("Download Notification", field(p,["pdfLink","notificationLink","noticeLink","notification"]));
  if(!arr.length) importantLinkRows(p).forEach(r=>{if(String(r[0]).toLowerCase().includes("apply")) add("Apply Online",r[2]); if(String(r[0]).toLowerCase().includes("official")) add("Official Website",r[2]);});
  return arr;
}
function customSectionsHtml(p){
  const sections = Array.isArray(p.detailSections) ? [...p.detailSections] : (Array.isArray(p.customBlocks) ? [...p.customBlocks] : []);
  if(!sections.length) return "";
  return sections.sort((a,b)=>Number(a.order||50)-Number(b.order||50)).map(sec=>{
    const title=sec.title||"Details", style=sec.style||"card", content=plain(sec.content||"");
    if(!content && !title) return "";
    if(style==="table"){
      const rows=rowsFromText(content); const header=rows.length?rows.shift():[];
      return tableHtml(title, header, rows);
    }
    if(style==="linkTable" || style==="yellowLinks") return yellowLinkTable(rowsFromText(content));
    if(style==="links" || style==="buttons" || style==="button"){
      const rows=rowsFromText(content);
      return `<section class="fj-full-card"><h2>🔗 ${esc(title)}</h2><div class="fj-links">${rows.map(r=>`<a href="${esc(r[2]||"#")}" ${(r[2]&&r[2]!=="#")?"target='_blank' rel='noopener'":""}>${esc(r[1]||r[0]||"Open Link")}</a>`).join("")}</div></section>`;
    }
    if(style==="twoCard" || style==="twoCards" || style==="two-column"){
      const parts=content.split("---");
      const make=(txt,fallback)=>{const a=String(txt||"").split(/\n|\r/).map(x=>x.trim()).filter(Boolean); const h=a.shift()||fallback; return card(h, a.length?`<ul>${a.map(x=>`<li>${nl2br(x)}</li>`).join("")}</ul>`:"");};
      return `<div class="fj-grid">${make(parts[0],title)}${make(parts[1],"Details")}</div>`;
    }
    if(style==="notice") return fullCard(title, content, "fj-notice");
    if(style==="alert") return fullCard(title, content, "fj-alert");
    if(style==="faq") return `<section class="fj-full-card"><h2>${esc(title)}</h2>${content.split(/\n|\r/).filter(Boolean).map(x=>{const [q,a]=x.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check details")}</p>`}).join("")}</section>`;
    return fullCard(title, content);
  }).join("");
}
function faqHtml(p){
  const faq=plain(p.faq||"");
  if(!faq) return "";
  return `<div class="fj-card"><h2>FAQ</h2><div class="body">${faq.split(/\n|\r/).filter(Boolean).map(line=>{const [q,a]=line.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check notification")}</p>`;}).join("")}</div></div>`;
}

function renderDetail(p){
  injectFastJobStyles();
  const title=field(p,["title","postTitle","name"],"Rapid Job Update");
  const type=field(p,["type","category"],"job");
  const updated=field(p,["updatedOn","updatedAt","timeText","publishedAt"],todayText());
  const desc=field(p,["description","details","content","postDetails","summary"],"Please check official notification before applying.");
  const topLinks=collectTopLinks(p);
  const apply=(topLinks.find(x=>x.title==="Apply Online")||{}).url || field(p,["applyLink"],"#");
  const official=(topLinks.find(x=>x.title==="Official Website")||{}).url || field(p,["officialLink"],"#");
  const total=field(p,["totalPost","totalPosts","totalVacancy","vacancies","vacancyCount"],"");
  document.title=`${title} - Rapid Job`;

  const vacancy=vacancyRows(p);
  const exam=examRows(p);
  const yellow=importantLinkRows(p);
  const hasStandard = plain(p.startDate)||plain(p.lastDate)||plain(p.importantDates)||plain(p.dates)||plain(p.fee)||plain(p.applicationFee)||plain(p.minAge)||plain(p.ageLimit)||plain(p.totalPost)||plain(p.totalPosts)||plain(p.vacancyDetails)||plain(p.vacancy)||vacancy.length||yellow.length||exam.length||plain(p.examPattern)||plain(p.pattern)||plain(p.selectionProcess)||plain(p.howToApply)||plain(p.salary)||plain(p.faq);

  detailBox.innerHTML=`
    <section class="fj-top-card">
      <span class="fj-tag">${esc(label(type))}</span>
      <h1 class="fj-title">${esc(title)}</h1>
      <div class="fj-updated">◷ Updated On : ${esc(updated)}</div>
    </section>
    <div class="fj-desc">${nl2br(desc)}</div>
    <div class="fj-buttons">
      <a class="all" href="index.html#current">View All Jobs</a>
      <a class="apply" href="${esc(apply||"#")}" ${(apply&&apply!=="#")?"target='_blank' rel='noopener'":""}>Apply Online</a>
      <a class="official" href="${esc(official||"#")}" ${(official&&official!=="#")?"target='_blank' rel='noopener'":""}>Official Website</a>
    </div>
    ${hasStandard?`
      <div class="fj-grid">
        ${card("Important Dates", standardDates(p))}
        ${card("Application Fee", listHtml(field(p,["fee","applicationFee","fees"],""),"Check official notification."))}
        ${card("Age Limit", standardAge(p))}
        ${card("Total Post", `<span class="fj-total">${esc(total||"—")}</span>`)}
      </div>
      ${tableHtml("Vacancy Details",["Post Name","Pay Level","Total Post","Eligibility"],vacancy)}
      ${yellowLinkTable(yellow)}
      <div class="fj-grid">
        ${plain(p.selectionProcess)?card("Selection Process", listHtml(p.selectionProcess)):""}
        ${exam.length?`<div class="fj-card"><h2>Exam Pattern (CBT)</h2><div class="body">${tableHtml("",["Subject","Questions","Marks","Duration"],exam,"fj-mini-table").replace('<h2 class="fj-section-title"></h2>','')}</div></div>`:""}
        ${plain(p.howToApply)?card("How To Apply", listHtml(p.howToApply)):""}
        ${plain(p.salary)?card("Salary / Pay Scale", nl2br(p.salary)):""}
        ${faqHtml(p)}
      </div>`:""}
    ${customSectionsHtml(p)}
  `;
  const inlineAge=$("ageCalcInline");
  if(inlineAge) inlineAge.onclick=e=>{e.preventDefault(); if($("openAgeCalc")) $("openAgeCalc").click();};
  setupShare(title);
}
function renderError(msg){injectFastJobStyles(); detailBox.innerHTML=`<div class="not-found-box"><h2>Post Not Found</h2><p>${esc(msg)}</p><a href="index.html" class="back-home">Go Back Home</a></div>`;}
async function findPostById(id){
  if(!db) throw new Error("Firebase database not connected.");
  if(postCategory){const s=await db.ref(`posts/${postCategory}/${id}`).once("value"); if(s.exists()) return {id,...s.val()};}
  const d=await db.ref(`posts/${id}`).once("value"); if(d.exists()) return {id,...d.val()};
  const all=await db.ref("posts").once("value"); const data=all.val()||{};
  if(data[id] && typeof data[id]==="object") return {id,...data[id]};
  for(const [cat,group] of Object.entries(data)){if(group && typeof group==="object" && group[id]) return {id,category:cat,...group[id]};}
  return null;
}
async function loadPost(){
  if(!postId){renderError("Post ID missing in URL. Example: job-detail.html?id=POST_ID"); return;}
  try{const post=await findPostById(postId); if(!post){renderError("This post is not available in Firebase database."); return;} renderDetail(post);}catch(err){console.error(err); renderError("Unable to load details. Please check Firebase connection and database path.");}
}
function setupShare(title){
  const url=window.location.href; const text=`${title} - Rapid Job`;
  if($("shareFb")) $("shareFb").href=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if($("shareTw")) $("shareTw").href=`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if($("shareWa")) $("shareWa").href=`https://api.whatsapp.com/send?text=${encodeURIComponent(text+" "+url)}`;
  if($("shareTg")) $("shareTg").href=`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if($("copyLink")) $("copyLink").onclick=e=>{e.preventDefault(); navigator.clipboard.writeText(url).then(()=>alert("Link copied successfully!"));};
}
if($("printPage")) $("printPage").onclick=()=>window.print();
if($("savePdf")) $("savePdf").onclick=()=>window.print();
if($("backTop")) $("backTop").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
window.addEventListener("scroll",()=>{if($("backTop")) $("backTop").style.display=window.scrollY>250?"grid":"none";});
if($("openAgeCalc")) $("openAgeCalc").onclick=e=>{e.preventDefault();if($("ageModal")){ $("ageModal").classList.add("show"); $("ageModal").setAttribute("aria-hidden","false"); }};
if($("closeAgeCalc")) $("closeAgeCalc").onclick=()=>{if($("ageModal")){ $("ageModal").classList.remove("show"); $("ageModal").setAttribute("aria-hidden","true"); }};
if($("ageModal")) $("ageModal").onclick=e=>{if(e.target===$("ageModal") && $("closeAgeCalc")) $("closeAgeCalc").click();};
if($("calcAgeBtn")) $("calcAgeBtn").onclick=()=>{const dob=$("dobInput")?.value;if(!dob){if($("ageResult")) $("ageResult").innerHTML="Please select date of birth.";return;}const birth=new Date(dob),today=new Date();let y=today.getFullYear()-birth.getFullYear(),m=today.getMonth()-birth.getMonth(),d=today.getDate()-birth.getDate();if(d<0){m--;d+=new Date(today.getFullYear(),today.getMonth(),0).getDate();}if(m<0){y--;m+=12;}if($("ageResult")) $("ageResult").innerHTML=`<b>Your Age:</b> ${y} Years ${m} Months ${d} Days`;};
loadPost();
