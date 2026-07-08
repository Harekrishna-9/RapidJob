/* Rapid Job Detail Page - Old Professional Format Restored + Loading Fix */
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
function normalizeType(t){
  t=String(t||"").toLowerCase().trim();
  const map={"latest job":"job","post management":"job","current job":"job","job":"job","new update":"new","new":"new","admit card":"admit","admit":"admit","results":"result","result":"result","answer key":"answer","answerkey":"answer","answer-key":"answer","answer_key":"answer","syllabus":"syllabus","admissions":"admission","admission":"admission","scholarships":"scholarship","scholarship":"scholarship","latest blog":"blog","latestblog":"blog","latest-blog":"blog","latest_blog":"blog","blog":"blog","study material":"study","study":"study","document":"document","documents":"document","doc":"document","government yojana":"yojana","sarkari yojna":"yojana","yojana":"yojana"};
  return map[t]||t;
}
function label(t){return {job:"Current Job",new:"New Update",admit:"Admit Card",result:"Result",answer:"Answer Key",syllabus:"Syllabus",admission:"Admission",scholarship:"Scholarship",blog:"Latest Blog",study:"Study Material",document:"Document",yojana:"Government Yojana"}[normalizeType(t)]||"Current Job";}
function field(p,keys,fallback=""){for(const k of keys){if(p && p[k]!==undefined && p[k]!==null && String(p[k]).trim()!=="") return p[k];} return fallback;}
function plain(v){return String(v ?? "").trim();}
function lines(v){return plain(v).split(/\n|\r|•|;/).map(x=>x.trim()).filter(Boolean);}
function nl2br(v){return esc(v).replace(/\n/g,"<br>");}
function todayText(){try{return new Date().toLocaleString("en-IN",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});}catch(e){return "";}}

function injectOldFormatStyles(){
  if(document.getElementById("rjOldFormatCss")) return;
  const s=document.createElement("style");
  s.id="rjOldFormatCss";
  s.textContent=`
    #detailBox.detail-box{background:#fff;border:1px solid #dbe5f2;border-radius:0;padding:16px;box-shadow:none;color:#06162f;}
    .rj-breadcrumb{font-size:12px;color:#0057b8;margin:0 0 14px 0}.rj-breadcrumb a{color:#0057b8;text-decoration:none}
    .rj-hero-card{position:relative;border:1px solid #d7e2f1;background:#fff;padding:18px 210px 18px 18px;margin-bottom:18px;min-height:126px;}
    .rj-hero-card h1{font-size:30px;line-height:1.18;margin:0 0 8px;font-weight:900;color:#06162f;letter-spacing:.2px;}
    .rj-updated{font-size:13px;font-weight:800;margin-bottom:12px;color:#0b1324}.rj-updated b{color:#000}
    .rj-short{font-size:16px;line-height:1.65;color:#051733}.rj-short b,.rj-short strong{color:#e11d48;font-weight:900}
    .rj-hero-icon{position:absolute;right:20px;top:20px;width:105px;height:105px;border-radius:50%;display:grid;place-items:center;background:#eef5ff;border:1px solid #d4e3fb;font-size:48px;}
    .rj-action-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0 20px;}
    .rj-action-row a{height:48px;border-radius:5px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:#fff;font-weight:900;font-size:17px;box-shadow:0 8px 18px rgba(15,23,42,.13)}
    .rj-action-row .all{background:#facc15;color:#050505}.rj-action-row .apply{background:#16b85f}.rj-action-row .official{background:#1167df}
    .rj-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 20px;}
    .rj-info-card{border:1px solid #d7e2f1;border-radius:9px;overflow:hidden;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.04)}
    .rj-info-card h2{margin:0;background:#eaf3ff;color:#005bd1;font-size:16px;font-weight:900;padding:11px 14px;border-bottom:1px solid #d7e2f1;}
    .rj-info-card .body{padding:14px 18px;font-size:15px;line-height:1.65;color:#07172f;min-height:94px}.rj-info-card ul{margin:0;padding-left:18px}.rj-info-card li{margin:7px 0}.rj-info-card b{font-weight:900}.red{color:#e11d48!important}.big-number{font-size:44px;font-weight:900;color:#e11d48;text-align:center;padding:32px 0!important;background:#fff7fb;}
    .rj-section-title{font-size:22px;font-weight:900;margin:20px 0 10px;color:#07172f;}
    .rj-table-wrap{border:1px solid #d7e2f1;border-radius:9px;overflow:hidden;margin-bottom:18px}.rj-table{width:100%;border-collapse:collapse;font-size:14px}.rj-table th{background:#1267d8;color:#fff;text-align:left;padding:12px}.rj-table td{padding:10px 12px;border-bottom:1px solid #e6eef8}.rj-table tr:last-child td{border-bottom:0}
    .rj-full-section{border:1px solid #d7e2f1;border-radius:9px;overflow:hidden;margin:14px 0 18px;background:#fff}.rj-full-section h2{margin:0;background:#eaf3ff;color:#005bd1;font-size:17px;padding:11px 14px}.rj-full-section .body{padding:14px 18px;font-size:15.5px;line-height:1.65}.rj-full-section ul{margin:0;padding-left:18px}.rj-full-section li{margin:7px 0}
    .rj-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;padding:14px}.rj-links a{min-height:46px;border-radius:8px;text-decoration:none;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px}.rj-links .apply{background:#16b85f}.rj-links .official{background:#1167df}.rj-links .notice{background:#ef4444}.rj-links .result{background:#7c3aed}.rj-links .admit{background:#f59e0b}.rj-links .answer{background:#0f766e}
    .rj-custom-notice{border:1px solid #fbbf24;background:#fffbeb;border-radius:10px;padding:14px 18px;line-height:1.65;color:#78350f;margin:14px 0 18px}.rj-custom-notice h2{margin:0 0 8px;color:#b45309;font-size:18px}.rj-custom-card{border:1px solid #d7e2f1;border-radius:10px;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.05);padding:14px 18px;margin:14px 0 18px;line-height:1.65}.rj-custom-card h2{margin:0 0 9px;color:#005bd1;font-size:18px}.rj-custom-card ul,.rj-custom-notice ul{margin:0;padding-left:18px}.rj-custom-card li,.rj-custom-notice li{margin:7px 0}
    .not-found-box{text-align:center;padding:46px 20px}.back-home{display:inline-block;background:#1167df;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:800;margin-top:12px}
    @media(max-width:800px){.rj-hero-card{padding:16px}.rj-hero-icon{position:static;margin:14px auto 0}.rj-hero-card h1{font-size:24px}.rj-action-row{grid-template-columns:1fr}.rj-info-grid{grid-template-columns:1fr}.rj-table{font-size:13px}}
  `;
  document.head.appendChild(s);
}

function listHtml(value, fallbackText){
  const arr=lines(value);
  if(!arr.length) return fallbackText?esc(fallbackText):"";
  if(arr.length===1) return nl2br(arr[0]);
  return `<ul>${arr.map(x=>`<li>${nl2br(x)}</li>`).join("")}</ul>`;
}
function dateListHtml(v){
  const arr=lines(v);
  if(!arr.length) return "<ul><li>Application Start Date : <b>Check details</b></li><li>Application Last Date : <b>Check details</b></li></ul>";
  return `<ul>${arr.map(x=>{
    let y=esc(x).replace(/(\d{2}[-/]\d{2}[-/]\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/g,'<b class="red">$1</b>');
    return `<li>${y}</li>`;
  }).join("")}</ul>`;
}
function feeHtml(v){return listHtml(v,"Check official notification.");}
function ageHtml(v){return listHtml(v,"Check official notification.") + `<div style="margin-top:8px"><a href="#" id="ageCalcInline">Age Calculator</a></div>`;}
function totalPostText(p){return field(p,["totalPost","totalPosts","totalVacancy","vacancies","vacancyCount"],"");}

function renderVacancy(p){
  const table = field(p,["vacancyTable","vacancyRows"],"");
  if(Array.isArray(table) && table.length){
    const cols=Object.keys(table[0]||{});
    return `<h2 class="rj-section-title">▣ Vacancy Details</h2><div class="rj-table-wrap"><table class="rj-table"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${table.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  const v=field(p,["vacancyDetails","vacancy","posts"],"");
  if(!plain(v)) return "";
  const rows=lines(v).map(x=>x.split(/\||,/).map(y=>y.trim()));
  if(rows.length>1 && rows.some(r=>r.length>=3)){
    return `<h2 class="rj-section-title">▣ Vacancy Details</h2><div class="rj-table-wrap"><table class="rj-table"><thead><tr><th>Post Name</th><th>Total Post</th><th>Eligibility</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td><td>${esc(r.slice(2).join(" | ")||"")}</td></tr>`).join("")}</tbody></table></div>`;
  }
  return fullSection("Vacancy Details", v, "▣");
}
function fullSection(title,value,icon){if(!plain(value)) return ""; return `<section class="rj-full-section"><h2>${icon||"▣"} ${esc(title)}</h2><div class="body">${listHtml(value)}</div></section>`;}

function collectLinks(p){
  const links=[]; const add=(title,url,cls,icon)=>{if(plain(url)) links.push({title,url:plain(url),cls,icon});};
  add("Apply Online",field(p,["applyLink","apply","onlineApply","applicationLink"]),"apply","➤");
  add("Official Website",field(p,["officialWebsite","officialLink","website"]),"official","🌐");
  add("Download Notification",field(p,["notificationLink","noticeLink","pdfLink","notification"]),"notice","📄");
  add("Result Link",field(p,["resultLink"]),"result","📊");
  add("Admit Card Link",field(p,["admitCardLink","admitLink"]),"admit","⬇");
  add("Answer Key Link",field(p,["answerKeyLink","answerLink"]),"answer","🔑");
  if(!links.length && Array.isArray(p.importantLinks)) p.importantLinks.forEach(l=>add(l.title||l.text||"Open Link",l.url||l.link,"apply","🔗"));
  return links;
}
function renderLinksSection(links){if(!links.length) return ""; return `<section class="rj-full-section"><h2>🔗 Important Links</h2><div class="rj-links">${links.map(l=>`<a class="${esc(l.cls)}" href="${esc(l.url)}" target="_blank" rel="noopener"><span>${esc(l.icon)}</span>${esc(l.title)}</a>`).join("")}</div></section>`;}

function renderCustomSections(p){
  const sections = Array.isArray(p.detailSections) ? [...p.detailSections] : [];
  if(!sections.length) return "";
  return sections.sort((a,b)=>(Number(a.order||50)-Number(b.order||50))).map(sec=>{
    const title = esc(sec.title || "Details");
    const content = plain(sec.content || "");
    const style = sec.style || "card";
    if(!title && !content) return "";
    if(style === "table"){
      const rows = content.split(/\n|\r/).map(x=>x.trim()).filter(Boolean).map(line=>line.split("|").map(c=>c.trim()));
      return `<h2 class="rj-section-title">▣ ${title}</h2><div class="rj-table-wrap"><table class="rj-table"><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${nl2br(c)}</td>`).join("")}</tr>`).join("") || '<tr><td>No data added.</td></tr>'}</tbody></table></div>`;
    }
    if(style === "links"){
      const rows = content.split(/\n|\r/).map(x=>x.trim()).filter(Boolean);
      return `<section class="rj-full-section"><h2>🔗 ${title}</h2><div class="rj-links">${rows.map(line=>{const parts=line.split("|").map(x=>x.trim()); const text=parts[1]||parts[0]||"Open Link"; const url=parts[2]||"#"; return `<a class="apply" href="${esc(url)}" ${url==="#"?"":"target='_blank' rel='noopener'"}>🔗 ${esc(text)}</a>`;}).join("")}</div></section>`;
    }
    if(style === "notice") return `<section class="rj-custom-notice"><h2>⚠ ${title}</h2>${listHtml(content)}</section>`;
    return `<section class="rj-custom-card"><h2>▣ ${title}</h2>${listHtml(content)}</section>`;
  }).join("");
}

function renderDetail(p){
  injectOldFormatStyles();
  const title=field(p,["title","postTitle","name"],"Rapid Job Update");
  const type=field(p,["type","category"],"Current Job");
  const state=field(p,["state","location"],"All India");
  const lastDate=field(p,["lastDate","date","endDate","closingDate"],"Check details");
  const details=field(p,["details","description","content","postDetails","summary"],"Please check official notification before applying.");
  const updated=field(p,["updatedAt","updatedOn","timeText","publishedAt"],todayText());
  const links=collectLinks(p);
  const applyLink=(links.find(l=>l.cls==="apply")||{}).url || "#";
  const officialLink=(links.find(l=>l.cls==="official")||{}).url || "#";
  const total=totalPostText(p);
  document.title=`${title} - Rapid Job`;

  detailBox.innerHTML=`
    <div class="rj-breadcrumb">🏠 <a href="index.html">Home</a> / <a href="index.html#current">${esc(label(type))}</a> / ${esc(title)}</div>
    <section class="rj-hero-card">
      <h1>${esc(title)}</h1>
      <div class="rj-updated">▣ Updated On : <b>${esc(updated)}</b></div>
      <div class="rj-short">${nl2br(details)}</div>
      <div class="rj-hero-icon">🧑‍💻</div>
    </section>
    <div class="rj-action-row">
      <a class="all" href="index.html#current">▣ View All Jobs</a>
      <a class="apply" href="${esc(applyLink)}" ${applyLink==="#"?"":"target='_blank' rel='noopener'"}>➤ Apply Online</a>
      <a class="official" href="${esc(officialLink)}" ${officialLink==="#"?"":"target='_blank' rel='noopener'"}>🌐 Official Website</a>
    </div>
    <div class="rj-info-grid">
      <div class="rj-info-card"><h2>▣ Important Dates</h2><div class="body">${dateListHtml(field(p,["importantDates","dates"]))}</div></div>
      <div class="rj-info-card"><h2>▣ Application Fee</h2><div class="body">${feeHtml(field(p,["applicationFee","fee","fees"]))}</div></div>
      <div class="rj-info-card"><h2>♟ Age Limit (As on ${esc(field(p,["ageAsOn"],"01.01.2026"))})</h2><div class="body">${ageHtml(field(p,["ageLimit","age"]))}</div></div>
      <div class="rj-info-card"><h2>▣ Total Post</h2><div class="body big-number">${esc(total || "—")}</div></div>
    </div>
    ${renderVacancy(p)}
    ${renderCustomSections(p)}
    ${fullSection("Eligibility",field(p,["eligibility","qualification","education"]),"✅")}
    ${fullSection("Exam Pattern",field(p,["examPattern","pattern"]),"📝")}
    ${fullSection("Selection Process",field(p,["selectionProcess","selection"]),"🏆")}
    ${fullSection("How to Apply",field(p,["howToApply","applyProcess"]),"🖊️")}
    ${renderLinksSection(links)}
  `;
  const inlineAge=$("ageCalcInline");
  if(inlineAge) inlineAge.onclick=(e)=>{e.preventDefault(); if($("openAgeCalc")) $("openAgeCalc").click();};
  setupShare(title);
}

function renderError(msg){
  injectOldFormatStyles();
  detailBox.innerHTML=`<div class="not-found-box"><h2>Post Not Found</h2><p>${esc(msg)}</p><a href="index.html" class="back-home">Go Back Home</a></div>`;
}
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
  if(!postId){renderError("Post ID missing in URL. Example: job-detail.html?id=POST_ID");return;}
  try{const post=await findPostById(postId); if(!post){renderError("This post is not available in Firebase database.");return;} renderDetail(post);}catch(err){console.error(err);renderError("Unable to load details. Please check Firebase connection and database path.");}
}
function setupShare(title){
  const url=window.location.href; const text=`${title} - Rapid Job`;
  if($("shareFb")) $("shareFb").href=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if($("shareTw")) $("shareTw").href=`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if($("shareWa")) $("shareWa").href=`https://api.whatsapp.com/send?text=${encodeURIComponent(text+" "+url)}`;
  if($("shareTg")) $("shareTg").href=`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if($("copyLink")) $("copyLink").onclick=e=>{e.preventDefault();navigator.clipboard.writeText(url).then(()=>alert("Link copied successfully!"));};
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
