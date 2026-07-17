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
    .fj-tag{display:inline-flex;background:#dbeafe;color:#005df2;font-weight:900;border-radius:18px;padding:8px 14px;margin-bottom:12px;font-size:14px}.fj-title{font-size:30px;line-height:1.18;margin:0 0 12px;font-weight:900;color:#07172f}.fj-updated{display:inline-flex;gap:8px;align-items:center;background:#eef5ff;color:#005df2;border-radius:18px;padding:8px 12px;font-weight:900;font-size:14px}.fj-desc{
      font-size:17px;
      line-height:1.8;
      margin:18px 0;
      color:#07172f;
      font-weight:800;
      padding:18px 20px;
      border:1px solid #b9dcff;
      border-left:6px solid #075ee8;
      border-radius:16px;
      background:linear-gradient(135deg,#f2f8ff,#ffffff);
      box-shadow:0 12px 28px rgba(7,94,232,.10);
    }
    .fj-desc b,.fj-desc strong{color:#e11d48;font-weight:950}
    .fj-buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:14px 0 16px}.fj-buttons a{height:48px;border-radius:9px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:#fff;font-weight:900;font-size:16px;box-shadow:0 8px 18px rgba(15,23,42,.12)}.fj-buttons .all{background:linear-gradient(135deg,#facc15,#f59e0b);color:#070707}.fj-buttons .apply{background:linear-gradient(135deg,#18c36d,#0ea45d)}.fj-buttons .official{background:linear-gradient(135deg,#1d7af0,#0757dd)}
    .fj-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 18px}.fj-card{border:1px solid #d7e6f8;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.04)}.fj-card h2{margin:0;background:#fff;color:#0061e8;font-size:18px;font-weight:900;padding:13px 15px}.fj-card .body{padding:0 18px 16px;font-size:15px;line-height:1.45;min-height:92px}.fj-card ul{margin:0;padding-left:18px}.fj-card li{margin:5px 0}.fj-total{
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      width:100%!important;
      min-height:105px!important;
      padding:0!important;
      margin:0!important;
      font-size:76px!important;
      line-height:1!important;
      font-weight:950!important;
      color:#e11d48!important;
      letter-spacing:2px!important;
      text-align:center!important;
      background:radial-gradient(circle,#ffffff 0%,#fff1f4 100%);
      text-shadow:0 5px 16px rgba(225,29,72,.24);
      animation:fjTotalPulse 2s ease-in-out infinite;
    }
    @keyframes fjTotalPulse{
      0%,100%{transform:scale(1)}
      50%{transform:scale(1.06)}
    }.fj-section-title{font-size:24px;margin:18px 0 12px;font-weight:900;color:#07172f}
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
    if(style==="twoHeadingTable"){
      const rows=rowsFromText(content); const header=rows.length?rows.shift():["Left Heading","Right Heading"];
      return `<h2 class="fj-section-title">${esc(title)}</h2><div class="fj-table-wrap"><table class="fj-table fj-two-heading"><thead><tr><th>${esc(header[0]||"")}</th><th>${esc(header[1]||"")}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${nl2br(r[0]||"")}</td><td>${nl2br(r[1]||"")}</td></tr>`).join("")}</tbody></table></div>`;
    }
    if(style==="yellowHighlight") return `<section class="fj-yellow-highlight"><h2>${esc(title)}</h2><div>${nl2br(content)}</div></section>`;
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


function blogImportantLinksFrontend(links=[]){
  const live=(Array.isArray(links)?links:[]).filter(x=>x&&x.enabled!==false&&plain(x.title));
  if(!live.length)return"";
  return `<section class="rj-blog-important-links">
    <h2><i class="fa-solid fa-arrow-up-right-from-square"></i> Important Links</h2>
    <div class="rj-blog-link-list">
      ${live.sort((a,b)=>(Number(a.order||999)-Number(b.order||999))).map(x=>`
        <a class="rj-blog-link color-${esc(x.color||"blue")}" href="${esc(x.url||"#")}" ${x.newTab!==false?"target='_blank' rel='noopener'":""}>
          <i class="fa-solid ${esc(x.icon||"fa-link")}"></i>
          <span>${esc(x.title)}</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>`).join("")}
    </div>
  </section>`;
}

function blogLinkTablesFrontend(tables=[]){
  const live=(Array.isArray(tables)?tables:[]).filter(t=>Array.isArray(t?.rows)&&t.rows.length);
  if(!live.length)return"";
  return live.sort((a,b)=>Number(a.order||999)-Number(b.order||999)).map(table=>{
    const columns=Math.max(2,Number(table.columns||2));
    return `<section class="rj-link-matrix">
      <h2><i class="fa-solid fa-link"></i> ${esc(table.title||"Important Links")}</h2>
      <div class="rj-link-matrix-scroll">
        <table><tbody>
          ${table.rows.map(row=>`<tr>${Array.from({length:columns},(_,i)=>{
            const cell=row?.[i]||{};
            const text=esc(cell.text||"");
            const url=plain(cell.url||"");
            return `<td>${url?`<a href="${esc(url)}" target="_blank" rel="noopener">${text||"Click Here"}</a>`:text}</td>`;
          }).join("")}</tr>`).join("")}
        </tbody></table>
      </div>
    </section>`;
  }).join("");
}

function renderPublishedBlog(p){
  injectFastJobStyles();
  const b=p.blog||{};
  const title=field(p,["title","postTitle","name"],"Latest Blog");
  const updated=field(p,["updatedOn","updatedAt","publishedAt"],todayText());
  const links=b.importantLinks||p.importantLinks||[];
  document.title=`${title} - Rapid Job`;
  detailBox.innerHTML=`
    <article class="rj-blog-article">
      <header class="rj-blog-head">
        <span class="fj-tag">Latest Blog</span>
        <h1>${esc(title)}</h1>
        <p><i class="fa-regular fa-clock"></i> Updated On: ${esc(updated)} ${b.author?` • <i class="fa-solid fa-user-pen"></i> ${esc(b.author)}`:""}</p>
      </header>
      ${b.image?`<img class="rj-blog-cover" src="${esc(b.image)}" alt="${esc(title)}">`:""}
      <div class="rj-blog-content">
        ${plain(p.description)?`<p class="rj-blog-intro">${nl2br(p.description)}</p>`:""}
        ${plain(b.highlight)?`<div class="rj-blog-highlight">${nl2br(b.highlight)}</div>`:""}
        ${plain(b.summary)?blogSummaryFrontend(b.summary):""}
        ${(b.blocks||[]).map(renderPublishedBlogBlock).join("")}
        ${blogLinkTablesFrontend(b.linkTables||[])}
        ${blogImportantLinksFrontend(links)}
      </div>
    </article>`;
  setupShare(title);
}
function blogSummaryFrontend(txt){
  const rows=plain(txt).split(/\n|\r/).filter(Boolean).map(x=>x.split("|").map(y=>y.trim()));
  if(!rows.length)return"";
  return `<table class="rj-blog-summary"><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td></tr>`).join("")}</tbody></table>`;
}
function renderPublishedBlogBlock(b){
  const title=esc(b.title||"");
  if(b.style==="yellowHighlight")return `<section class="rj-blog-highlight"><b>${title}</b><br>${nl2br(b.content||"")}</section>`;
  if(b.style==="twoHeadingTable"){const rows=rowsFromText(b.content||"");const head=rows.shift()||["Left Heading","Right Heading"];return `<h2>${title}</h2><div class="fj-table-wrap"><table class="fj-table fj-two-heading"><thead><tr><th>${esc(head[0]||"")}</th><th>${esc(head[1]||"")}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${nl2br(r[0]||"")}</td><td>${nl2br(r[1]||"")}</td></tr>`).join("")}</tbody></table></div>`;}
  if(b.style==="green")return `<h2 class="rj-blog-green">${title}</h2><p>${nl2br(b.content||"")}</p>`;
  if(b.style==="image")return `<h2>${title}</h2><img class="rj-blog-cover inner" src="${esc(b.content||"")}" alt="">`;
  if(b.style==="table")return `<h2>${title}</h2>${blogSummaryFrontend(b.content||"")}`;
  if(b.style==="button"){
    const rows=plain(b.content).split(/\n|\r/).filter(Boolean);
    return `<div class="rj-blog-actions">${rows.map(x=>{const [t,u]=x.split("|").map(y=>y.trim());return `<a href="${esc(u||"#")}" target="_blank" rel="noopener">${esc(t||"Open")}</a>`}).join("")}</div>`;
  }
  if(b.style==="faq")return `<section class="rj-blog-faq"><h2>${title}</h2>${plain(b.content).split(/\n|\r/).filter(Boolean).map(x=>{const [q,a]=x.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check details")}</p>`}).join("")}</section>`;
  if(b.style==="html")return `<div>${b.content||""}</div>`;
  return `<h2>${title}</h2><p>${nl2br(b.content||"")}</p>`;
}

function renderDetail(p){
  if(normalizeType(field(p,["type","category"],"job"))==="blog"){renderPublishedBlog(p);return;}
  injectFastJobStyles();
  const title=field(p,["title","postTitle","name"],"Rapid Job Update");
  const type=field(p,["type","category"],"job");
  const updated=field(p,["updatedOn","updatedAt","timeText","publishedAt"],todayText());
  const desc=field(p,["description","details","content","postDetails","summary"],"Please check official notification before applying.");
  const topLinks=collectTopLinks(p);
  const apply=(topLinks.find(x=>x.title==="Apply Online")||{}).url || field(p,["applyLink"],"#");
  const official=(topLinks.find(x=>x.title==="Official Website")||{}).url || field(p,["officialLink"],"#");
  const totalRaw=field(p,["totalPost","totalPosts","totalVacancy","vacancies","vacancyCount"],"");
  const total=plain(totalRaw).replace(/^[\s•●▪◦·*\-–—:]+/,"").trim();
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
        ${card("Total Post", `<div class="fj-total" style="
display:flex!important;
align-items:center!important;
justify-content:center!important;
width:100%!important;
min-height:115px!important;
padding:0!important;
margin:0!important;
font-size:78px!important;
line-height:1!important;
font-weight:950!important;
color:#e11d48!important;
letter-spacing:2px!important;
text-align:center!important;
background:radial-gradient(circle,#ffffff 0%,#fff0f4 100%)!important;
text-shadow:0 5px 16px rgba(225,29,72,.25)!important;
">${esc(total||"—")}</div>`)}
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
async function loadPost() {

    if (!postId) {
        renderError("Post ID missing in URL.");
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

        console.error("Job Detail Error :", err);

        renderError(
            "Unable to load details. Please check Firebase connection."
        );

    }

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
const dobInput = $("dobInput");
if (dobInput) dobInput.max = new Date().toISOString().split("T")[0];

if ($("calcAgeBtn")) {
  $("calcAgeBtn").onclick = () => {
    const dob = $("dobInput")?.value;

    if (!dob) {
      $("ageResult").style.display = "block";
      $("ageResult").innerHTML = "Please select date of birth.";
      return;
    }

    const birth = new Date(dob);
    const today = new Date();

    if (birth > today) {
      $("ageResult").style.display = "block";
      $("ageResult").innerHTML = "Future date allowed nahi hai.";
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

    $("ageResult").style.display = "block";
    $("ageResult").innerHTML = `
      <strong>${years} Years ${months} Months ${days} Days</strong>
      <span>Your exact age calculated successfully.</span>
    `;
  };
}
// Start page
loadPost();


// ===== Job detail header live date and time =====
(function(){
  function updateJobDetailClock(){
    const now = new Date();
    const dateEl = document.getElementById("detailLiveDate");
    const timeEl = document.getElementById("detailLiveTime");

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

  updateJobDetailClock();
  setInterval(updateJobDetailClock,1000);
})();


/* =========================================================
   RAPID JOB LIVE ADVERTISEMENT + POPUP INTEGRATION
   Reads: contentManager/advertisements and contentManager/popups
   ========================================================= */
(function(){
  "use strict";
  const RJ_PAGE_TYPE = document.getElementById("detailBox") ? "detail" : "home";
  const RJ_ADS_PATH = "contentManager/advertisements";
  const RJ_POPUPS_PATH = "contentManager/popups";
  const adState = {items:[], rendered:new Set()};

  function rjNow(){ return Date.now(); }
  function rjText(v){ return String(v == null ? "" : v); }
  function rjSafe(v){
    return rjText(v).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  }
  function rjIsMobile(){ return window.matchMedia("(max-width: 760px)").matches; }
  function rjDateValue(v){
    if(!v) return null;
    const t = new Date(v).getTime();
    return Number.isFinite(t) ? t : null;
  }
  function rjIsLive(x){
    if(x.enabled === false) return false;
    const now=rjNow(), start=rjDateValue(x.startAt), end=rjDateValue(x.endAt);
    if(start && now < start) return false;
    if(end && now > end) return false;
    if(rjIsMobile() && x.mobile === false) return false;
    if(!rjIsMobile() && x.desktop === false) return false;
    return true;
  }
  function rjNormPosition(v){
    return rjText(v).trim().toLowerCase().replace(/\s+/g," ");
  }
  function rjPositionMatches(item, wanted){
    const p=rjNormPosition(item.position);
    const aliases={
      "header":["header"],
      "homepage top":["homepage top","home top"],
      "homepage middle":["homepage middle","home middle"],
      "sidebar":["sidebar"],
      "post top":["post top"],
      "post middle":["post middle"],
      "post bottom":["post bottom"],
      "footer":["footer"],
      "mobile bottom":["mobile bottom","mobile sticky","bottom sticky"]
    };
    return (aliases[wanted]||[wanted]).includes(p);
  }
  function rjCounter(id,kind){
    if(!window.db || !id) return;
    try{
      window.db.ref(`contentManager/advertisements/${id}/${kind}`).transaction(n=>(Number(n)||0)+1);
    }catch(e){}
  }
  function rjExecuteScripts(container){
    container.querySelectorAll("script").forEach(old=>{
      const s=document.createElement("script");
      [...old.attributes].forEach(a=>s.setAttribute(a.name,a.value));
      s.text=old.textContent;
      old.replaceWith(s);
    });
  }
  function rjAdElement(item,slotName){
    const wrap=document.createElement("div");
    wrap.className="rj-live-ad";
    wrap.dataset.adId=item.id||"";
    wrap.innerHTML=`<span class="rj-sponsored">SPONSORED</span>`;
    const close=document.createElement("button");
    close.type="button"; close.className="rj-ad-close"; close.innerHTML="×";
    close.setAttribute("aria-label","Close advertisement");
    close.onclick=()=>wrap.remove();
    wrap.appendChild(close);

    const type=rjText(item.type).toLowerCase();
    if(type.includes("google") && item.code){
      const code=document.createElement("div");
      code.className="rj-ad-code";
      code.innerHTML=item.code;
      wrap.appendChild(code);
      requestAnimationFrame(()=>rjExecuteScripts(code));
    }else{
      const link=document.createElement(item.link ? "a" : "div");
      link.className="rj-live-ad-link";
      if(item.link){
        link.href=item.link; link.target="_blank"; link.rel="noopener sponsored";
        link.addEventListener("click",()=>rjCounter(item.id,"clicks"));
      }
      if(item.image){
        const img=document.createElement("img");
        img.src=item.image; img.alt=item.title||"Advertisement";
        img.loading="lazy";
        img.onerror=()=>{
          img.remove();
          link.insertAdjacentHTML("beforeend",`<div class="rj-ad-fallback"><i class="fa-solid fa-rectangle-ad"></i><span>${rjSafe(item.title||"Advertisement")}</span></div>`);
        };
        link.appendChild(img);
      }else{
        link.innerHTML=`<div class="rj-ad-fallback"><i class="fa-solid fa-rectangle-ad"></i><span>${rjSafe(item.title||"Advertisement")}</span></div>`;
      }
      wrap.appendChild(link);
    }
    rjCounter(item.id,"views");
    return wrap;
  }
  function rjCreateSlot(name,className=""){
    let slot=document.querySelector(`[data-rj-ad-slot="${name}"]`);
    if(slot) return slot;
    slot=document.createElement("div");
    slot.className=`rj-ad-slot ${className}`.trim();
    slot.dataset.rjAdSlot=name;
    return slot;
  }
  function rjBestAd(wanted){
    return adState.items
      .filter(x=>rjIsLive(x)&&rjPositionMatches(x,wanted))
      .sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)))[0];
  }
  function rjFillSlot(slot,wanted){
    if(!slot || slot.dataset.rjFilled==="1") return;
    const item=rjBestAd(wanted);
    if(!item) return;
    slot.innerHTML="";
    slot.appendChild(rjAdElement(item,wanted));
    slot.dataset.rjFilled="1";
  }
  function rjPlaceHomeSlots(){
    const page=document.querySelector(".page-wrap");
    const nav=document.querySelector(".top-nav");
    const main=document.querySelector(".main-box");
    const hero=document.querySelector(".hero-section");
    const footer=document.querySelector(".main-footer");
    if(nav && main){
      const header=rjCreateSlot("header","rj-ad-slot--header");
      if(!header.isConnected) nav.insertAdjacentElement("afterend",header);
      rjFillSlot(header,"header");
    }
    if(main){
      const top=rjCreateSlot("homepage-top","rj-ad-slot--home-top");
      if(!top.isConnected) (hero||main.firstElementChild)?.insertAdjacentElement("beforebegin",top);
      rjFillSlot(top,"homepage top");

      const middle=rjCreateSlot("homepage-middle","rj-ad-slot--home-middle");
      const tools=document.querySelector(".home-tools-section")||document.querySelector(".category-section");
      if(!middle.isConnected && tools) tools.insertAdjacentElement("beforebegin",middle);
      rjFillSlot(middle,"homepage middle");
    }
    if(footer){
      const foot=rjCreateSlot("footer","rj-ad-slot--footer");
      if(!foot.isConnected) footer.insertAdjacentElement("beforebegin",foot);
      rjFillSlot(foot,"footer");
    }
    const sidebarAd=rjBestAd("sidebar");
    if(sidebarAd && !document.querySelector('[data-rj-ad-slot="home-sidebar"]')){
      const side=rjCreateSlot("home-sidebar","rj-ad-slot--sidebar");
      side.style.maxWidth="330px";
      side.style.margin="22px auto";
      const target=document.querySelector(".discover")||document.querySelector(".category-section");
      if(target) target.insertAdjacentElement("beforebegin",side);
      rjFillSlot(side,"sidebar");
    }
    if(rjIsMobile()){
      const sticky=rjCreateSlot("mobile-bottom","rj-ad-sticky-mobile");
      if(!sticky.isConnected) document.body.appendChild(sticky);
      rjFillSlot(sticky,"mobile bottom");
    }
  }
  function rjPlaceDetailSlots(){
    const nav=document.querySelector(".rj-nav");
    const wrap=document.querySelector(".rj-wrap");
    const detail=document.getElementById("detailBox");
    const side=document.querySelector(".side");
    const footer=document.querySelector(".rj-footer");
    if(nav && wrap){
      const header=rjCreateSlot("header","rj-ad-slot--header");
      if(!header.isConnected) nav.insertAdjacentElement("afterend",header);
      rjFillSlot(header,"header");
    }
    if(side){
      const sideSlot=rjCreateSlot("sidebar","rj-ad-slot--sidebar");
      if(!sideSlot.isConnected) side.prepend(sideSlot);
      rjFillSlot(sideSlot,"sidebar");
    }
    if(footer){
      const foot=rjCreateSlot("footer","rj-ad-slot--footer");
      if(!foot.isConnected) footer.insertAdjacentElement("beforebegin",foot);
      rjFillSlot(foot,"footer");
    }
    if(detail && !detail.querySelector(".loading-box")){
      const top=rjCreateSlot("post-top","rj-ad-slot--post-top");
      if(!top.isConnected) detail.prepend(top);
      rjFillSlot(top,"post top");

      const bottom=rjCreateSlot("post-bottom","rj-ad-slot--post-bottom");
      if(!bottom.isConnected) detail.append(bottom);
      rjFillSlot(bottom,"post bottom");

      const middle=rjCreateSlot("post-middle","rj-ad-slot--post-middle");
      if(!middle.isConnected){
        const children=[...detail.children].filter(x=>!x.classList.contains("rj-ad-slot"));
        const anchor=children[Math.max(1,Math.floor(children.length/2))];
        if(anchor) anchor.insertAdjacentElement("afterend",middle);
        else detail.append(middle);
      }
      rjFillSlot(middle,"post middle");
    }
    if(rjIsMobile()){
      const sticky=rjCreateSlot("mobile-bottom","rj-ad-sticky-mobile");
      if(!sticky.isConnected) document.body.appendChild(sticky);
      rjFillSlot(sticky,"mobile bottom");
    }
  }
  function rjRenderAllAds(){
    if(RJ_PAGE_TYPE==="detail") rjPlaceDetailSlots();
    else rjPlaceHomeSlots();
  }

  function rjPopupAllowed(x){
    if(!rjIsLive(x)) return false;
    const key=`rjPopup_${x.id}`;
    const freq=rjText(x.frequency).toLowerCase();
    if(freq.includes("day")){
      const today=new Date().toISOString().slice(0,10);
      return localStorage.getItem(key)!==today;
    }
    if(freq.includes("session")) return sessionStorage.getItem(key)!=="1";
    return true;
  }
  function rjMarkPopup(x){
    const key=`rjPopup_${x.id}`;
    const freq=rjText(x.frequency).toLowerCase();
    if(freq.includes("day")) localStorage.setItem(key,new Date().toISOString().slice(0,10));
    if(freq.includes("session")) sessionStorage.setItem(key,"1");
  }
  function rjShowPopup(x){
    if(document.querySelector(".rj-announcement-overlay")) return;
    const overlay=document.createElement("div");
    overlay.className="rj-announcement-overlay";
    overlay.innerHTML=`
      <div class="rj-announcement-box" role="dialog" aria-modal="true" aria-label="${rjSafe(x.title||"Announcement")}">
        <div class="rj-announcement-inner">
          <button class="rj-announcement-close" type="button" aria-label="Close">×</button>
          ${x.image?`<img class="rj-announcement-image" src="${rjSafe(x.image)}" alt="">`:`<div class="rj-announcement-icon"><i class="fa-solid fa-bullhorn"></i></div>`}
          <h2>${rjSafe(x.title||"Important Announcement")}</h2>
          <p>${rjSafe(x.message||"").replace(/\n/g,"<br>")}</p>
          ${x.link?`<a class="rj-announcement-action" href="${rjSafe(x.link)}">${rjSafe(x.buttonText||"View Details")}</a>`:""}
        </div>
      </div>`;
    const close=()=>{overlay.classList.remove("show");setTimeout(()=>overlay.remove(),260)};
    overlay.querySelector(".rj-announcement-close").onclick=close;
    overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
    document.addEventListener("keydown",function escClose(e){if(e.key==="Escape"){close();document.removeEventListener("keydown",escClose)}});
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>overlay.classList.add("show"));
    rjMarkPopup(x);
  }
  function rjLoadPopups(){
    if(!window.db) return;
    window.db.ref(RJ_POPUPS_PATH).once("value").then(s=>{
      const items=Object.entries(s.val()||{}).map(([id,x])=>({id,...x}))
        .filter(rjPopupAllowed)
        .sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)));
      const x=items[0]; if(!x) return;
      const delay=Math.max(0,Number(x.delay||0))*1000;
      setTimeout(()=>rjShowPopup(x),delay);
    }).catch(()=>{});
  }
  function rjStart(){
    if(!window.db){
      setTimeout(rjStart,250);
      return;
    }
    window.db.ref(RJ_ADS_PATH).on("value",s=>{
      adState.items=Object.entries(s.val()||{}).map(([id,x])=>({id,...x}));
      document.querySelectorAll(".rj-ad-slot").forEach(x=>{x.dataset.rjFilled="";x.innerHTML=""});
      rjRenderAllAds();
    });
    rjLoadPopups();
    if(RJ_PAGE_TYPE==="detail"){
      const target=document.getElementById("detailBox");
      if(target) new MutationObserver(()=>rjRenderAllAds()).observe(target,{childList:true,subtree:false});
    }
    window.addEventListener("resize",()=>rjRenderAllAds());
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",rjStart);
  else rjStart();
})();

/* Rapid Job professional motion layer — additive only */
(function rapidJobProfessionalMotion(){
  function activateReveal(root=document){
    const nodes=root.querySelectorAll('.fj-top-card,.fj-card,.fj-full-card,.fj-table-wrap,.side-card,.disclaimer,.rj-blog-article,.rj-blog-head,.rj-blog-content>h2,.rj-blog-highlight,.rj-blog-summary,.rj-blog-important-links,.rj-blog-faq');
    nodes.forEach((el,index)=>{
      if(el.dataset.rjRevealReady) return;
      el.dataset.rjRevealReady='1';
      el.classList.add('rj-reveal');
      el.style.transitionDelay=`${Math.min(index%8,7)*55}ms`;
      if(!('IntersectionObserver' in window)) el.classList.add('rj-visible');
    });
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add('rj-visible');io.unobserve(entry.target);}
        });
      },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
      nodes.forEach(el=>{if(!el.classList.contains('rj-visible')) io.observe(el);});
    }
  }
  function start(){
    activateReveal();
    const box=document.getElementById('detailBox');
    if(box) new MutationObserver(()=>requestAnimationFrame(()=>activateReveal(box))).observe(box,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();


/* Live important-link grid styling is controlled by job-detail.css. */
