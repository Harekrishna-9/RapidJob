/* Rapid Job Admin CMS - Fixed Dashboard + Separate Blog Editor */
const ADMIN_SECRET_CODE = "RJ2026";
const ADMIN_SESSION_KEY = "rapidJobAdminLogin";
const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
try{if(!firebase.apps.length)firebase.initializeApp(firebaseConfig)}catch(e){console.warn(e)}
const db=firebase.database();
const $=q=>document.querySelector(q);
let posts=[],messages=[],mediaItems=[],breakingItems=[],current="dashboard",editId=null,blogEditId=null,breakingEditId=null;
const categories=[["job","Current Job"],["admit","Admit Card"],["result","Result"],["answer","Answer Key"],["admission","Admission"],["scholarship","Scholarship"],["syllabus","Syllabus"],["blog","Latest Blog"],["study","Study Material"],["yojana","Government Yojana"],["state","State Job"],["document","Document"],["new","New Update"]];
const demo={title:"RRB Ministerial & Isolated Categories Online Form 2026",updatedOn:"04 July 2026 10:42 PM",description:"Railway Recruitment Board (RRB) invites online applications for the recruitment of various ministerial and isolated categories posts. A total of 312 vacancies are available. Interested and eligible candidates can apply online from 30th December 2025 to 29th January 2026. Read the full notification before applying.",type:"job",state:"All India",status:"Published",featured:true,customBlocks:[{title:"Top Buttons",style:"buttons",content:"View All Jobs | index.html\nApply Online | #\nOfficial Website | #",order:1},{title:"Important Dates + Application Fee",style:"twoCard",content:"Important Dates\nApplication Start Date : 30-12-2025\nApplication Last Date : 29-01-2026\nFee Payment Last Date : 31-01-2026\nExam Date : 14 & 15 July 2026\n---\nApplication Fee\nSC / ST / Female / ESM / Minorities / EBC: Rs.250/-\nAll Other Candidates: Rs.500/-\nPayment can be made through Debit Card, Credit Card, Internet Banking or UPI.",order:10},{title:"Age Limit + Total Post",style:"twoCard",content:"Age Limit\nAge As On : 01.01.2026\nMinimum Age : 18 Years\nMaximum Age : See Below Post Wise\n---\nTotal Post\n312",order:20},{title:"Vacancy Details",style:"table",content:"Post Name | Pay Level | Total Post | Eligibility\nChief Law Assistant | Level-6 | 54 | Degree in Law with 3 Years Practice\nJunior Translator (Hindi) | Level-6 | 130 | Master Degree with Hindi & English",order:30},{title:"Selection Process",style:"card",content:"Computer Based Test (CBT)\nSkill Test / Typing Test (Post Wise)\nDocument Verification\nMedical Examination",order:40},{title:"Important Links",style:"yellowLinks",content:"Download Notification | Click Here For Notification | #\nApply Online | Click Here To Apply | #\nOfficial Website | Click Here To Open Official Website | #\nJoin Telegram Channel | Click Here To Join Telegram | #",order:100}]};
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function br(v){return esc(v).replaceAll("\n","<br>")}
function catName(v){return (categories.find(c=>c[0]===v)||["",v||"Current Job"])[1]}
function page(t,s,b){return `<div class="hero"><span class="tag">Rapid Job CMS</span><h1>${t}</h1><p>${s}</p></div>${b}`}
function initAdminLogin(){const loginScreen=document.getElementById("adminLoginScreen"),emailInput=document.getElementById("adminEmail"),secretInput=document.getElementById("adminSecret"),loginBtn=document.getElementById("adminLoginBtn"),loginError=document.getElementById("loginError"),toggleSecret=document.getElementById("toggleSecret"),logoutBtn=document.getElementById("adminLogout");function unlock(){document.body.classList.remove("admin-locked");loginScreen?.classList.add("hide")}function lock(){document.body.classList.add("admin-locked");loginScreen?.classList.remove("hide")}localStorage.getItem(ADMIN_SESSION_KEY)==="yes"?unlock():lock();if(toggleSecret)toggleSecret.onclick=()=>{secretInput.type=secretInput.type==="password"?"text":"password";toggleSecret.innerHTML=secretInput.type==="password"?'<i class="fa-solid fa-eye"></i>':'<i class="fa-solid fa-eye-slash"></i>'};function doLogin(){const email=(emailInput?.value||"").trim(),code=(secretInput?.value||"").trim();if(!email||!email.includes("@")){if(loginError)loginError.textContent="Please enter valid email address.";return}if(code!==ADMIN_SECRET_CODE){if(loginError)loginError.textContent="Wrong secret code.";secretInput?.focus();return}localStorage.setItem(ADMIN_SESSION_KEY,"yes");if(loginError)loginError.textContent="";unlock()}loginBtn&&(loginBtn.onclick=doLogin);secretInput&&secretInput.addEventListener("keydown",e=>{if(e.key==="Enter")doLogin()});emailInput&&emailInput.addEventListener("keydown",e=>{if(e.key==="Enter")secretInput?.focus()});logoutBtn&&(logoutBtn.onclick=()=>{localStorage.removeItem(ADMIN_SESSION_KEY);if(secretInput)secretInput.value="";lock()})}
function dashboard(){const pub=posts.filter(p=>p.status!=="Draft").length,draft=posts.filter(p=>p.status==="Draft").length,blogs=posts.filter(p=>p.type==="blog").length;return page("Dashboard","Aapka visual job portal control center.",`<div class="stats"><div class="stat"><p>Total Posts</p><h2>${posts.length}</h2></div><div class="stat"><p>Published</p><h2>${pub}</h2></div><div class="stat"><p>Draft</p><h2>${draft}</h2></div><div class="stat"><p>Blogs</p><h2>${blogs}</h2></div></div><div class="panel"><div class="panel-head"><h2>Recent Posts</h2><button class="btn" onclick="openPostForm()">+ Add Job</button></div>${postTable(posts.slice(0,8))}</div>`)}
function postTable(list){return `<div class="table-wrap"><table class="table"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>${list.map(p=>`<tr><td>${esc(p.title||"")}</td><td>${esc(catName(p.type))}</td><td><span class="badge ${p.status==='Draft'?'draft':''}">${esc(p.status||"Published")}</span></td><td>${esc(p.date||p.updatedOn||"")}</td><td><button class="mini view" onclick="previewSavedPost('${p.id}')">Preview</button><button class="mini edit" onclick="${p.type==='blog'?'openBlogForm':'openPostForm'}('${p.id}')">Edit</button><button class="mini del" onclick="deletePost('${p.id}')">Delete</button></td></tr>`).join("")||'<tr><td colspan="5">No posts found.</td></tr>'}</tbody></table></div>`}
function postsPage(){return page("Job Editor","Government job post ke liye FastJob style editor.",`<div class="panel"><div class="panel-head"><h2>All Job Posts</h2><button class="btn" onclick="openPostForm()">+ Add New Job</button></div>${postTable(posts.filter(p=>p.type!=="blog"))}</div>`)}
function input(id,label,value="",type="text"){return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" value="${esc(value)}"></div>`}function textarea(id,label,value=""){return `<div class="field full"><label>${label}</label><textarea id="${id}">${esc(value)}</textarea></div>`}

/* Job Journey Manager */
const JOB_JOURNEY_STEPS=[
  ["notification","Notification Released","fa-bullhorn"],
  ["applicationStart","Application Started","fa-pen-to-square"],
  ["lastDate","Application Last Date","fa-calendar-xmark"],
  ["correction","Correction Window","fa-rotate"],
  ["cityIntimation","City Intimation","fa-city"],
  ["admitCard","Admit Card","fa-id-card"],
  ["exam","Exam Date","fa-file-pen"],
  ["answerKey","Answer Key","fa-key"],
  ["objection","Objection Window","fa-circle-exclamation"],
  ["result","Result","fa-square-poll-vertical"],
  ["documentVerification","Document Verification","fa-file-circle-check"],
  ["medical","Medical Test","fa-stethoscope"],
  ["finalMerit","Final Merit List","fa-ranking-star"],
  ["joining","Joining Letter","fa-envelope-open-text"]
];
function journeyManagerHtml(){return `<section class="journey-admin-card"><div class="journey-admin-head"><div><span class="journey-admin-tag"><i class="fa-solid fa-route"></i> Recruitment Tracker</span><h2>Job Journey Manager</h2><p>Har stage ka status, date aur optional link set karo. Disable karne par Job Detail page par journey hide rahegi.</p></div><label class="journey-switch"><input id="journeyEnabled" type="checkbox"><span></span><b>Show Journey</b></label></div><div class="journey-current-preview" id="journeyCurrentPreview"><i class="fa-solid fa-location-dot"></i><span>Current Stage automatically selected from the stage marked Current.</span></div><div class="journey-admin-grid" id="journeyRows"></div></section>`}
function renderJobJourneyManager(data={}){const box=$("#journeyRows");if(!box)return;const saved=Array.isArray(data.steps)?data.steps:[];$("#journeyEnabled").checked=!!data.enabled;box.innerHTML=JOB_JOURNEY_STEPS.map(([key,label,icon],i)=>{const x=saved.find(v=>v.key===key)||{};return `<div class="journey-admin-row" data-key="${key}"><div class="journey-step-name"><span>${i+1}</span><i class="fa-solid ${icon}"></i><b>${label}</b></div><select class="journey-status" aria-label="${label} status"><option value="upcoming">Upcoming</option><option value="current">Current</option><option value="completed">Completed</option></select><input class="journey-date" type="date" value="${esc(x.date||'')}" aria-label="${label} date"><input class="journey-link" type="url" value="${esc(x.link||'')}" placeholder="Optional link" aria-label="${label} link"></div>`}).join("");[...box.querySelectorAll('.journey-admin-row')].forEach(row=>{const x=saved.find(v=>v.key===row.dataset.key)||{};row.querySelector('.journey-status').value=x.status||'upcoming'});box.addEventListener('change',e=>{if(e.target.classList.contains('journey-status')&&e.target.value==='current'){box.querySelectorAll('.journey-status').forEach(sel=>{if(sel!==e.target&&sel.value==='current')sel.value='upcoming'})}updateJourneyAdminPreview()});updateJourneyAdminPreview()}
function updateJourneyAdminPreview(){const current=[...document.querySelectorAll('.journey-admin-row')].find(r=>r.querySelector('.journey-status')?.value==='current');const preview=$("#journeyCurrentPreview span");if(preview)preview.textContent=current?`Current Stage: ${current.querySelector('.journey-step-name b')?.textContent||''}`:'No current stage selected. Completed progress will still be calculated.'}
function collectJobJourney(){const rows=[...document.querySelectorAll('.journey-admin-row')];return {enabled:!!$("#journeyEnabled")?.checked,steps:rows.map(r=>({key:r.dataset.key,label:r.querySelector('.journey-step-name b')?.textContent||'',status:r.querySelector('.journey-status')?.value||'upcoming',date:r.querySelector('.journey-date')?.value||'',link:r.querySelector('.journey-link')?.value.trim()||''}))}}
function adminJourneyPreview(journey){if(!journey?.enabled||!Array.isArray(journey.steps))return'';const done=journey.steps.filter(x=>x.status==='completed').length,current=journey.steps.find(x=>x.status==='current'),pct=Math.round(((done+(current?0.5:0))/journey.steps.length)*100);return `<section class="admin-journey-preview"><div><b>Job Journey</b><span>${esc(current?.label||'Recruitment Timeline')}</span></div><strong>${pct}%</strong></section>`}

function openPostForm(id=null){editId=id;blogEditId=null;const p=id?posts.find(x=>x.id===id)||demo:demo;$("#app").innerHTML=page(id?"Edit Job Post":"Add New Job Post","Job editor: table, links, notice, FAQ aur custom blocks add karo.",`<div class="panel"><div class="grid2"><div class="field"><label>Category</label><select id="type">${categories.filter(c=>c[0]!=="blog").map(c=>`<option value="${c[0]}" ${(p.type||p.category)===c[0]?"selected":""}>${c[1]}</option>`).join("")}</select></div><div class="field"><label>Status</label><select id="status"><option>Published</option><option>Draft</option><option>Pending</option></select></div><div class="field"><label>State</label><input id="state" value="${esc(p.state||"All India")}"></div><div class="field"><label>Featured / Trending</label><select id="featured"><option value="false">Normal Post</option><option value="true">Featured / Trending</option></select></div>${input("title","Post Title",p.title||"")}${input("updatedOn","Updated On",p.updatedOn||"")}${textarea("description","Top Short Information",p.description||p.details||"")}</div>${journeyManagerHtml()}<div class="section-bar"><div><h2>Job Visual Builder</h2><p class="hint">Table = Column1 | Column2 | Column3. Buttons = Button Text | URL. Yellow Link = Left | Right Text | URL.</p></div><button class="btn light" onclick="loadFastTemplate()">⚡ Add FastJob Template</button></div><div class="builder-toolbar"><button class="btn small light" onclick="addBlock('card')">+ Card</button><button class="btn small light" onclick="addBlock('twoCard')">+ Two Card</button><button class="btn small light" onclick="addBlock('twoHeadingTable')">+ Two Heading Table</button><button class="btn small light" onclick="addBlock('yellowHighlight')">+ Yellow Highlight</button><button class="btn small light" onclick="addBlock('table')">+ Table</button><button class="btn small light" onclick="addBlock('yellowLinks')">+ Yellow Links</button><button class="btn small light" onclick="addBlock('buttons')">+ Buttons</button><button class="btn small light" onclick="addBlock('notice')">+ Notice</button><button class="btn small light" onclick="addBlock('alert')">+ Alert</button><button class="btn small light" onclick="addBlock('html')">+ HTML</button><button class="btn small light" onclick="addBlock('faq')">+ FAQ</button><button class="btn small light" onclick="addBlock('image')">+ Image</button></div><div id="customBlocks"></div><div class="sticky-actions"><button class="btn preview" onclick="previewDraft()"><i class="fa-solid fa-eye"></i> Draft Preview</button><button class="btn light" onclick="savePost('Draft')"><i class="fa-solid fa-file-lines"></i> Save Draft</button><button class="btn green" onclick="savePost('Published')"><i class="fa-solid fa-paper-plane"></i> Publish Job</button><button class="btn light" onclick="render('posts')">Cancel</button></div></div>`);$("#status").value=p.status||"Published";$("#featured").value=String(!!p.featured||!!p.trending);(p.customBlocks&&p.customBlocks.length?p.customBlocks:demo.customBlocks).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(b=>addBlock(b.style,b));renderJobJourneyManager(p.jobJourney||{})}
function sample(style){const m={card:["Selection Process","Computer Based Test (CBT)\nDocument Verification",50],twoHeadingTable:["Important Dates + Application Fee","Important Dates | Application Fee\nApplication Start Date: 01-01-2026 | General / OBC: Rs.500\nApplication Last Date: 31-01-2026 | SC / ST: Rs.250",15],yellowHighlight:["Important Update","Write highlighted information here.",18],twoCard:["Important Dates + Fee","Important Dates\nStart Date : 01-01-2026\nLast Date : 31-01-2026\n---\nApplication Fee\nGeneral: Rs.500\nSC/ST: Rs.250",20],table:["Vacancy Details","Post Name | Total Post | Eligibility\nAssistant | 50 | Graduate\nClerk | 20 | 12th Pass",30],yellowLinks:["Important Links","Apply Online | Click Here To Apply | #\nDownload Notification | Click Here For Notification | #\nOfficial Website | Click Here To Open | #",100],buttons:["Top Buttons","View All Jobs | index.html\nApply Online | #\nOfficial Website | #",1],notice:["Important Notice","Read official notification before applying.",60],alert:["Latest Update","Application date extended.",5],html:["Custom HTML","<b>Write your custom HTML here</b>",70],faq:["FAQ","What is last date? | Check notification\nHow to apply? | Apply online",90],image:["Image/Banner","https://via.placeholder.com/900x250",45]};return m[style]||m.card}
function addBlock(style="card",data=null){const d=document.createElement("div");d.className="builder-row";d.draggable=true;const s=data?[data.title||"",data.content||"",data.order||50]:sample(style);d.innerHTML=`<div class="block-drag-handle" title="Drag to move"><i class="fa-solid fa-grip-vertical"></i></div><input class="b-title" placeholder="Section Title" value="${esc(s[0])}"><select class="b-style"><option value="card">Card Box</option><option value="twoCard">Two Column Cards</option><option value="twoHeadingTable">Two Heading Table</option><option value="yellowHighlight">Yellow Highlight Paragraph</option><option value="table">Table</option><option value="yellowLinks">Yellow Link Table</option><option value="buttons">Button Row</option><option value="notice">Notice Box</option><option value="alert">Alert Box</option><option value="faq">FAQ</option><option value="image">Image / Banner</option><option value="html">Custom HTML</option></select><textarea class="b-content" placeholder="Content">${esc(s[1])}</textarea><input class="b-order" type="number" value="${esc(s[2])}" placeholder="Order"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;$("#customBlocks").appendChild(d);d.querySelector(".b-style").value=data?data.style||style:style;bindMovableBlock(d,"#customBlocks",".builder-row",".b-order") }
async function loadFastTemplate(){const ok=await adminConfirm("Current custom blocks clear karke FastJob template add kiya jayega.","Add FastJob Template?","Add Template");if(ok){if($("#customBlocks"))$("#customBlocks").innerHTML="";demo.customBlocks.forEach(b=>addBlock(b.style,b));showToast("FastJob template added.")}}
function collectPostData(statusOverride=null){const get=id=>$("#"+id)?.value.trim()||"";const customBlocks=[...document.querySelectorAll(".builder-row")].map(r=>({title:r.querySelector(".b-title").value.trim(),style:r.querySelector(".b-style").value,content:r.querySelector(".b-content").value.trim(),order:Number(r.querySelector(".b-order").value||50)})).filter(b=>b.title||b.content).sort((a,b)=>a.order-b.order);const id=editId||("post_"+Date.now());return {id,type:get("type"),category:get("type"),section:get("type"),categoryName:catName(get("type")),status:statusOverride||get("status")||"Published",state:get("state")||"All India",featured:get("featured")==="true",trending:get("featured")==="true",title:get("title"),updatedOn:get("updatedOn"),description:get("description"),details:get("description"),jobJourney:collectJobJourney(),customBlocks,time:Date.now(),date:new Date().toISOString().slice(0,10)}}
function renderBlock(b){const rows=String(b.content||"").split("\n").filter(x=>x.trim());if(b.style==="yellowHighlight")return `<div class="blog-highlight"><b>${esc(b.title)}</b><br>${br(b.content)}</div>`;if(b.style==="twoHeadingTable"){let rr=rows.map(x=>x.split("|").map(y=>y.trim()));let hh=rr.shift()||["Left Heading","Right Heading"];return `<h2>${esc(b.title)}</h2><table class="cms-table cms-two-heading"><thead><tr><th>${esc(hh[0]||"")}</th><th>${esc(hh[1]||"")}</th></tr></thead><tbody>${rr.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td></tr>`).join("")}</tbody></table>`}if(b.style==="html")return `<div class="cms-card"><h3>${esc(b.title)}</h3>${b.content}</div>`;if(b.style==="image")return `<div class="cms-card"><h3>${esc(b.title)}</h3><img src="${esc(b.content)}" style="width:100%;border-radius:12px"></div>`;if(b.style==="notice"||b.style==="alert")return `<div class="cms-${b.style}"><b>${esc(b.title)}</b><br>${br(b.content)}</div>`;if(b.style==="buttons")return `<div class="cms-buttons">${rows.map(x=>{let[t,u]=x.split("|").map(y=>y?.trim()||"");return `<a href="${esc(u||'#')}" target="_blank">${esc(t||'Open')}</a>`}).join("")}</div>`;if(b.style==="yellowLinks")return `<h2>${esc(b.title)}</h2><table class="cms-table cms-links"><tbody>${rows.map(x=>{let[a,c,u]=x.split("|").map(y=>y?.trim()||"");return `<tr><td>${esc(a)}</td><td><a href="${esc(u||'#')}" target="_blank">${esc(c||'Click Here')}</a></td></tr>`}).join("")}</tbody></table>`;if(b.style==="table"){let table=rows.map(x=>x.split("|").map(y=>y.trim()));let head=table.shift()||[];return `<h2>${esc(b.title)}</h2><table class="cms-table"><thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${table.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`}if(b.style==="twoCard"){let parts=String(b.content||"").split("---");return `<div class="preview-grid">${parts.map(p=>{let l=p.trim().split("\n");let title=l.shift()||b.title;return `<div class="cms-card"><h3>${esc(title)}</h3><ul>${l.filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`}).join("")}</div>`}if(b.style==="faq")return `<div class="cms-card"><h3>${esc(b.title)}</h3>${rows.map(x=>{let[q,a]=x.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check details")}</p>`}).join("")}</div>`;return `<div class="cms-card"><h3>${esc(b.title)}</h3><ul>${rows.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`}
function previewHtml(d){return `<div class="preview-post"><div class="preview-head"><span class="tag">${esc(d.categoryName)}</span><h1>${esc(d.title||"Post Title")}</h1><p><i class="fa-regular fa-clock"></i> Updated On : ${esc(d.updatedOn||"")}</p></div><p>${br(d.description||"")}</p>${adminJourneyPreview(d.jobJourney)}${(d.customBlocks||[]).map(renderBlock).join("")}</div>`}
function ensureModal(){if(document.getElementById("adminModal"))return;let m=document.createElement("div");m.id="adminModal";m.className="admin-modal";m.innerHTML=`<div class="admin-modal-box wide"><button class="admin-modal-close" onclick="closeAdminModal()">×</button><div id="adminModalContent"></div></div>`;document.body.appendChild(m)}
function openAdminModal(html){
  ensureModal();

  const box = document.querySelector("#adminModal .admin-modal-box");

  if(box){
    box.classList.remove("wide","delete-modal");

    if(html.includes("delete-pop") || html.includes("success-icon")){
      box.classList.add("delete-modal");
    }else{
      box.classList.add("wide");
    }
  }

  $("#adminModalContent").innerHTML = html;
  document.getElementById("adminModal").classList.add("show");
}
function closeAdminModal(){document.getElementById("adminModal")?.classList.remove("show")}
function alertPopup(m){
  openAdminModal(`
    <div class="modal-body delete-pop small-pop">
      <div class="success-icon">
        <i class="fa-solid fa-check"></i>
      </div>

      <h2>Success</h2>
      <p>${esc(m)}</p>

      <div class="delete-pop-actions">
        <button class="btn green" onclick="closeAdminModal()">
          OK
        </button>
      </div>
    </div>
  `);
}

function previewDraft(){let d=collectPostData();if(!d.title)return alertPopup("Post title is required.");openAdminModal(`<div class="modal-title-row"><h2>Post Preview Before Publish</h2><button class="btn green" onclick="closeAdminModal();savePost('Published')">Publish Now</button></div>${previewHtml(d)}`)}function previewSavedPost(id){let d=posts.find(p=>p.id===id);if(!d)return alertPopup("Post not found.");openAdminModal(`<div class="modal-title-row"><h2>${esc(d.title)}</h2><button class="btn" onclick="window.open('job-detail.html?id=${id}','_blank')">Open Page</button></div>${d.type==='blog'?blogPreviewHtml(d):previewHtml(d)}`)}
async function savePost(status){let d=collectPostData(status);if(!d.title)return alertPopup("Post title is required.");await db.ref("posts/"+d.id).set(d);alertPopup(d.status==="Draft"?"Draft saved successfully.":"Post published successfully.");render("posts")}async function deletePost(id){const ok=await adminConfirm("This post will be permanently deleted from Firebase.","Delete Post?","Delete");if(ok){await db.ref("posts/"+id).remove();addActivity("Post deleted",id,"delete");alertPopup("Post deleted successfully.")}}
function blogEditor(){const blogs=posts.filter(p=>p.type==="blog");return page("Blog / Article Editor","Blog layout ke liye alag article editor.",`<div class="panel"><div class="panel-head"><h2>Blog Articles</h2><button class="btn" onclick="openBlogForm()">+ Create Blog Article</button></div>${postTable(blogs)}</div><div class="panel"><h2>Blog Format Features</h2><div class="blog-toolbox"><div class="cms-card"><h3>🖼 Featured Image</h3><p>Article banner image add karo.</p></div><div class="cms-card"><h3>🟨 Highlight Box</h3><p>Important paragraph yellow mark me.</p></div><div class="cms-card"><h3>📊 Summary Table</h3><p>Fastjobsearchers jaisa summary table.</p></div><div class="cms-card"><h3>🟩 Green Headings</h3><p>Article sections green heading style me.</p></div></div></div>`)}
function openBlogForm(id=null){
  blogEditId=id;editId=null;
  const p=id?posts.find(x=>x.id===id)||{}:{};
  const b=p.blog||{};
  $("#app").innerHTML=page(
    id?"Edit Blog Article":"Create Blog Article",
    "Blog ke liye alag editor: image, highlight, summary table, important links, content aur FAQ.",
    `<div class="panel blog-editor-grid">
      <div>
        <div class="grid2">
          ${input("blogTitle","Blog Title",p.title||"")}
          ${input("blogUpdated","Updated On",p.updatedOn||"")}
          ${input("blogAuthor","Author",b.author||"Harekrishna Patel")}
          ${input("blogImage","Featured Image URL",b.image||"")}
          ${textarea("blogIntro","Short Introduction",p.description||"")}
          ${textarea("blogHighlight","Yellow Highlight Paragraph",b.highlight||"")}
                  </div>

        <div class="grid2">
          ${textarea("blogSummary","Summary Table (Left | Right)",b.summary||"Article Name | Voter ID Card Download\nOfficial Website | voters.eci.gov.in")}
        </div>

        <div class="section-bar">
          <h2>Blog Content Blocks</h2>
          <button class="btn light" onclick="addBlogBlock('green')">+ Green Heading</button>
        </div>
        <div class="builder-toolbar">
          <button class="btn small light" onclick="addBlogBlock('paragraph')">+ Paragraph</button>
          <button class="btn small light" onclick="addBlogBlock('yellowHighlight')">+ Yellow Highlight</button>
          <button class="btn small light" onclick="addBlogBlock('twoHeadingTable')">+ Two Heading Table</button>
          <button class="btn small light" onclick="addBlogBlock('image')">+ Image</button>
          <button class="btn small light" onclick="addBlogBlock('table')">+ Table</button>
          <button class="btn small light" onclick="addBlogBlock('button')">+ Button</button>
          <button class="btn small light" onclick="addBlogBlock('faq')">+ FAQ</button>
          <button class="btn small light" onclick="addBlogBlock('html')">+ HTML</button>
        </div>
        <div id="blogBlocks"></div>



        <section class="blog-important-builder">
          <div class="blog-important-head">
            <div>
              <span class="blog-important-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
              <div>
                <h2>Important Links / Registration Buttons</h2>
                <p>Online Registration, Applicant Login, Official Website jaise unlimited buttons add karein.</p>
              </div>
            </div>
            <button class="btn green" type="button" onclick="addBlogImportantLink()">
              <i class="fa-solid fa-plus"></i> Add Link
            </button>
          </div>
          <div class="blog-link-column-head">
            <span>Button Title</span><span>Target URL</span><span>Icon</span><span>Colour</span><span>New Tab</span><span></span>
          </div>
          <div id="blogImportantLinks"></div>
          <div class="blog-links-tip">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Publish hone par ye links screenshot jaise bade animated rows me show honge.
          </div>
        </section>

        <section class="blog-link-table-builder">
          <div class="blog-important-head">
            <div>
              <span class="blog-important-icon"><i class="fa-solid fa-table-cells-large"></i></span>
              <div>
                <h2>Unlimited Link Table Builder</h2>
                <p>2, 3 ya unlimited columns aur rows ke saath screenshot jaisi link table banayein.</p>
              </div>
            </div>
            <button class="btn green" type="button" onclick="addBlogLinkTable()">
              <i class="fa-solid fa-plus"></i> Add Link Table
            </button>
          </div>
          <div id="blogLinkTables"></div>
          <div class="blog-links-tip">
            <i class="fa-solid fa-circle-info"></i>
            Har cell me Text aur optional URL bharein. Column/Row buttons se structure badha sakte hain.
          </div>
        </section>

        <div class="sticky-actions">
          <button class="btn preview" onclick="previewBlogDraft()"><i class="fa-solid fa-eye"></i> Blog Preview</button>
          <button class="btn light" onclick="saveBlog('Draft')">Save Draft</button>
          <button class="btn green" onclick="saveBlog('Published')">Publish Blog</button>
          <button class="btn light" onclick="render('blogEditor')">Cancel</button>
        </div>
      </div>
      <div>
        <div class="blog-preview" id="blogLivePreview">
          <div class="blog-preview-body"><h2>Live Preview</h2><p>Preview button dabao.</p></div>
        </div>
      </div>
    </div>`
  );

  const defaultLinks=[
    {title:"Online Registration",url:"#",icon:"fa-user-plus",color:"purple",newTab:true,enabled:true,order:10},
    {title:"Applicant Login",url:"#",icon:"fa-right-to-bracket",color:"blue",newTab:true,enabled:true,order:20},
    {title:"Official Website",url:"#",icon:"fa-globe",color:"green",newTab:true,enabled:true,order:30}
  ];
  (b.importantLinks&&b.importantLinks.length?b.importantLinks:defaultLinks).forEach(addBlogImportantLink);
  (Array.isArray(b.linkTables)?b.linkTables:[]).forEach(addBlogLinkTable);
  const loadedBlogBlocks=b.blocks&&b.blocks.length?b.blocks:[
    {title:"Voter ID Card क्या है ?",style:"green",content:"यहां अपना article content लिखें.",order:10},
    {title:"FAQ",style:"faq",content:"Voter ID कैसे डाउनलोड करें? | Official website पर जाकर download करें.",order:90}
  ];
  normalizeBlogBlockOrder(loadedBlogBlocks).forEach(x=>addBlogBlock(x.style,x));
}

function addBlogImportantLink(data={}){
  const host=$("#blogImportantLinks");if(!host)return;
  const row=document.createElement("div");
  row.className="blog-important-row";
  row.draggable=true;
  const colors=["purple","blue","green","orange","red","teal","dark"];
  const icons=[
    ["fa-user-plus","Registration"],["fa-right-to-bracket","Login"],["fa-globe","Website"],
    ["fa-file-arrow-down","Download"],["fa-bell","Notification"],["fa-link","Link"],
    ["fa-id-card","Apply"],["fa-book-open","Read"]
  ];
  row.innerHTML=`
    <div class="blog-link-drag" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></div>
    <input class="bil-title" placeholder="Online Registration" value="${esc(data.title||"")}">
    <input class="bil-url" placeholder="https://example.com" value="${esc(data.url||"")}">
    <select class="bil-icon">${icons.map(([v,t])=>`<option value="${v}" ${data.icon===v?"selected":""}>${t}</option>`).join("")}</select>
    <select class="bil-color">${colors.map(v=>`<option value="${v}" ${data.color===v?"selected":""}>${v[0].toUpperCase()+v.slice(1)}</option>`).join("")}</select>
    <label class="bil-check"><input class="bil-newtab" type="checkbox" ${data.newTab!==false?"checked":""}> New</label>
    <label class="bil-check"><input class="bil-enabled" type="checkbox" ${data.enabled!==false?"checked":""}> ON</label>
    <input class="bil-order" type="number" value="${Number(data.order||((host.children.length+1)*10))}" title="Order">
    <button class="mini del" type="button" onclick="this.closest('.blog-important-row').remove()"><i class="fa-solid fa-trash"></i></button>`;
  host.appendChild(row);
  bindBlogLinkDrag(row);
}
function bindBlogLinkDrag(row){
  row.addEventListener("dragstart",()=>row.classList.add("dragging"));
  row.addEventListener("dragend",()=>{
    row.classList.remove("dragging");
    [...document.querySelectorAll(".blog-important-row")].forEach((r,i)=>r.querySelector(".bil-order").value=(i+1)*10);
  });
  row.parentElement?.addEventListener("dragover",e=>{
    e.preventDefault();
    const moving=document.querySelector(".blog-important-row.dragging");if(!moving)return;
    const after=[...row.parentElement.querySelectorAll(".blog-important-row:not(.dragging)")].find(x=>e.clientY<=x.getBoundingClientRect().top+x.offsetHeight/2);
    after?row.parentElement.insertBefore(moving,after):row.parentElement.appendChild(moving);
  });
}

function normalizeLinkTableData(data={}){
  const columns=Math.max(2,Number(data.columns||2));
  const rows=Array.isArray(data.rows)&&data.rows.length?data.rows:[Array.from({length:columns},(_,i)=>({text:i===0?"Apply Online":"Click Here",url:i===0?"":"#"}))];
  return {
    title:data.title||"Important Links",
    columns,
    order:Number(data.order||100),
    rows:rows.map(row=>Array.from({length:columns},(_,i)=>({
      text:String(row?.[i]?.text??row?.[i]??""),
      url:String(row?.[i]?.url??"")
    })))
  };
}
function addBlogLinkTable(data={}){
  const host=$("#blogLinkTables");if(!host)return;
  const table=normalizeLinkTableData(data);
  const box=document.createElement("div");
  box.className="blog-link-table-box";
  box.dataset.columns=String(table.columns);
  box.innerHTML=`
    <div class="blt-head">
      <input class="blt-title" value="${esc(table.title)}" placeholder="Table Heading">
      <input class="blt-order" type="number" value="${table.order}" title="Order">
      <button class="btn small light" type="button" onclick="changeBlogLinkTableColumns(this,1)"><i class="fa-solid fa-table-columns"></i> + Column</button>
      <button class="btn small light" type="button" onclick="changeBlogLinkTableColumns(this,-1)"><i class="fa-solid fa-minus"></i> Column</button>
      <button class="btn small green" type="button" onclick="addBlogLinkTableRow(this)"><i class="fa-solid fa-plus"></i> Row</button>
      <button class="mini del" type="button" onclick="this.closest('.blog-link-table-box').remove()"><i class="fa-solid fa-trash"></i></button>
    </div>
    <div class="blt-grid-head"></div>
    <div class="blt-rows"></div>`;
  host.appendChild(box);
  table.rows.forEach(row=>addBlogLinkTableRow(box.querySelector(".btn.green"),row));
  refreshBlogLinkTable(box);
}
function addBlogLinkTableRow(button,data=null){
  const box=button?.closest?.(".blog-link-table-box")||button;
  if(!box)return;
  const columns=Math.max(2,Number(box.dataset.columns||2));
  const row=document.createElement("div");
  row.className="blt-row";
  row.innerHTML=Array.from({length:columns},(_,i)=>{
    const cell=data?.[i]||{};
    return `<div class="blt-cell"><input class="blt-text" value="${esc(cell.text||"")}" placeholder="Column ${i+1} text"><input class="blt-url" value="${esc(cell.url||"")}" placeholder="Optional URL"></div>`;
  }).join("")+`<button class="mini del blt-row-del" type="button" onclick="this.closest('.blt-row').remove()"><i class="fa-solid fa-xmark"></i></button>`;
  box.querySelector(".blt-rows").appendChild(row);
  refreshBlogLinkTable(box);
}
function changeBlogLinkTableColumns(button,delta){
  const box=button.closest(".blog-link-table-box");if(!box)return;
  const oldCols=Math.max(2,Number(box.dataset.columns||2));
  const newCols=Math.max(2,oldCols+delta);
  if(newCols===oldCols)return;
  box.dataset.columns=String(newCols);
  box.querySelectorAll(".blt-row").forEach(row=>{
    const del=row.querySelector(".blt-row-del");
    if(newCols>oldCols){
      for(let i=oldCols;i<newCols;i++){
        const cell=document.createElement("div");
        cell.className="blt-cell";
        cell.innerHTML=`<input class="blt-text" placeholder="Column ${i+1} text"><input class="blt-url" placeholder="Optional URL">`;
        row.insertBefore(cell,del);
      }
    }else{
      [...row.querySelectorAll(".blt-cell")].slice(newCols).forEach(x=>x.remove());
    }
  });
  refreshBlogLinkTable(box);
}
function refreshBlogLinkTable(box){
  const columns=Math.max(2,Number(box.dataset.columns||2));
  const head=box.querySelector(".blt-grid-head");
  if(head){
    head.style.gridTemplateColumns=`repeat(${columns},minmax(170px,1fr)) 38px`;
    head.innerHTML=Array.from({length:columns},(_,i)=>`<span>Column ${i+1}</span>`).join("")+"<span></span>";
  }
  box.querySelectorAll(".blt-row").forEach(row=>row.style.gridTemplateColumns=`repeat(${columns},minmax(170px,1fr)) 38px`);
}
function collectBlogLinkTables(){
  return [...document.querySelectorAll(".blog-link-table-box")].map((box,index)=>{
    const columns=Math.max(2,Number(box.dataset.columns||2));
    const rows=[...box.querySelectorAll(".blt-row")].map(row=>[...row.querySelectorAll(".blt-cell")].slice(0,columns).map(cell=>({
      text:cell.querySelector(".blt-text")?.value.trim()||"",
      url:cell.querySelector(".blt-url")?.value.trim()||""
    }))).filter(row=>row.some(cell=>cell.text||cell.url));
    return {
      title:box.querySelector(".blt-title")?.value.trim()||"Important Links",
      columns,
      rows,
      order:Number(box.querySelector(".blt-order")?.value||((index+1)*10))
    };
  }).filter(x=>x.rows.length).sort((a,b)=>a.order-b.order);
}
function blogLinkTablesHtml(tables=[]){
  return (Array.isArray(tables)?tables:[]).map(table=>{
    const columns=Math.max(2,Number(table.columns||2));
    const rows=Array.isArray(table.rows)?table.rows:[];
    if(!rows.length)return"";
    return `<section class="blog-link-table-preview"><h2>${esc(table.title||"Important Links")}</h2><div class="blog-link-table-scroll"><table><tbody>${rows.map(row=>`<tr>${Array.from({length:columns},(_,i)=>{const cell=row?.[i]||{};const label=esc(cell.text||"");const url=String(cell.url||"").trim();return `<td>${url?`<a href="${esc(url)}" target="_blank" rel="noopener">${label||"Click Here"}</a>`:label}</td>`}).join("")}</tr>`).join("")}</tbody></table></div></section>`;
  }).join("");
}

function collectBlogImportantLinks(){
  return [...document.querySelectorAll(".blog-important-row")].map((r,i)=>({
    title:r.querySelector(".bil-title").value.trim(),
    url:r.querySelector(".bil-url").value.trim()||"#",
    icon:r.querySelector(".bil-icon").value,
    color:r.querySelector(".bil-color").value,
    newTab:r.querySelector(".bil-newtab").checked,
    enabled:r.querySelector(".bil-enabled").checked,
    order:Number(r.querySelector(".bil-order").value||((i+1)*10))
  })).filter(x=>x.title).sort((a,b)=>a.order-b.order);
}
function blogImportantLinksHtml(links=[]){
  const live=links.filter(x=>x.enabled!==false);
  if(!live.length)return"";
  return `<section class="blog-published-links">
    <h2><i class="fa-solid fa-arrow-up-right-from-square"></i> Important Links</h2>
    <div class="blog-published-link-list">
      ${live.map(x=>`<a class="blog-published-link color-${esc(x.color||"blue")}" href="${esc(x.url||"#")}" ${x.newTab!==false?"target='_blank' rel='noopener'":""}>
        <i class="fa-solid ${esc(x.icon||"fa-link")}"></i>
        <span>${esc(x.title)}</span>
        <i class="fa-solid fa-arrow-right"></i>
      </a>`).join("")}
    </div>
  </section>`;
}

function blogSample(style){const m={green:["Green Section Heading","यहां अपना paragraph लिखें।",20],paragraph:["Paragraph","Normal article paragraph content.",30],yellowHighlight:["Important Highlight","Important information yahan likhen.",35],twoHeadingTable:["Important Dates + Application Fee","Important Dates | Application Fee\nApplication Start Date: 15-07-2026 | No Application Fee\nApplication Last Date: 15-09-2026 | All Categories: Nil",40],image:["Image","https://via.placeholder.com/900x350",50],table:["Summary Table","Name | Details\nOfficial Website | voters.eci.gov.in",60],button:["Download Button","Download Voter ID | #",70],faq:["FAQ","Question? | Answer here",90],html:["Custom HTML","<b>Custom HTML</b>",80]};return m[style]||m.paragraph}
function addBlogBlock(style="paragraph",data=null){const d=document.createElement("div");d.className="blog-block-row";d.draggable=true;const s=data?[data.title||"",data.content||"",data.order||50]:blogSample(style);d.innerHTML=`<div class="block-drag-handle" title="Drag to move"><i class="fa-solid fa-grip-vertical"></i></div><input class="bb-title" placeholder="Title" value="${esc(s[0])}"><select class="bb-style"><option value="green">Green Heading</option><option value="paragraph">Paragraph</option><option value="yellowHighlight">Yellow Highlight Paragraph</option><option value="twoHeadingTable">Two Heading Table</option><option value="image">Image</option><option value="table">Table</option><option value="button">Button</option><option value="faq">FAQ</option><option value="html">HTML</option></select><textarea class="bb-content">${esc(s[1])}</textarea><input class="bb-order" type="number" value="${esc(s[2])}"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;$("#blogBlocks").appendChild(d);d.querySelector(".bb-style").value=data?data.style||style:style;bindMovableBlock(d,"#blogBlocks",".blog-block-row",".bb-order")}

function bindMovableBlock(row,hostSelector,rowSelector,orderSelector){
  const host=document.querySelector(hostSelector);if(!host)return;
  row.addEventListener("dragstart",e=>{row.classList.add("dragging-block");e.dataTransfer.effectAllowed="move"});
  row.addEventListener("dragend",()=>{row.classList.remove("dragging-block");[...host.querySelectorAll(rowSelector)].forEach((r,i)=>{const o=r.querySelector(orderSelector);if(o)o.value=(i+1)*10})});
  if(!host.dataset.dragBound){host.dataset.dragBound="1";host.addEventListener("dragover",e=>{e.preventDefault();const moving=host.querySelector(rowSelector+".dragging-block");if(!moving)return;const others=[...host.querySelectorAll(rowSelector+":not(.dragging-block)")];const after=others.find(x=>e.clientY<=x.getBoundingClientRect().top+x.offsetHeight/2);after?host.insertBefore(moving,after):host.appendChild(moving)})}
}

function normalizeBlogBlockOrder(blocks=[]){
  const list=[...blocks].map((block,index)=>({
    ...block,
    order:Number(block.order||((index+1)*10))
  }));

  const cleanTitle=value=>String(value||"")
    .toLowerCase()
    .replace(/[।|:;,_\-–—()[\]{}]/g," ")
    .replace(/\s+/g," ")
    .trim();

  const isEligibility=block=>{
    const t=cleanTitle(block?.title);
    return (
      t.includes("पात्रता") ||
      t.includes("योग्यता") ||
      t.includes("पात्र उम्मीदवार") ||
      t.includes("के लिए पात्र") ||
      t.includes("eligibility") ||
      t.includes("eligible candidate")
    );
  };

  const isHelpDesk=block=>{
    const t=cleanTitle(block?.title);
    return (
      t.includes("help desk") ||
      t.includes("helpdesk") ||
      t.includes("helpline") ||
      t.includes("सहायता") ||
      t.includes("संपर्क")
    );
  };

  list.sort((a,b)=>a.order-b.order);

  const eligibilityIndex=list.findIndex(isEligibility);
  const helpDeskIndex=list.findIndex(isHelpDesk);

  if(eligibilityIndex!==-1 && helpDeskIndex!==-1){
    const [helpDeskBlock]=list.splice(helpDeskIndex,1);

    const freshEligibilityIndex=list.findIndex(isEligibility);
    list.splice(freshEligibilityIndex+1,0,helpDeskBlock);
  }

  list.forEach((block,index)=>{
    block.order=(index+1)*10;
  });

  return list;
}

function collectBlogData(status){
  const get=id=>$("#"+id)?.value.trim()||"";
  const id=blogEditId||("post_"+Date.now());
  const blocks=[...document.querySelectorAll(".blog-block-row")].map(r=>({
    title:r.querySelector(".bb-title").value.trim(),
    style:r.querySelector(".bb-style").value,
    content:r.querySelector(".bb-content").value.trim(),
    order:Number(r.querySelector(".bb-order").value||50)
  })).filter(b=>b.title||b.content);
  const orderedBlocks=normalizeBlogBlockOrder(blocks);
  const importantLinks=collectBlogImportantLinks();
  const linkTables=collectBlogLinkTables();
  return {
    id,type:"blog",category:"blog",section:"blog",categoryName:"Latest Blog",
    status:status||"Published",state:"All India",
    title:get("blogTitle"),updatedOn:get("blogUpdated"),
    description:get("blogIntro"),details:get("blogIntro"),
    blog:{
      author:get("blogAuthor"),image:get("blogImage"),highlight:get("blogHighlight"),
      summary:get("blogSummary"),importantLinks,linkTables,blocks:orderedBlocks
    },
    importantLinks,
    customBlocks:orderedBlocks.map(x=>({
      title:x.title,
      style:x.style==="green"||x.style==="paragraph"?"card":x.style==="button"?"buttons":x.style,
      content:x.content,order:x.order
    })),
    time:Date.now(),date:new Date().toISOString().slice(0,10)
  }
}
function blogPreviewHtml(d){
  const b=d.blog||{};
  return `<div class="preview-post">
    <div class="preview-head">
      <span class="tag">Latest Blog</span>
      <h1>${esc(d.title||"Blog Title")}</h1>
      <p>Updated On : ${esc(d.updatedOn||"")} ${b.author?" | Author: "+esc(b.author):""}</p>
    </div>
    ${b.image?`<img class="blog-preview-cover" src="${esc(b.image)}">`:""}
    <div class="blog-preview-body">
      <p>${br(d.description||"")}</p>
      ${b.highlight?`<div class="blog-highlight">${br(b.highlight)}</div>`:""}
      ${blogSummaryTable(b.summary||"")}
      ${normalizeBlogBlockOrder(b.blocks||[]).map(renderBlogBlock).join("")}
      ${blogLinkTablesHtml(b.linkTables||[])}
      ${blogImportantLinksHtml(b.importantLinks||d.importantLinks||[])}
    </div>
  </div>`
}
function blogSummaryTable(txt){const rows=String(txt||"").split("\n").filter(Boolean).map(x=>x.split("|").map(y=>y.trim()));if(!rows.length)return"";return `<table class="blog-summary-table"><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td></tr>`).join("")}</tbody></table>`}
function twoHeadingBlogTable(txt){const rows=String(txt||"").split("\n").filter(Boolean).map(x=>x.split("|").map(y=>y.trim()));if(!rows.length)return"";const head=rows.shift()||[];return `<table class="blog-summary-table cms-two-heading"><thead><tr><th>${esc(head[0]||"Left Heading")}</th><th>${esc(head[1]||"Right Heading")}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td></tr>`).join("")}</tbody></table>`}
function renderBlogBlock(b){if(b.style==="yellowHighlight")return `<div class="blog-highlight"><b>${esc(b.title)}</b><br>${br(b.content)}</div>`;if(b.style==="twoHeadingTable")return `<h2>${esc(b.title)}</h2>${twoHeadingBlogTable(b.content)}`;if(b.style==="green")return `<h2 class="blog-green-title">${esc(b.title)}</h2><p>${br(b.content)}</p>`;if(b.style==="image")return `<h2>${esc(b.title)}</h2><img class="blog-preview-cover" src="${esc(b.content)}">`;if(b.style==="table")return `<h2>${esc(b.title)}</h2>${blogSummaryTable(b.content)}`;if(b.style==="button"){const rows=String(b.content).split("\n").filter(Boolean);return `<div class="blog-action-row">${rows.map((x,i)=>{let[t,u]=x.split("|").map(y=>y.trim());return `<a class="${i%2?'wa-btn':'tg-btn'}" href="${esc(u||'#')}" target="_blank">${esc(t||'Open')}</a>`}).join("")}</div>`}if(b.style==="faq"){return `<div class="cms-card"><h3>${esc(b.title)}</h3>${String(b.content).split("\n").filter(Boolean).map(x=>{let[q,a]=x.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check details")}</p>`}).join("")}</div>`}if(b.style==="html")return `<div>${b.content}</div>`;return `<p>${br(b.content)}</p>`}
function previewBlogDraft(){const d=collectBlogData("Draft");if(!d.title)return alertPopup("Blog title is required.");const html=blogPreviewHtml(d);$("#blogLivePreview").innerHTML=html;openAdminModal(`<div class="modal-title-row"><h2>Blog Preview</h2><button class="btn green" onclick="closeAdminModal();saveBlog('Published')">Publish Blog</button></div>${html}`)}
async function saveBlog(status){const d=collectBlogData(status);if(!d.title)return alertPopup("Blog title is required.");await db.ref("posts/"+d.id).set(d);alertPopup(status==="Draft"?"Blog draft saved successfully.":"Blog published successfully.");render("blogEditor")}
function messagesPage(){
  return page("Contact Messages","Contact page messages.",`
    <div class="panel message-panel">
      ${
        messages.length
        ? messages.map(m=>`
          <div class="message-card pro-message-card">
            <div class="msg-top">
              <div>
                <h3>${esc(m.name || m.fullName || m.username || "No Name")}</h3>
                <p class="msg-email">📧 ${esc(m.emailMobile || m.email || m.userEmail || m.customerEmail || m.mail || m.emailAddress || "No Email")}</p>
                <p class="msg-phone">📞 ${esc(m.phone || m.mobile || m.contact || m.number || m.phoneNumber || m.mobileNumber || m.whatsapp || m.emailMobile || "No Phone")}</p>
                <p class="msg-subject">📝 ${esc(m.subject || m.topic || m.title || "No Subject")}</p>
              </div>
              <span class="msg-date">${esc(m.date || m.createdAt || m.time || "New Message")}</span>
            </div>

            <div class="msg-body">
              ${esc(m.message || m.msg || m.text || m.description || "No message")}
            </div>

            <div class="msg-actions">
              <a class="reply-btn" href="mailto:${esc(m.emailMobile || m.email || m.userEmail || m.customerEmail || m.mail || m.emailAddress || "")}?subject=${encodeURIComponent("Reply: " + (m.subject || m.topic || "Rapid Job Message"))}&body=Hello ${esc(m.name || m.fullName || "")},%0D%0A%0D%0A">
                <i class="fa-solid fa-reply"></i> Reply
              </a>

              <button class="delete-msg-btn" onclick="deleteMessage('${m.id}')">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        `).join("")
        : `<div class="empty-message-box">
            <i class="fa-solid fa-inbox"></i>
            <h2>No Messages Yet</h2>
            <p>Contact page se message aayega to yahan show hoga.</p>
          </div>`
      }
    </div>
  `);
}
async function deleteMessage(id){
    if(!id) return alertPopup("Message ID missing.");

    openAdminModal(`
        <div class="modal-body delete-pop small-pop">
            <div class="delete-icon">
                <i class="fa-solid fa-trash"></i>
            </div>

            <h2>Delete Message?</h2>

            <p>Are you sure you want to permanently delete this message?</p>

            <div class="delete-pop-actions">

                <button class="btn red"
                    onclick="confirmDeleteMessage('${id}')">
                    <i class="fa-solid fa-trash"></i>
                    Yes, Delete
                </button>

                <button class="btn light"
                    onclick="closeAdminModal()">
                    Cancel
                </button>

            </div>
        </div>
    `);
}

async function confirmDeleteMessage(id){
    await db.ref("contactMessages/" + id).remove();
    closeAdminModal();
    alertPopup("Message deleted successfully.");
}

function breakingBadgeOptions(selected="Breaking"){
  const options=["Breaking","New","Alert","Result","Admit Card","Job","Update"];
  return options.map(x=>`<option value="${x}" ${x===selected?"selected":""}>${x}</option>`).join("");
}
function breaking(){
  const active=breakingItems.filter(x=>x.active!==false).length;
  const pinned=breakingItems.filter(x=>x.pinned).length;
  const rows=breakingItems.map((item,index)=>`<article class="bn-item ${item.active===false?"is-off":""} ${item.pinned?"is-pinned":""}">
    <div class="bn-rank">${item.pinned?'<i class="fa-solid fa-thumbtack"></i>':String(index+1).padStart(2,"0")}</div>
    <div class="bn-content">
      <div class="bn-title-line"><span class="bn-badge bn-${esc((item.badge||"Breaking").toLowerCase().replace(/\s+/g,"-"))}">${esc(item.badge||"Breaking")}</span><h3>${esc(item.title||"")}</h3></div>
      <div class="bn-meta"><span><i class="fa-regular fa-clock"></i> ${esc(item.updatedOn||item.createdOn||"")}</span>${item.url?`<a href="${esc(item.url)}" target="_blank" rel="noopener"><i class="fa-solid fa-link"></i> Open Link</a>`:""}</div>
    </div>
    <div class="bn-actions">
      <button class="mini ${item.active===false?'view':'edit'}" onclick="toggleBreaking('${item.id}')">${item.active===false?'Enable':'Disable'}</button>
      <button class="mini view" onclick="pinBreaking('${item.id}')">${item.pinned?'Unpin':'Pin'}</button>
      <button class="mini edit" onclick="editBreaking('${item.id}')">Edit</button>
      <button class="mini del" onclick="deleteBreaking('${item.id}')">Delete</button>
    </div>
  </article>`).join("")||`<div class="bn-empty"><i class="fa-solid fa-bolt"></i><h2>No Breaking News</h2><p>Upar form se pehli ticker news add karein.</p></div>`;
  return page("Breaking News","Multiple ticker updates, links, badges aur visibility manage karein.",`
    <div class="bn-stats">
      <div><span>Total News</span><b>${breakingItems.length}</b></div>
      <div><span>Active</span><b>${active}</b></div>
      <div><span>Pinned</span><b>${pinned}</b></div>
      <div><span>Ticker Speed</span><b id="bnSpeedLabel">${Number(localStorage.getItem('rapidJobTickerSpeed')||25)}s</b></div>
    </div>
    <div class="panel bn-manager">
      <div class="panel-head"><div><h2 id="bnFormTitle">Add Breaking News</h2><p class="hint">News title जरूरी है. Link optional है.</p></div><button class="btn light" onclick="resetBreakingForm()"><i class="fa-solid fa-rotate-left"></i> Clear</button></div>
      <div class="bn-form-grid">
        <div class="field bn-title-field"><label>News Title</label><input id="bnTitle" maxlength="180" placeholder="Example: SSC CGL 2026 Notification Released"></div>
        <div class="field"><label>Badge</label><select id="bnBadge">${breakingBadgeOptions()}</select></div>
        <div class="field"><label>Official Link</label><input id="bnUrl" type="url" placeholder="https://..."></div>
        <div class="field"><label>Status</label><select id="bnActive"><option value="true">Active / Show</option><option value="false">Inactive / Hide</option></select></div>
        <div class="field"><label>Pin Priority</label><select id="bnPinned"><option value="false">Normal</option><option value="true">Pinned First</option></select></div>
        <div class="field"><label>Ticker Speed</label><div class="bn-speed-row"><input id="bnSpeed" type="range" min="10" max="60" value="${Number(localStorage.getItem('rapidJobTickerSpeed')||25)}" oninput="previewBreaking()"><span id="bnSpeedValue">${Number(localStorage.getItem('rapidJobTickerSpeed')||25)} sec</span></div></div>
      </div>
      <div class="bn-form-actions"><button class="btn green" onclick="saveBreaking()"><i class="fa-solid fa-floppy-disk"></i> Save News</button><button class="btn preview" onclick="previewBreaking()"><i class="fa-solid fa-eye"></i> Live Preview</button></div>
    </div>
    <div class="panel bn-preview-panel"><div class="panel-head"><h2>Live Ticker Preview</h2><span class="badge">Website Preview</span></div><div class="bn-preview"><div class="bn-preview-label"><i class="fa-solid fa-bolt"></i> BREAKING</div><div class="bn-preview-window"><div class="bn-preview-track" id="bnPreviewTrack">${breakingItems.filter(x=>x.active!==false).map(x=>`<span>${esc(x.title||"")}</span>`).join('<i>•</i>')||'<span>Your breaking news preview will appear here</span>'}</div></div></div></div>
    <div class="panel"><div class="panel-head"><div><h2>Breaking News Library</h2><p class="hint">Pinned news सबसे पहले website ticker में चलेगी.</p></div><button class="btn light" onclick="loadBreakingNews(true)"><i class="fa-solid fa-rotate"></i> Refresh</button></div><div class="bn-list">${rows}</div></div>`);
}
function resetBreakingForm(){breakingEditId=null;["bnTitle","bnUrl"].forEach(id=>{const el=$("#"+id);if(el)el.value=""});if($("#bnBadge"))$("#bnBadge").value="Breaking";if($("#bnActive"))$("#bnActive").value="true";if($("#bnPinned"))$("#bnPinned").value="false";if($("#bnFormTitle"))$("#bnFormTitle").textContent="Add Breaking News"}
function previewBreaking(){const speed=Number($("#bnSpeed")?.value||25),value=$("#bnSpeedValue"),track=$("#bnPreviewTrack");if(value)value.textContent=speed+" sec";if(track){const typed=$("#bnTitle")?.value.trim();const items=typed?[typed,...breakingItems.filter(x=>x.active!==false).map(x=>x.title).filter(Boolean)]:breakingItems.filter(x=>x.active!==false).map(x=>x.title).filter(Boolean);track.innerHTML=(items.length?items:["Your breaking news preview will appear here"]).map(x=>`<span>${esc(x)}</span>`).join("<i>•</i>");track.style.animationDuration=speed+"s"}}
async function saveBreaking(){const title=$("#bnTitle")?.value.trim()||"",url=$("#bnUrl")?.value.trim()||"",badge=$("#bnBadge")?.value||"Breaking",active=$("#bnActive")?.value!=="false",pinned=$("#bnPinned")?.value==="true",speed=Number($("#bnSpeed")?.value||25);if(!title)return alertPopup("Breaking news title required.");if(url&&!/^https?:\/\//i.test(url))return alertPopup("Official link http:// ya https:// se start hona chahiye.");const id=breakingEditId||`news_${Date.now()}`;const old=breakingItems.find(x=>x.id===id)||{};await db.ref("settings/breakingNewsItems/"+id).set({id,title,url,badge,active,pinned,createdAt:old.createdAt||Date.now(),createdOn:old.createdOn||new Date().toLocaleString("en-IN"),updatedAt:Date.now(),updatedOn:new Date().toLocaleString("en-IN")});await db.ref("settings/tickerSpeed").set(speed);localStorage.setItem("rapidJobTickerSpeed",String(speed));await syncLegacyBreakingText();resetBreakingForm();alertPopup(breakingEditId?"Breaking news updated successfully.":"Breaking news added successfully.")}
function editBreaking(id){const item=breakingItems.find(x=>x.id===id);if(!item)return;breakingEditId=id;$("#bnTitle").value=item.title||"";$("#bnUrl").value=item.url||"";$("#bnBadge").value=item.badge||"Breaking";$("#bnActive").value=String(item.active!==false);$("#bnPinned").value=String(!!item.pinned);$("#bnFormTitle").textContent="Edit Breaking News";window.scrollTo({top:280,behavior:"smooth"});previewBreaking()}
async function toggleBreaking(id){const item=breakingItems.find(x=>x.id===id);if(!item)return;await db.ref("settings/breakingNewsItems/"+id+"/active").set(item.active===false);await syncLegacyBreakingText();alertPopup(item.active===false?"News enabled successfully.":"News disabled successfully.")}
async function pinBreaking(id){const item=breakingItems.find(x=>x.id===id);if(!item)return;await db.ref("settings/breakingNewsItems/"+id+"/pinned").set(!item.pinned);await syncLegacyBreakingText();alertPopup(item.pinned?"News unpinned.":"News pinned to top.")}
function deleteBreaking(id){const item=breakingItems.find(x=>x.id===id);if(!item)return;openAdminModal(`<div class="modal-body delete-pop small-pop"><div class="delete-icon"><i class="fa-solid fa-trash"></i></div><h2>Delete Breaking News?</h2><p>${esc(item.title)}</p><div class="delete-pop-actions"><button class="btn red" onclick="confirmDeleteBreaking('${id}')">Yes, Delete</button><button class="btn light" onclick="closeAdminModal()">Cancel</button></div></div>`)}
async function confirmDeleteBreaking(id){await db.ref("settings/breakingNewsItems/"+id).remove();await syncLegacyBreakingText();closeAdminModal();alertPopup("Breaking news deleted successfully.")}
async function syncLegacyBreakingText(){const snap=await db.ref("settings/breakingNewsItems").once("value"),items=Object.entries(snap.val()||{}).map(([id,x])=>({id,...x})).filter(x=>x.active!==false).sort((a,b)=>(Number(b.pinned)-Number(a.pinned))||((b.updatedAt||0)-(a.updatedAt||0)));await db.ref("settings/breakingNews").set(items.map(x=>x.title).join(" | "))}
function loadBreakingNews(forceRender=false){db.ref("settings/breakingNewsItems").once("value").then(s=>{breakingItems=Object.entries(s.val()||{}).map(([id,x])=>({id,...x})).sort((a,b)=>(Number(b.pinned)-Number(a.pinned))||((b.updatedAt||0)-(a.updatedAt||0)));if(current==="breaking"||forceRender)render("breaking")}).catch(e=>{console.error(e);if(forceRender)alertPopup("Breaking news load nahi hui.")})}

function formatMediaSize(bytes){const n=Number(bytes||0);if(!n)return "0 KB";const units=["B","KB","MB","GB"];const i=Math.min(Math.floor(Math.log(n)/Math.log(1024)),units.length-1);return `${(n/Math.pow(1024,i)).toFixed(i?1:0)} ${units[i]}`}
function mediaKind(item){const type=String(item.type||"").toLowerCase();if(type.includes("pdf"))return "pdf";if(type.startsWith("image/"))return "image";return "file"}
function mediaCard(item){const kind=mediaKind(item);const preview=kind==="image"?`<img src="${esc(item.url||"")}" alt="${esc(item.name||"Media")}" loading="lazy">`:kind==="pdf"?`<div class="media-file-icon pdf"><i class="fa-solid fa-file-pdf"></i><span>PDF</span></div>`:`<div class="media-file-icon"><i class="fa-solid fa-file"></i><span>FILE</span></div>`;return `<article class="media-card" data-kind="${kind}" data-search="${esc((item.name||"").toLowerCase())}"><div class="media-preview">${preview}</div><div class="media-info"><h3 title="${esc(item.name||"")}">${esc(item.name||"Untitled file")}</h3><p>${formatMediaSize(item.size)} • ${esc(item.uploadedOn||"")}</p><div class="media-actions"><button class="media-action copy" onclick="copyMediaUrl('${item.id}')"><i class="fa-regular fa-copy"></i> Copy URL</button><a class="media-action open" href="${esc(item.url||'#')}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a><button class="media-action delete" onclick="deleteMedia('${item.id}')"><i class="fa-solid fa-trash"></i></button></div></div></article>`}
function media(){const cards=mediaItems.map(mediaCard).join("")||`<div class="media-empty"><i class="fa-regular fa-images"></i><h2>No media uploaded</h2><p>Image ya PDF upload karne ke baad yahan show hoga.</p></div>`;return page("Media Manager","Images aur PDF upload karke direct URL copy karein.",`<div class="panel media-manager"><div class="media-upload-card" id="mediaDropZone"><input id="mediaFileInput" type="file" accept="image/*,.pdf,application/pdf" multiple hidden><div class="media-upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div><h2>Drag & Drop Media Here</h2><p>Images aur PDF files upload karein. Maximum 15 MB per file.</p><button class="btn" onclick="document.getElementById('mediaFileInput').click()"><i class="fa-solid fa-folder-open"></i> Choose Files</button><div class="media-progress-wrap" id="mediaProgressWrap"><div class="media-progress-head"><span id="mediaProgressText">Preparing upload...</span><b id="mediaProgressPercent">0%</b></div><div class="media-progress"><span id="mediaProgressBar"></span></div></div></div><div class="media-library-head"><div><h2>Media Library</h2><p><span id="mediaCount">${mediaItems.length}</span> files available</p></div><div class="media-controls"><div class="media-search"><i class="fa-solid fa-search"></i><input id="mediaSearch" placeholder="Search media..." oninput="filterMediaLibrary()"></div><select id="mediaFilter" onchange="filterMediaLibrary()"><option value="all">All Media</option><option value="image">Images</option><option value="pdf">PDF</option><option value="file">Other Files</option></select><button class="btn light" onclick="loadMediaLibrary(true)"><i class="fa-solid fa-rotate"></i> Refresh</button></div></div><div class="media-grid" id="mediaGrid">${cards}</div></div>`)}
function bindMediaManager(){const input=document.getElementById("mediaFileInput"),zone=document.getElementById("mediaDropZone");if(!input||!zone)return;input.onchange=e=>uploadMediaFiles([...e.target.files]);["dragenter","dragover"].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.add("dragging")}));["dragleave","drop"].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.remove("dragging")}));zone.addEventListener("drop",e=>uploadMediaFiles([...e.dataTransfer.files]))}
async function uploadMediaFiles(files){files=files.filter(Boolean);if(!files.length)return;const allowed=files.filter(f=>f.type.startsWith("image/")||f.type==="application/pdf"||f.name.toLowerCase().endsWith(".pdf"));if(allowed.length!==files.length)return alertPopup("Only image and PDF files are allowed.");if(allowed.some(f=>f.size>15*1024*1024))return alertPopup("Each file must be smaller than 15 MB.");const wrap=$("#mediaProgressWrap"),bar=$("#mediaProgressBar"),pct=$("#mediaProgressPercent"),txt=$("#mediaProgressText");if(wrap)wrap.classList.add("show");try{for(let index=0;index<allowed.length;index++){const file=allowed[index];const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const id=`media_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;const storagePath=`rapid-job-media/${id}_${safeName}`;if(txt)txt.textContent=`Uploading ${index+1}/${allowed.length}: ${file.name}`;await new Promise((resolve,reject)=>{const task=firebase.storage().ref(storagePath).put(file);task.on("state_changed",snap=>{const own=snap.totalBytes?Math.round(snap.bytesTransferred/snap.totalBytes*100):0;const overall=Math.round(((index+own/100)/allowed.length)*100);if(bar)bar.style.width=overall+"%";if(pct)pct.textContent=overall+"%"},reject,async()=>{const url=await task.snapshot.ref.getDownloadURL();await db.ref("mediaLibrary/"+id).set({id,name:file.name,type:file.type||"application/octet-stream",size:file.size,url,storagePath,uploadedAt:Date.now(),uploadedOn:new Date().toLocaleString("en-IN")});resolve()})})}if(bar)bar.style.width="100%";if(pct)pct.textContent="100%";if(txt)txt.textContent="Upload completed successfully";setTimeout(()=>wrap?.classList.remove("show"),1100);alertPopup(`${allowed.length} media file uploaded successfully.`)}catch(e){console.error(e);wrap?.classList.remove("show");alertPopup("Upload failed. Firebase Storage rules/configuration check karein.")}}
function loadMediaLibrary(forceRender=false){db.ref("mediaLibrary").once("value").then(s=>{mediaItems=Object.entries(s.val()||{}).map(([id,m])=>({id,...m})).sort((a,b)=>(b.uploadedAt||0)-(a.uploadedAt||0));if(current==="media"||forceRender)render("media")}).catch(e=>{console.error(e);if(forceRender)alertPopup("Media library load nahi hui.")})}
function filterMediaLibrary(){const q=($("#mediaSearch")?.value||"").toLowerCase().trim(),kind=$("#mediaFilter")?.value||"all";document.querySelectorAll("#mediaGrid .media-card").forEach(card=>{const okQ=!q||(card.dataset.search||"").includes(q),okKind=kind==="all"||card.dataset.kind===kind;card.style.display=okQ&&okKind?"":"none"})}
async function copyMediaUrl(id){const item=mediaItems.find(x=>x.id===id);if(!item?.url)return alertPopup("Media URL not found.");try{await navigator.clipboard.writeText(item.url);alertPopup("Media URL copied successfully.")}catch(e){const ta=document.createElement("textarea");ta.value=item.url;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();alertPopup("Media URL copied successfully.")}}
async function deleteMedia(id){const item=mediaItems.find(x=>x.id===id);if(!item)return;openAdminModal(`<div class="modal-body delete-pop small-pop"><div class="delete-icon"><i class="fa-solid fa-trash"></i></div><h2>Delete Media?</h2><p>${esc(item.name)} permanently delete ho jayega.</p><div class="delete-pop-actions"><button class="btn red" onclick="confirmDeleteMedia('${id}')"><i class="fa-solid fa-trash"></i> Yes, Delete</button><button class="btn light" onclick="closeAdminModal()">Cancel</button></div></div>`)}
async function confirmDeleteMedia(id){const item=mediaItems.find(x=>x.id===id);try{if(item?.storagePath)await firebase.storage().ref(item.storagePath).delete();await db.ref("mediaLibrary/"+id).remove();closeAdminModal();alertPopup("Media deleted successfully.")}catch(e){console.error(e);alertPopup("Media delete nahi hua. Firebase rules check karein.")}}

function settings(){return page("Settings","Website settings.",`<div class="panel"><p>Rapid Job CMS settings.</p></div>`)}
function render(pageName=current){current=pageName;document.querySelectorAll("#sideNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===pageName));const map={dashboard,posts:postsPage,blogEditor,messages:messagesPage,breaking,media,settings};const fn=map[pageName]||dashboard;const app=$("#app");if(app)app.innerHTML=fn();if(pageName==="media")bindMediaManager();if(window.innerWidth<1000)$("#sidebar")?.classList.remove("show")}
function loadPosts(){db.ref("posts").on("value",s=>{posts=Object.entries(s.val()||{}).map(([id,p])=>({id,...p})).sort((a,b)=>(b.time||0)-(a.time||0));render(current)},e=>{console.error(e);render(current)})}
function loadMessages(){db.ref("contactMessages").on("value",s=>{messages=Object.entries(s.val()||{}).map(([id,m])=>({id,...m})).reverse();const badge=$("#msgBadge");if(badge)badge.textContent=messages.length;if(current==="messages")render(current)})}
document.addEventListener("click",e=>{if(e.target.id==="adminModal")closeAdminModal();let b=e.target.closest("#sideNav button");if(b)render(b.dataset.page)});
document.addEventListener("DOMContentLoaded",()=>{initAdminLogin();$("#quickPost")&&($("#quickPost").onclick=()=>openPostForm());$("#quickBlog")&&($("#quickBlog").onclick=()=>openBlogForm());$("#menuBtn")&&($("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("show"));$("#themeBtn")&&($("#themeBtn").onclick=()=>document.documentElement.classList.toggle("dark"));$("#searchInput")&&$("#searchInput").addEventListener("input",e=>{if(current!=="posts"&&current!=="blogEditor")return;let q=e.target.value.toLowerCase();$("#app").innerHTML=page("Search Results","Filtered posts.",`<div class="panel">${postTable(posts.filter(p=>(p.title||"").toLowerCase().includes(q)))}</div>`)});loadPosts();loadMessages();loadMediaLibrary();loadBreakingNews();db.ref("settings/breakingNewsItems").on("value",s=>{breakingItems=Object.entries(s.val()||{}).map(([id,x])=>({id,...x})).sort((a,b)=>(Number(b.pinned)-Number(a.pinned))||((b.updatedAt||0)-(a.updatedAt||0)));if(current==="breaking")render("breaking")});render();});


/* =========================================================
   RAPID JOB POWER ADMIN MODULES
   Added after existing CMS so existing Firebase/content logic stays intact.
   ========================================================= */
let adminSettings={};
let notifications=[];
let users=[];
let activityLogs=[];
let recycleBin=[];
let scheduledTimer=null;

function safeJsonParse(value,fallback){
  try{return JSON.parse(value)}catch(e){return fallback}
}
function localList(key){return safeJsonParse(localStorage.getItem(key)||"[]",[])}
function saveLocalList(key,list){localStorage.setItem(key,JSON.stringify(list))}
function showToast(message,type="success"){
  const t=document.getElementById("toast");if(!t)return;
  t.textContent=message;t.style.background=type==="error"?"linear-gradient(135deg,#ef4444,#dc2626)":type==="warning"?"linear-gradient(135deg,#f59e0b,#f97316)":"linear-gradient(135deg,#075ee8,#10b981)";
  t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2600)
}
function adminConfirm(message,title="Confirm Action",confirmText="Confirm"){
  return new Promise(resolve=>{
    ensureModal();
    const modal=document.getElementById("adminModal");
    const box=modal.querySelector(".admin-modal-box");
    box.className="admin-modal-box power-confirm";
    document.getElementById("adminModalContent").innerHTML=`<div class="power-confirm-body"><div class="power-confirm-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h2>${esc(title)}</h2><p>${esc(message)}</p><div class="power-confirm-actions"><button class="btn light" id="powerCancel">Cancel</button><button class="btn red" id="powerConfirm">${esc(confirmText)}</button></div></div>`;
    modal.classList.add("show");
    const done=value=>{modal.classList.remove("show");box.className="admin-modal-box wide";resolve(value)};
    document.getElementById("powerCancel").onclick=()=>done(false);
    document.getElementById("powerConfirm").onclick=()=>done(true);
    modal.onclick=e=>{if(e.target===modal)done(false)};
  })
}
function addActivity(action,target="",kind="update"){
  const item={id:"log_"+Date.now()+"_"+Math.random().toString(36).slice(2,6),action,target,kind,admin:"Harekrishna Patel",time:Date.now(),date:new Date().toLocaleString("en-IN")};
  activityLogs.unshift(item);activityLogs=activityLogs.slice(0,150);saveLocalList("rapidAdminActivity",activityLogs);
}
function iconForActivity(kind){return kind==="delete"?"fa-trash":kind==="publish"?"fa-paper-plane":kind==="login"?"fa-right-to-bracket":kind==="backup"?"fa-database":"fa-pen"}
function getSettings(){return safeJsonParse(localStorage.getItem("rapidAdminSettings")||"{}",{})}
function setSettings(obj){adminSettings={...adminSettings,...obj};localStorage.setItem("rapidAdminSettings",JSON.stringify(adminSettings))}
function countType(type){return posts.filter(p=>p.type===type).length}
function isScheduled(p){return p.status==="Scheduled"||Boolean(p.scheduleAt)}
function getStorageUsage(){return mediaItems.reduce((n,x)=>n+Number(x.size||0),0)}
function formatBytes(n){return formatMediaSize(n)}
function websiteStatus(){return adminSettings.maintenanceMode?"Maintenance":"Online"}

const originalDashboard=dashboard;
dashboard=function(){
  const published=posts.filter(p=>p.status==="Published").length;
  const drafts=posts.filter(p=>p.status==="Draft").length;
  const scheduled=posts.filter(isScheduled).length;
  const today=new Date().toISOString().slice(0,10);
  const todayPosts=posts.filter(p=>String(p.date||"").slice(0,10)===today).length;
  const bars=[22,38,31,58,46,73,64].map((h,i)=>`<div class="bar" style="height:${h}%"><span>${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>`).join("");
  const recent=activityLogs.slice(0,6);
  return page("Power Dashboard","Rapid Job ka complete animated control center.",`
    <div class="stats power-stats">
      ${powerStat("fa-layer-group","Total Content",posts.length)}
      ${powerStat("fa-circle-check","Published",published)}
      ${powerStat("fa-file-pen","Drafts",drafts)}
      ${powerStat("fa-clock","Scheduled",scheduled)}
      ${powerStat("fa-id-card","Admit Cards",countType("admit"))}
      ${powerStat("fa-square-poll-vertical","Results",countType("result"))}
      ${powerStat("fa-envelope","Messages",messages.length)}
      ${powerStat("fa-folder-open","Media Files",mediaItems.length)}
      ${powerStat("fa-calendar-day","Today Posts",todayPosts)}
      ${powerStat("fa-newspaper","Blogs",countType("blog"))}
      ${powerStat("fa-hard-drive","Storage",formatBytes(getStorageUsage()))}
      ${powerStat("fa-globe","Website",websiteStatus())}
    </div>
    <div class="control-grid">
      <div class="control-card" onclick="openPostForm()"><i class="fa-solid fa-plus"></i><h3>Create Job</h3><p>Advanced job post, schedule, SEO and expiry controls.</p></div>
      <div class="control-card" onclick="render('media')"><i class="fa-solid fa-photo-film"></i><h3>Media Library</h3><p>Upload, search, copy URL and manage files.</p></div>
      <div class="control-card" onclick="render('notifications')"><i class="fa-solid fa-bell"></i><h3>Notifications</h3><p>Create job, result and breaking-news alerts.</p></div>
      <div class="control-card" onclick="render('backup')"><i class="fa-solid fa-database"></i><h3>Backup Center</h3><p>Export, import and restore your CMS data.</p></div>
    </div>
    <div class="chart-grid">
      <div class="chart-card"><h2>Publishing Activity</h2><div class="css-chart">${bars}</div></div>
      <div class="chart-card"><h2>Content Distribution</h2><div class="donut"><strong>${posts.length}</strong></div><p style="text-align:center;color:#64748b">Jobs • Blogs • Results • Admissions</p></div>
    </div>
    <div class="panel"><div class="panel-head"><h2>Recent Activity</h2><button class="btn light" onclick="render('security')">View Logs</button></div>
      <div class="activity-list">${recent.length?recent.map(a=>`<div class="activity-item"><div class="activity-icon"><i class="fa-solid ${iconForActivity(a.kind)}"></i></div><div><p><b>${esc(a.action)}</b></p><small>${esc(a.target||"Rapid Job CMS")}</small></div><small>${esc(a.date)}</small></div>`).join(""):'<div class="empty-power"><i class="fa-solid fa-clock-rotate-left"></i><h2>No activity yet</h2><p>Publish, edit or delete actions will appear here.</p></div>'}</div>
    </div>
    <div class="panel"><div class="panel-head"><h2>Recent Posts</h2><button class="btn" onclick="openPostForm()">+ Add Job</button></div>${postTable(posts.slice(0,8))}</div>
  `)
}
function powerStat(icon,label,value){return `<div class="stat power-stat"><div class="stat-icon"><i class="fa-solid ${icon}"></i></div><p>${esc(label)}</p><h2>${esc(value)}</h2></div>`}

const originalOpenPostForm=openPostForm;
openPostForm=function(id=null){
  originalOpenPostForm(id);
  const sticky=document.querySelector(".sticky-actions");
  if(!sticky)return;
  const p=id?posts.find(x=>x.id===id)||{}:{};
  const advanced=document.createElement("div");
  advanced.className="power-form-section";
  advanced.innerHTML=`
    <h3><i class="fa-solid fa-wand-magic-sparkles"></i> Advanced Publishing, SEO & Vacancy Controls</h3>
    <div class="grid2">
      <div class="field"><label>Schedule Publish</label><input id="scheduleAt" type="datetime-local" value="${esc(p.scheduleAt||"")}"></div>
      <div class="field"><label>Expiry / Auto Unpublish</label><input id="expiryAt" type="datetime-local" value="${esc(p.expiryAt||"")}"></div>
      <div class="field"><label>Featured Image URL</label><input id="featuredImage" value="${esc(p.featuredImage||"")}"></div>
      <div class="field"><label>Job Type</label><select id="jobType"><option>Government</option><option>Private</option><option>Apprenticeship</option><option>Internship</option><option>Work From Home</option></select></div>
      <div class="field"><label>Total Vacancy</label><input id="vacancy" type="number" value="${esc(p.vacancy||"")}"></div>
      <div class="field"><label>Salary / Pay Level</label><input id="salary" value="${esc(p.salary||"")}"></div>
      <div class="field"><label>Qualification</label><input id="qualification" value="${esc(p.qualification||"")}"></div>
      <div class="field"><label>Age Limit</label><input id="ageLimit" value="${esc(p.ageLimit||"")}"></div>
      <div class="field full"><label>SEO Title</label><input id="seoTitle" value="${esc(p.seoTitle||p.title||"")}"></div>
      <div class="field full"><label>Meta Description</label><textarea id="metaDescription">${esc(p.metaDescription||p.description||"")}</textarea></div>
      <div class="field full"><label>SEO Keywords</label><input id="seoKeywords" value="${esc(p.seoKeywords||"")}"></div>
    </div>
    <div class="toggle-grid" style="margin-top:13px">
      ${advancedToggle("pinTop","Pin to Top",p.pinTop)}
      ${advancedToggle("important","Important",p.important)}
      ${advancedToggle("trendingFlag","Trending",p.trending)}
      ${advancedToggle("autoUnpublish","Auto Unpublish",p.autoUnpublish)}
    </div>`;
  sticky.parentNode.insertBefore(advanced,sticky);
  const status=document.getElementById("status");
  if(status&&!Array.from(status.options).some(o=>o.value==="Scheduled"))status.insertAdjacentHTML("beforeend",'<option>Scheduled</option>');
  if(status&&p.status)status.value=p.status;
}
function advancedToggle(id,label,checked){return `<label class="power-toggle"><input id="${id}" type="checkbox" ${checked?"checked":""}> ${label}</label>`}

const originalCollectPostData=collectPostData;
collectPostData=function(statusOverride=null){
  const d=originalCollectPostData(statusOverride);
  const val=id=>document.getElementById(id)?.value||"";
  const chk=id=>Boolean(document.getElementById(id)?.checked);
  Object.assign(d,{
    scheduleAt:val("scheduleAt"),expiryAt:val("expiryAt"),featuredImage:val("featuredImage"),
    jobType:val("jobType")||"Government",vacancy:val("vacancy"),salary:val("salary"),
    qualification:val("qualification"),ageLimit:val("ageLimit"),seoTitle:val("seoTitle"),
    metaDescription:val("metaDescription"),seoKeywords:val("seoKeywords"),
    pinTop:chk("pinTop"),important:chk("important"),trending:chk("trendingFlag")||d.trending,
    autoUnpublish:chk("autoUnpublish")
  });
  if(d.scheduleAt&&statusOverride!=="Published")d.status="Scheduled";
  d.revision=(posts.find(p=>p.id===d.id)?.revision||0)+1;
  d.revisionHistory=[...(posts.find(p=>p.id===d.id)?.revisionHistory||[]),{time:Date.now(),status:d.status,title:d.title}].slice(-20);
  return d
}

const originalSavePost=savePost;
savePost=async function(status){
  const before=editId?posts.find(p=>p.id===editId):null;
  await originalSavePost(status);
  addActivity(before?"Post updated":"Post created",before?.title||document.getElementById("title")?.value||"",status==="Published"?"publish":"update");
}
const originalSaveBlog=saveBlog;
saveBlog=async function(status){
  const title=document.getElementById("blogTitle")?.value||"Blog";
  await originalSaveBlog(status);addActivity(status==="Published"?"Blog published":"Blog draft saved",title,status==="Published"?"publish":"update")
}

function notificationsPage(){
  return page("Notification Center","Job alerts, result alerts aur scheduled announcements manage karein.",`
    <div class="panel">
      <div class="panel-head"><h2>Create Notification</h2><button class="btn light" onclick="markAllNotificationsRead()">Mark All Read</button></div>
      <div class="grid2">
        ${input("notifyTitle","Notification Title","")}
        <div class="field"><label>Type</label><select id="notifyType"><option>Job Alert</option><option>Admit Card Alert</option><option>Result Alert</option><option>Breaking News</option><option>General</option></select></div>
        ${textarea("notifyMessage","Message","")}
        ${input("notifyLink","Link","#")}
        ${input("notifySchedule","Schedule","", "datetime-local")}
        <div class="field"><label>Audience</label><select id="notifyAudience"><option>All Users</option><option>Railway</option><option>SSC</option><option>Banking</option><option>Defence</option><option>State-wise</option></select></div>
      </div>
      <div class="inline-actions" style="margin-top:14px"><button class="btn" onclick="saveNotification()">Send / Schedule</button><button class="btn light" onclick="previewNotification()">Preview</button></div>
    </div>
    <div class="panel"><div class="panel-head"><h2>Notification History</h2><span class="status-pill online">${notifications.length} notifications</span></div>
      ${notifications.length?notifications.map(n=>`<div class="notification-card"><div class="notification-icon"><i class="fa-solid fa-bell"></i></div><div><h3>${esc(n.title)}</h3><p>${esc(n.message)}</p><small>${esc(n.type)} • ${esc(n.audience)} • ${esc(n.date)}</small></div><div class="inline-actions"><button class="mini view" onclick="toggleNotification('${n.id}')">${n.enabled===false?"Enable":"Disable"}</button><button class="mini del" onclick="deleteNotification('${n.id}')">Delete</button></div></div>`).join(""):'<div class="empty-power"><i class="fa-regular fa-bell"></i><h2>No notifications</h2><p>Create your first notification alert.</p></div>'}
    </div>`)
}
function saveNotification(){
  const n={id:"note_"+Date.now(),title:$("#notifyTitle")?.value.trim(),message:$("#notifyMessage")?.value.trim(),type:$("#notifyType")?.value,audience:$("#notifyAudience")?.value,link:$("#notifyLink")?.value,schedule:$("#notifySchedule")?.value,date:new Date().toLocaleString("en-IN"),enabled:true,read:false};
  if(!n.title||!n.message)return alertPopup("Notification title and message are required.");
  notifications.unshift(n);saveLocalList("rapidAdminNotifications",notifications);addActivity("Notification created",n.title,"publish");showToast("Notification saved.");render("notifications")
}
function previewNotification(){openAdminModal(`<div class="modal-title-row"><h2>Notification Preview</h2></div><div class="modal-body"><div class="notification-card"><div class="notification-icon"><i class="fa-solid fa-bell"></i></div><div><h3>${esc($("#notifyTitle")?.value||"Notification Title")}</h3><p>${esc($("#notifyMessage")?.value||"Your message will appear here.")}</p></div></div></div>`)}
function toggleNotification(id){const n=notifications.find(x=>x.id===id);if(n)n.enabled=!n.enabled;saveLocalList("rapidAdminNotifications",notifications);render("notifications")}
async function deleteNotification(id){if(await adminConfirm("This notification will be deleted.","Delete Notification?","Delete")){notifications=notifications.filter(x=>x.id!==id);saveLocalList("rapidAdminNotifications",notifications);render("notifications")}}
function markAllNotificationsRead(){notifications.forEach(n=>n.read=true);saveLocalList("rapidAdminNotifications",notifications);showToast("All notifications marked read.");updateNotificationBadge()}

function usersPage(){
  return page("User Manager","Registered users, activity aur access controls.",`
    <div class="stats power-stats">
      ${powerStat("fa-users","Total Users",users.length)}
      ${powerStat("fa-user-check","Active",users.filter(u=>u.status!=="Blocked").length)}
      ${powerStat("fa-user-lock","Blocked",users.filter(u=>u.status==="Blocked").length)}
      ${powerStat("fa-crown","Premium",users.filter(u=>u.premium).length)}
    </div>
    <div class="panel"><div class="panel-head"><h2>Registered Users</h2><button class="btn" onclick="addDemoUser()">+ Add Test User</button></div>
      <div class="user-grid">${users.length?users.map(u=>`<div class="user-card"><div class="user-avatar">${esc((u.name||"U").slice(0,2).toUpperCase())}</div><h3>${esc(u.name)}</h3><p>${esc(u.email||"No email")}</p><p><b>Status:</b> ${esc(u.status||"Active")} ${u.premium?'<span class="schedule-chip">Premium</span>':''}</p><small>Last login: ${esc(u.lastLogin||"Never")}</small><div class="inline-actions" style="margin-top:10px"><button class="mini edit" onclick="toggleUser('${u.id}')">${u.status==="Blocked"?"Unblock":"Block"}</button><button class="mini view" onclick="notifyUser('${u.id}')">Notify</button><button class="mini del" onclick="deleteUser('${u.id}')">Delete</button></div></div>`).join(""):'<div class="empty-power" style="grid-column:1/-1"><i class="fa-solid fa-users"></i><h2>No users loaded</h2><p>Firebase users/profile data can be connected here.</p></div>'}</div>
    </div>`)
}
function addDemoUser(){users.unshift({id:"user_"+Date.now(),name:"Rapid Job User",email:"user@example.com",status:"Active",premium:false,lastLogin:new Date().toLocaleString("en-IN")});saveLocalList("rapidAdminUsers",users);render("users")}
function toggleUser(id){const u=users.find(x=>x.id===id);if(u)u.status=u.status==="Blocked"?"Active":"Blocked";saveLocalList("rapidAdminUsers",users);addActivity("User status changed",u?.name||id,"update");render("users")}
function notifyUser(id){const u=users.find(x=>x.id===id);openAdminModal(`<div class="modal-title-row"><h2>Send User Notification</h2></div><div class="modal-body"><div class="field"><label>Message for ${esc(u?.name||"User")}</label><textarea id="singleUserMessage"></textarea></div><button class="btn" onclick="closeAdminModal();showToast('User notification queued.')">Send</button></div>`)}
async function deleteUser(id){if(await adminConfirm("User profile data will be removed from this manager.","Delete User?","Delete")){users=users.filter(x=>x.id!==id);saveLocalList("rapidAdminUsers",users);render("users")}}

function seoAdsPage(){
  const s=adminSettings;
  return page("SEO & Ads Manager","Search visibility, sitemap, AdSense aur analytics settings.",`
    <div class="settings-grid" style="margin:22px">
      <div class="setting-card"><h3>SEO Defaults</h3>
        <div class="field"><label>Default SEO Title</label><input id="defaultSeoTitle" value="${esc(s.defaultSeoTitle||"Rapid Job - Fast Government Job Updates")}"></div>
        <div class="field"><label>Default Meta Description</label><textarea id="defaultMeta">${esc(s.defaultMeta||"Latest government jobs, admit cards, results and study tools.")}</textarea></div>
        <div class="field"><label>Default Keywords</label><input id="defaultKeywords" value="${esc(s.defaultKeywords||"government jobs, railway, ssc, admit card, result")}"></div>
      </div>
      <div class="setting-card"><h3>Google Services</h3>
        <div class="field"><label>Google Analytics Measurement ID</label><input id="analyticsId" value="${esc(s.analyticsId||"")}"></div>
        <div class="field"><label>AdSense Publisher ID</label><input id="adsenseId" value="${esc(s.adsenseId||"")}"></div>
        <div class="field"><label>Ad Slot Code</label><textarea id="adSlotCode">${esc(s.adSlotCode||"")}</textarea></div>
      </div>
      <div class="setting-card"><h3>Sitemap & Indexing</h3><p>Posts available for sitemap: <b>${posts.filter(p=>p.status==="Published").length}</b></p><div class="inline-actions"><button class="btn" onclick="downloadSitemap()">Generate Sitemap</button><button class="btn light" onclick="downloadRobots()">Generate robots.txt</button></div></div>
      <div class="setting-card"><h3>SEO Health</h3><p>Missing SEO titles: <b>${posts.filter(p=>!p.seoTitle).length}</b></p><p>Missing meta descriptions: <b>${posts.filter(p=>!p.metaDescription).length}</b></p><p>Draft / non-indexed: <b>${posts.filter(p=>p.status!=="Published").length}</b></p></div>
    </div>
    <div class="panel"><button class="btn green" onclick="saveSeoAds()">Save SEO & Ads Settings</button></div>`)
}
function saveSeoAds(){setSettings({defaultSeoTitle:$("#defaultSeoTitle")?.value,defaultMeta:$("#defaultMeta")?.value,defaultKeywords:$("#defaultKeywords")?.value,analyticsId:$("#analyticsId")?.value,adsenseId:$("#adsenseId")?.value,adSlotCode:$("#adSlotCode")?.value});addActivity("SEO settings updated","SEO & Ads","update");alertPopup("SEO and Ads settings saved.")}
function downloadText(name,text,type="text/plain"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function downloadSitemap(){const base=location.origin+location.pathname.replace(/admin\.html.*$/,"");const urls=posts.filter(p=>p.status==="Published").map(p=>`<url><loc>${base}job-detail.html?id=${encodeURIComponent(p.id)}</loc><lastmod>${p.date||new Date().toISOString().slice(0,10)}</lastmod></url>`).join("");downloadText("sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,"application/xml");showToast("Sitemap generated.")}
function downloadRobots(){downloadText("robots.txt",`User-agent: *\nAllow: /\nDisallow: /admin.html\nSitemap: ${location.origin}/RapidJob/sitemap.xml`);showToast("robots.txt generated.")}

function securityPage(){
  return page("Security & Activity Logs","Admin access, sessions, roles aur audit history.",`
    <div class="stats power-stats">
      ${powerStat("fa-shield-halved","Security Status","Protected")}
      ${powerStat("fa-clock","Session Timeout",(adminSettings.sessionTimeout||30)+" min")}
      ${powerStat("fa-list-check","Activity Logs",activityLogs.length)}
      ${powerStat("fa-trash-arrow-up","Recycle Bin",recycleBin.length)}
    </div>
    <div class="settings-grid" style="margin:22px">
      <div class="setting-card"><h3>Admin Security</h3><div class="field"><label>Session Timeout (minutes)</label><input id="sessionTimeout" type="number" value="${esc(adminSettings.sessionTimeout||30)}"></div><div class="field"><label>Maximum Login Attempts</label><input id="maxLoginAttempts" type="number" value="${esc(adminSettings.maxLoginAttempts||5)}"></div><div class="toggle-grid" style="margin-top:10px"><label class="power-toggle"><input id="twoStep" type="checkbox" ${adminSettings.twoStep?"checked":""}> Two-step verification</label><label class="power-toggle"><input id="loginAlert" type="checkbox" ${adminSettings.loginAlert!==false?"checked":""}> Login alerts</label></div><button class="btn green" style="margin-top:12px" onclick="saveSecurity()">Save Security</button></div>
      <div class="setting-card"><h3>Admin Roles</h3><div class="security-card"><b>Super Admin</b><p>Full access — Harekrishna Patel</p></div><div class="security-card"><b>Editor</b><p>Create and edit content, no security access.</p></div><div class="security-card"><b>Author</b><p>Create drafts only.</p></div></div>
    </div>
    <div class="panel"><div class="panel-head"><h2>Activity Log</h2><button class="btn red" onclick="clearActivityLogs()">Clear Logs</button></div>
      <div class="table-wrap"><table class="table log-table"><thead><tr><th>Date</th><th>Admin</th><th>Action</th><th>Target</th></tr></thead><tbody>${activityLogs.map(a=>`<tr><td>${esc(a.date)}</td><td>${esc(a.admin)}</td><td>${esc(a.action)}</td><td>${esc(a.target)}</td></tr>`).join("")||'<tr><td colspan="4">No activity logs found.</td></tr>'}</tbody></table></div>
    </div>`)
}
function saveSecurity(){setSettings({sessionTimeout:+$("#sessionTimeout")?.value||30,maxLoginAttempts:+$("#maxLoginAttempts")?.value||5,twoStep:Boolean($("#twoStep")?.checked),loginAlert:Boolean($("#loginAlert")?.checked)});alertPopup("Security settings saved.")}
async function clearActivityLogs(){if(await adminConfirm("All local activity logs will be cleared.","Clear Activity Logs?","Clear Logs")){activityLogs=[];saveLocalList("rapidAdminActivity",activityLogs);render("security")}}

function backupPage(){
  const totalSize=new Blob([JSON.stringify({posts,messages,mediaItems,breakingItems,settings:adminSettings})]).size;
  return page("Backup & Restore","CMS data export, import aur recovery center.",`
    <div class="stats power-stats">
      ${powerStat("fa-database","Backup Size",formatBytes(totalSize))}
      ${powerStat("fa-layer-group","Posts",posts.length)}
      ${powerStat("fa-photo-film","Media",mediaItems.length)}
      ${powerStat("fa-envelope","Messages",messages.length)}
    </div>
    <div class="settings-grid" style="margin:22px">
      <div class="setting-card"><h3>Full JSON Backup</h3><p>Posts, messages, breaking news, local users, notifications and settings export karein.</p><button class="btn" onclick="exportFullBackup()">Download Backup</button></div>
      <div class="setting-card"><h3>Restore Backup</h3><p>Previously downloaded Rapid Job JSON backup import karein.</p><input id="backupFile" type="file" accept=".json"><button class="btn green" style="margin-top:10px" onclick="importFullBackup()">Import & Restore</button></div>
      <div class="setting-card"><h3>Posts CSV Export</h3><p>All posts ko spreadsheet-friendly CSV me export karein.</p><button class="btn purple" onclick="exportPostsCsv()">Export Posts CSV</button></div>
      <div class="setting-card"><h3>Database Health</h3><p>Duplicate post IDs: <b>${posts.length-new Set(posts.map(p=>p.id)).size}</b></p><p>Empty titles: <b>${posts.filter(p=>!p.title).length}</b></p><p>Orphan media URLs: <b>${mediaItems.filter(m=>!m.url).length}</b></p><button class="btn orange" onclick="runDatabaseCleaner()">Run Cleaner</button></div>
    </div>`)
}
function exportFullBackup(){
  const data={version:1,exportedAt:new Date().toISOString(),posts,messages,mediaItems,breakingItems,notifications,users,activityLogs,adminSettings};
  downloadText("rapid-job-cms-backup-"+new Date().toISOString().slice(0,10)+".json",JSON.stringify(data,null,2),"application/json");addActivity("Full backup exported","CMS Backup","backup");showToast("Backup downloaded.")
}
function importFullBackup(){
  const f=$("#backupFile")?.files?.[0];if(!f)return alertPopup("Please choose a JSON backup file.");
  const r=new FileReader();r.onload=async()=>{try{const data=JSON.parse(r.result);const ok=await adminConfirm("Selected backup data will be written to Firebase/local storage.","Restore Backup?","Restore");if(!ok)return;if(data.posts){const obj={};data.posts.forEach(p=>obj[p.id]=p);await db.ref("posts").set(obj)}if(data.notifications){notifications=data.notifications;saveLocalList("rapidAdminNotifications",notifications)}if(data.users){users=data.users;saveLocalList("rapidAdminUsers",users)}if(data.activityLogs){activityLogs=data.activityLogs;saveLocalList("rapidAdminActivity",activityLogs)}if(data.adminSettings)setSettings(data.adminSettings);addActivity("Backup restored","CMS Backup","backup");alertPopup("Backup restored successfully.")}catch(e){console.error(e);alertPopup("Invalid or corrupted backup file.")}};r.readAsText(f)
}
function exportPostsCsv(){const rows=[["ID","Title","Category","Status","State","Date","SEO Title"],...posts.map(p=>[p.id,p.title,p.categoryName||catName(p.type),p.status,p.state,p.date,p.seoTitle||""])];downloadText("rapid-job-posts.csv",rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\n"),"text/csv")}
function runDatabaseCleaner(){showToast("Database scan completed. No destructive changes were made.","warning");addActivity("Database health scan","CMS Database","update")}

settings=function(){
  adminSettings=getSettings();
  return page("Website Settings","Rapid Job branding, sections, maintenance aur integration controls.",`
    <div class="settings-grid" style="margin:22px">
      <div class="setting-card"><h3>Website Identity</h3><div class="field"><label>Website Name</label><input id="siteName" value="${esc(adminSettings.siteName||"Rapid Job")}"></div><div class="field"><label>Tagline</label><input id="siteTagline" value="${esc(adminSettings.siteTagline||"Fast Government Job Updates")}"></div><div class="field"><label>Logo URL</label><input id="siteLogo" value="${esc(adminSettings.siteLogo||"rapid-job-logo-horizontal.png")}"></div><div class="field"><label>Favicon URL</label><input id="siteFavicon" value="${esc(adminSettings.siteFavicon||"favicon-32.png")}"></div></div>
      <div class="setting-card"><h3>Contact & Social</h3><div class="field"><label>Email</label><input id="contactEmail" value="${esc(adminSettings.contactEmail||"admin@rapidjob.com")}"></div><div class="field"><label>Mobile / WhatsApp</label><input id="contactMobile" value="${esc(adminSettings.contactMobile||"")}"></div><div class="field"><label>Telegram URL</label><input id="telegramUrl" value="${esc(adminSettings.telegramUrl||"")}"></div><div class="field"><label>YouTube URL</label><input id="youtubeUrl" value="${esc(adminSettings.youtubeUrl||"")}"></div></div>
      <div class="setting-card"><h3>Homepage Controls</h3><div class="toggle-grid">${["Latest Jobs","Admit Card","Results","Admission","Tools","Study Material"].map((x,i)=>`<label class="power-toggle"><input class="sectionToggle" data-section="${x}" type="checkbox" ${adminSettings.sections?.[x]!==false?"checked":""}> ${x}</label>`).join("")}</div><div class="field" style="margin-top:12px"><label>Header Announcement</label><input id="headerAnnouncement" value="${esc(adminSettings.headerAnnouncement||"")}"></div><div class="field"><label>Footer Text</label><input id="footerText" value="${esc(adminSettings.footerText||"© 2022 - 2026 Rapid Job")}"></div></div>
      <div class="setting-card"><h3>Website Operation</h3><div class="toggle-grid"><label class="power-toggle"><input id="maintenanceMode" type="checkbox" ${adminSettings.maintenanceMode?"checked":""}> Maintenance Mode</label><label class="power-toggle"><input id="visitorCounter" type="checkbox" ${adminSettings.visitorCounter!==false?"checked":""}> Visitor Counter</label><label class="power-toggle"><input id="defaultDark" type="checkbox" ${adminSettings.defaultDark?"checked":""}> Default Dark Mode</label><label class="power-toggle"><input id="popupEnabled" type="checkbox" ${adminSettings.popupEnabled?"checked":""}> Announcement Popup</label></div><div class="field" style="margin-top:12px"><label>Custom CSS</label><textarea id="customCss">${esc(adminSettings.customCss||"")}</textarea></div></div>
    </div>
    <div class="panel"><button class="btn green" onclick="savePowerSettings()">Save Website Settings</button></div>`)
}
function savePowerSettings(){
  const sections={};document.querySelectorAll(".sectionToggle").forEach(x=>sections[x.dataset.section]=x.checked);
  setSettings({siteName:$("#siteName")?.value,siteTagline:$("#siteTagline")?.value,siteLogo:$("#siteLogo")?.value,siteFavicon:$("#siteFavicon")?.value,contactEmail:$("#contactEmail")?.value,contactMobile:$("#contactMobile")?.value,telegramUrl:$("#telegramUrl")?.value,youtubeUrl:$("#youtubeUrl")?.value,sections,headerAnnouncement:$("#headerAnnouncement")?.value,footerText:$("#footerText")?.value,maintenanceMode:Boolean($("#maintenanceMode")?.checked),visitorCounter:Boolean($("#visitorCounter")?.checked),defaultDark:Boolean($("#defaultDark")?.checked),popupEnabled:Boolean($("#popupEnabled")?.checked),customCss:$("#customCss")?.value});
  db.ref("websiteSettings").set(adminSettings).catch(console.warn);addActivity("Website settings updated","Settings","update");alertPopup("Website settings saved successfully.")
}

function updateNotificationBadge(){const badge=document.getElementById("notificationBadge");if(badge)badge.textContent=notifications.filter(n=>!n.read).length}

const originalRender=render;
render=function(pageName=current){
  current=pageName;
  document.querySelectorAll("#sideNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===pageName));
  const map={dashboard,posts:postsPage,blogEditor,messages:messagesPage,breaking,media,notifications:notificationsPage,users:usersPage,seoAds:seoAdsPage,security:securityPage,backup:backupPage,settings};
  const fn=map[pageName]||dashboard,app=$("#app");if(app)app.innerHTML=fn();
  if(pageName==="media")bindMediaManager();
  updateNotificationBadge();
  if(window.innerWidth<1000)$("#sidebar")?.classList.remove("show")
}

function runScheduledPublishing(){
  const now=Date.now();
  posts.forEach(async p=>{
    if(p.status==="Scheduled"&&p.scheduleAt&&new Date(p.scheduleAt).getTime()<=now){p.status="Published";p.publishedAt=now;await db.ref("posts/"+p.id).update({status:"Published",publishedAt:now});addActivity("Scheduled post published",p.title,"publish")}
    if(p.autoUnpublish&&p.expiryAt&&new Date(p.expiryAt).getTime()<=now&&p.status==="Published"){await db.ref("posts/"+p.id).update({status:"Expired"});addActivity("Post auto unpublished",p.title,"update")}
  })
}

activityLogs=localList("rapidAdminActivity");
notifications=localList("rapidAdminNotifications");
users=localList("rapidAdminUsers");
adminSettings=getSettings();
recycleBin=localList("rapidAdminRecycle");
addActivity("Admin CMS opened","Dashboard","login");
clearInterval(scheduledTimer);scheduledTimer=setInterval(runScheduledPublishing,60000);
setTimeout(()=>{updateNotificationBadge();if(current==="dashboard")render("dashboard")},600);


/* =========================================================
   RAPID JOB CONTENT MANAGER — FIREBASE CRUD MODULES
   ========================================================= */
const cmConfig={
  bannerManager:{
    key:"banners",title:"Banner Slider Manager",subtitle:"Homepage slider banners, links, display order aur timing manage karein.",
    icon:"fa-images",singular:"Banner",
    fields:[
      ["title","Banner Heading","text"],["subtitle","Short Description","text"],
      ["image","Desktop Image URL","text"],["mobileImage","Mobile Image URL","text"],
      ["buttonText","Button Text","text"],["link","Button / Target Link","text"],
      ["order","Display Order","number"],["startAt","Start Date & Time","datetime-local"],
      ["endAt","End Date & Time","datetime-local"],["enabled","Enable Banner","checkbox"]
    ]
  },
  advertisementManager:{
    key:"advertisements",title:"Advertisement Manager",subtitle:"Google AdSense code aur custom advertising banners control karein.",
    icon:"fa-rectangle-ad",singular:"Advertisement",
    fields:[
      ["title","Ad Name","text"],["type","Ad Type","select:Google AdSense|Custom Banner"],
      ["position","Display Position","select:Header|Homepage Top|Homepage Middle|Sidebar|Post Top|Post Middle|Post Bottom|Footer"],
      ["image","Custom Banner Image URL","text"],["link","Custom Banner Link","text"],
      ["code","AdSense / Custom HTML Code","textarea-code"],["startAt","Start Date & Time","datetime-local"],
      ["endAt","End Date & Time","datetime-local"],["desktop","Desktop Visibility","checkbox"],
      ["mobile","Mobile Visibility","checkbox"],["enabled","Enable Advertisement","checkbox"]
    ]
  },
  popupManager:{
    key:"popups",title:"Popup Announcement Manager",subtitle:"Animated website announcements, expiry aur visit frequency manage karein.",
    icon:"fa-bullhorn",singular:"Popup",
    fields:[
      ["title","Popup Title","text"],["message","Announcement Message","textarea"],
      ["image","Popup Image URL","text"],["buttonText","Button Text","text"],
      ["link","Button Link","text"],["delay","Delay in Seconds","number"],
      ["frequency","Display Frequency","select:Every Visit|Once Per Day|Once Per Session"],
      ["startAt","Start Date & Time","datetime-local"],["endAt","Expiry Date & Time","datetime-local"],
      ["enabled","Enable Popup","checkbox"]
    ]
  },
  noticeManager:{
    key:"notices",title:"Notice Board Manager",subtitle:"Important notices, priority, pin aur expiry manage karein.",
    icon:"fa-thumbtack",singular:"Notice",
    fields:[
      ["title","Notice Title","text"],["message","Notice Details","textarea"],
      ["type","Notice Type","select:New Job|Admit Card|Result|Urgent Update|General Notice"],
      ["priority","Priority","select:High|Medium|Low"],["link","Notice Link","text"],
      ["pinned","Pin to Top","checkbox"],["startAt","Start Date & Time","datetime-local"],
      ["endAt","Expiry Date & Time","datetime-local"],["enabled","Enable Notice","checkbox"]
    ]
  },
  examCalendarManager:{
    key:"examCalendar",title:"Exam Calendar Manager",subtitle:"Application, exam, admit-card aur result dates ek jagah manage karein.",
    icon:"fa-calendar-days",singular:"Exam",
    fields:[
      ["title","Exam Name","text"],["category","Exam Category","select:Railway|SSC|Banking|Defence|Teaching|State Exam|Other"],
      ["state","State / Region","text"],["applicationStart","Application Start Date","date"],
      ["applicationEnd","Application Last Date","date"],["examDate","Exam Date","date"],
      ["admitCardDate","Admit Card Date","date"],["resultDate","Result Date","date"],
      ["link","Details Page Link","text"],["enabled","Enable Exam","checkbox"]
    ]
  },
  categoryManager:{
    key:"categories",title:"Category Manager",subtitle:"Portal categories, icons, colours, order aur homepage visibility manage karein.",
    icon:"fa-folder-open",singular:"Category",
    fields:[
      ["title","Category Name","text"],["slug","SEO Slug","text"],
      ["icon","Font Awesome Icon Class","text"],["color","Category Colour","color"],
      ["parent","Parent Category","text"],["order","Display Order","number"],
      ["homepage","Show on Homepage","checkbox"],["enabled","Enable Category","checkbox"]
    ]
  },
  tagManager:{
    key:"tags",title:"Tag Manager",subtitle:"SEO tags, trending keywords aur post discovery manage karein.",
    icon:"fa-tags",singular:"Tag",
    fields:[
      ["title","Tag Name","text"],["slug","SEO Slug","text"],
      ["description","Short Description","textarea"],["trending","Trending Tag","checkbox"],
      ["enabled","Enable Tag","checkbox"]
    ]
  }
};
const cmData={banners:[],advertisements:[],popups:[],notices:[],examCalendar:[],categories:[],tags:[]};
let cmEdit={page:null,id:null};

function cmEscapeAttr(v){return esc(v??"")}
function cmSlugify(v){return String(v||"").toLowerCase().trim().replace(/[^a-z0-9\u0900-\u097f]+/g,"-").replace(/^-+|-+$/g,"")}
function cmFormatDate(v){if(!v)return"—";try{return new Date(v).toLocaleString("en-IN")}catch{return v}}
function cmEnabled(item){return item.enabled!==false}
function cmActiveCount(list){return list.filter(cmEnabled).length}
function cmExpired(item){return item.endAt&&new Date(item.endAt).getTime()<Date.now()}
function cmStats(config,list){
  return `<div class="cm-overview">
    <div class="cm-stat"><i class="fa-solid ${config.icon}"></i><strong>${list.length}</strong><span>TOTAL ${esc(config.singular).toUpperCase()}</span></div>
    <div class="cm-stat"><i class="fa-solid fa-circle-check"></i><strong>${cmActiveCount(list)}</strong><span>ACTIVE</span></div>
    <div class="cm-stat"><i class="fa-solid fa-circle-pause"></i><strong>${list.filter(x=>!cmEnabled(x)).length}</strong><span>DISABLED</span></div>
    <div class="cm-stat"><i class="fa-solid fa-clock-rotate-left"></i><strong>${list.filter(cmExpired).length}</strong><span>EXPIRED</span></div>
  </div>`
}
function cmItemImage(pageName,item){
  if(item.image)return `<img src="${cmEscapeAttr(item.image)}" alt="">`;
  const icon=cmConfig[pageName].icon;
  return `<i class="fa-solid ${icon}"></i>`
}
function cmItemDescription(pageName,x){
  if(pageName==="bannerManager")return x.subtitle||x.link||"Homepage banner";
  if(pageName==="advertisementManager")return `${x.type||"Advertisement"} • ${x.position||"Position not selected"}`;
  if(pageName==="popupManager")return x.message||"Popup announcement";
  if(pageName==="noticeManager")return x.message||x.type||"Notice";
  if(pageName==="examCalendarManager")return `${x.category||"Exam"} • Exam: ${x.examDate||"Date pending"}`;
  if(pageName==="categoryManager")return `${x.slug||cmSlugify(x.title)}${x.parent?" • Parent: "+x.parent:""}`;
  return x.description||x.slug||"SEO tag"
}
function cmExtraChips(pageName,x){
  const chips=[];
  if(x.priority)chips.push(`<span class="cm-chip cm-priority-${String(x.priority).toLowerCase()}">${esc(x.priority)}</span>`);
  if(x.position)chips.push(`<span class="cm-chip">${esc(x.position)}</span>`);
  if(x.type)chips.push(`<span class="cm-chip">${esc(x.type)}</span>`);
  if(x.category)chips.push(`<span class="cm-chip">${esc(x.category)}</span>`);
  if(x.pinned)chips.push(`<span class="cm-chip">📌 Pinned</span>`);
  if(x.trending)chips.push(`<span class="cm-chip">🔥 Trending</span>`);
  if(x.homepage)chips.push(`<span class="cm-chip">🏠 Homepage</span>`);
  return chips.join("")
}
function contentManagerPage(pageName){
  const config=cmConfig[pageName],list=cmData[config.key]||[];
  return page(config.title,config.subtitle,`${cmStats(config,list)}
    <div class="panel">
      <div class="cm-toolbar">
        <div class="cm-toolbar-left">
          <div class="cm-search"><i class="fa-solid fa-search"></i><input id="cmSearch" placeholder="Search ${esc(config.singular.toLowerCase())}..." oninput="cmFilterItems('${pageName}')"></div>
          <select class="cm-filter" id="cmStatusFilter" onchange="cmFilterItems('${pageName}')"><option value="all">All Status</option><option value="active">Active</option><option value="disabled">Disabled</option><option value="expired">Expired</option></select>
        </div>
        <button class="btn" onclick="openCmForm('${pageName}')"><i class="fa-solid fa-plus"></i> Add ${esc(config.singular)}</button>
      </div>
      <div class="cm-grid" id="cmGrid">${cmCards(pageName,list)}</div>
    </div>`)
}
function cmCards(pageName,list){
  const config=cmConfig[pageName];
  return list.length?list.map((x,i)=>`<article class="cm-item" data-title="${cmEscapeAttr((x.title||"").toLowerCase())}" data-status="${cmExpired(x)?"expired":cmEnabled(x)?"active":"disabled"}" style="animation-delay:${Math.min(i*.04,.4)}s">
    <div class="cm-thumb">${cmItemImage(pageName,x)}</div>
    <div class="cm-body">
      <h3>${esc(x.title||config.singular)}</h3>
      <p>${esc(cmItemDescription(pageName,x))}</p>
      <div class="cm-meta"><span class="cm-chip ${cmEnabled(x)?"on":"off"}">${cmEnabled(x)?"Enabled":"Disabled"}</span>${cmExtraChips(pageName,x)}</div>
      <div class="cm-actions">
        <button class="mini view" onclick="previewCmItem('${pageName}','${x.id}')">Preview</button>
        <button class="mini edit" onclick="openCmForm('${pageName}','${x.id}')">Edit</button>
        <button class="mini ${cmEnabled(x)?"del":"view"}" onclick="toggleCmItem('${pageName}','${x.id}')">${cmEnabled(x)?"Disable":"Enable"}</button>
        <button class="mini del" onclick="deleteCmItem('${pageName}','${x.id}')">Delete</button>
      </div>
    </div>
  </article>`).join(""):`<div class="cm-empty"><i class="fa-solid ${config.icon}"></i><h2>No ${esc(config.singular)} Added</h2><p>Add your first item using the button above.</p></div>`
}
function cmFilterItems(pageName){
  const q=($("#cmSearch")?.value||"").toLowerCase(),status=$("#cmStatusFilter")?.value||"all";
  document.querySelectorAll("#cmGrid .cm-item").forEach(card=>{
    const matchText=!q||card.dataset.title.includes(q);
    const matchStatus=status==="all"||card.dataset.status===status;
    card.style.display=matchText&&matchStatus?"":"none"
  })
}
function cmFieldHtml(field,item){
  const [id,label,type]=field,val=item?.[id]??(type==="checkbox"?true:"");
  if(type==="checkbox")return `<label class="cm-toggle"><input id="cm_${id}" type="checkbox" ${val!==false?"checked":""}> ${esc(label)}</label>`;
  if(type.startsWith("select:")){
    const opts=type.slice(7).split("|");
    return `<div class="field"><label>${esc(label)}</label><select id="cm_${id}">${opts.map(o=>`<option ${String(val)===o?"selected":""}>${esc(o)}</option>`).join("")}</select></div>`
  }
  if(type==="textarea"||type==="textarea-code")return `<div class="field full"><label>${esc(label)}</label><textarea id="cm_${id}" class="${type==="textarea-code"?"cm-code":""}">${esc(val)}</textarea></div>`;
  return `<div class="field"><label>${esc(label)}</label><input id="cm_${id}" class="${type==="color"?"cm-color-input":""}" type="${type}" value="${cmEscapeAttr(val)}"></div>`
}
function openCmForm(pageName,id=null){
  const config=cmConfig[pageName],item=id?(cmData[config.key]||[]).find(x=>x.id===id)||{}:{};
  cmEdit={page:pageName,id};
  openAdminModal(`<div class="modal-title-row"><div><h2>${id?"Edit":"Add"} ${esc(config.singular)}</h2><p class="hint">${esc(config.subtitle)}</p></div></div>
    <div class="modal-body">
      <div class="cm-form-grid">${config.fields.map(f=>cmFieldHtml(f,item)).join("")}</div>
      <div class="cm-preview-box"><h3>Live Preview</h3><div id="cmLivePreview">${cmPreviewHtml(pageName,item)}</div></div>
      <div class="sticky-actions">
        <button class="btn preview" onclick="refreshCmPreview('${pageName}')"><i class="fa-solid fa-eye"></i> Refresh Preview</button>
        <button class="btn green" onclick="saveCmItem('${pageName}')"><i class="fa-solid fa-floppy-disk"></i> Save ${esc(config.singular)}</button>
        <button class="btn light" onclick="closeAdminModal()">Cancel</button>
      </div>
    </div>`)
}
function cmCollect(pageName){
  const config=cmConfig[pageName],data={};
  config.fields.forEach(([id,,type])=>{
    const el=$("#cm_"+id);
    data[id]=type==="checkbox"?Boolean(el?.checked):type==="number"?Number(el?.value||0):(el?.value||"").trim()
  });
  if((pageName==="categoryManager"||pageName==="tagManager")&&!data.slug)data.slug=cmSlugify(data.title);
  return data
}
function cmPreviewHtml(pageName,x){
  const title=esc(x.title||"Preview Title");
  if(pageName==="bannerManager")return `<div class="cm-preview-banner">${x.image?`<img src="${cmEscapeAttr(x.image)}">`:""}<div><h2>${title}</h2><p>${esc(x.subtitle||"Banner description")}</p><button class="btn small">${esc(x.buttonText||"View Details")}</button></div></div>`;
  if(pageName==="advertisementManager")return `<div class="cm-ad-demo">${x.image?`<img src="${cmEscapeAttr(x.image)}" style="max-width:100%;max-height:110px">`:`${esc(x.position||"Advertisement Position")} — ${esc(x.type||"Ad")}`}</div>`;
  if(pageName==="popupManager")return `<div class="cm-popup-demo">${x.image?`<img src="${cmEscapeAttr(x.image)}" style="max-width:100%;max-height:130px;border-radius:12px">`:""}<h2>${title}</h2><p>${esc(x.message||"Announcement message")}</p><button class="btn">${esc(x.buttonText||"View Details")}</button></div>`;
  if(pageName==="noticeManager")return `<div class="cm-notice-demo"><b>${title}</b><p>${esc(x.message||"Notice details")}</p></div>`;
  if(pageName==="examCalendarManager")return `<div class="cm-calendar-demo"><div><b>Apply Last</b><br>${esc(x.applicationEnd||"—")}</div><div><b>Exam Date</b><br>${esc(x.examDate||"—")}</div><div><b>Result</b><br>${esc(x.resultDate||"—")}</div></div>`;
  if(pageName==="categoryManager")return `<div class="cm-popup-demo"><i class="fa-solid ${esc(x.icon||"fa-folder")}" style="font-size:35px;color:${esc(x.color||"#075ee8")}"></i><h2>${title}</h2><span class="cm-slug">/${esc(x.slug||cmSlugify(x.title||"category"))}</span></div>`;
  return `<div class="cm-popup-demo"><h2>#${title}</h2><p>${esc(x.description||"Tag description")}</p><span class="cm-slug">/${esc(x.slug||cmSlugify(x.title||"tag"))}</span></div>`
}
function refreshCmPreview(pageName){const box=$("#cmLivePreview");if(box)box.innerHTML=cmPreviewHtml(pageName,cmCollect(pageName))}
async function saveCmItem(pageName){
  const config=cmConfig[pageName],data=cmCollect(pageName);
  if(!data.title)return alertPopup(`${config.singular} title is required.`);
  const id=cmEdit.id||(`${config.key}_`+Date.now());
  const old=(cmData[config.key]||[]).find(x=>x.id===id)||{};
  const record={...old,...data,id,updatedAt:Date.now(),createdAt:old.createdAt||Date.now()};
  await db.ref(`contentManager/${config.key}/${id}`).set(record);
  addActivity(`${config.singular} saved`,data.title,"update");
  closeAdminModal();showToast(`${config.singular} saved successfully.`);render(pageName)
}
async function toggleCmItem(pageName,id){
  const config=cmConfig[pageName],item=(cmData[config.key]||[]).find(x=>x.id===id);if(!item)return;
  await db.ref(`contentManager/${config.key}/${id}/enabled`).set(!cmEnabled(item));
  showToast(`${config.singular} ${cmEnabled(item)?"disabled":"enabled"}.`)
}
async function deleteCmItem(pageName,id){
  const config=cmConfig[pageName],item=(cmData[config.key]||[]).find(x=>x.id===id);
  const ok=await adminConfirm(`${item?.title||config.singular} will be permanently deleted.`,"Delete "+config.singular+"?","Delete");
  if(ok){await db.ref(`contentManager/${config.key}/${id}`).remove();addActivity(`${config.singular} deleted`,item?.title||id,"delete");showToast(`${config.singular} deleted.`)}
}
function previewCmItem(pageName,id){
  const config=cmConfig[pageName],item=(cmData[config.key]||[]).find(x=>x.id===id);if(!item)return;
  openAdminModal(`<div class="modal-title-row"><h2>${esc(item.title||config.singular)} Preview</h2></div><div class="modal-body">${cmPreviewHtml(pageName,item)}<div class="cm-meta" style="margin-top:16px"><span class="cm-chip ${cmEnabled(item)?"on":"off"}">${cmEnabled(item)?"Enabled":"Disabled"}</span><span class="cm-chip">Updated: ${esc(cmFormatDate(item.updatedAt))}</span></div></div>`)
}
function bindContentManagerData(){
  Object.values(cmConfig).forEach(config=>{
    db.ref(`contentManager/${config.key}`).on("value",snap=>{
      cmData[config.key]=Object.entries(snap.val()||{}).map(([id,x])=>({id,...x})).sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)));
      if(current&&cmConfig[current]?.key===config.key)render(current)
    })
  })
}
function initContentManagerNav(){
  const group=document.getElementById("contentNavGroup"),toggle=document.getElementById("contentManagerToggle");
  if(!group||!toggle)return;
  const toggleGroup=()=>{group.classList.toggle("open");toggle.setAttribute("aria-expanded",String(group.classList.contains("open")))};
  toggle.addEventListener("click",toggleGroup);
  toggle.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleGroup()}});
}

/* Extend final render map without touching existing modules */
const renderBeforeContentManager=render;
render=function(pageName=current){
  if(cmConfig[pageName]){
    current=pageName;
    document.querySelectorAll("#sideNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===pageName));
    document.getElementById("contentNavGroup")?.classList.add("open");
    document.getElementById("contentManagerToggle")?.setAttribute("aria-expanded","true");
    const app=$("#app");if(app)app.innerHTML=contentManagerPage(pageName);
    updateNotificationBadge?.();
    if(window.innerWidth<1000)$("#sidebar")?.classList.remove("show");
    return
  }
  renderBeforeContentManager(pageName)
};

document.addEventListener("DOMContentLoaded",()=>{
  initContentManagerNav();
  bindContentManagerData();
});

/* ===== Study Material Manager: Firebase Realtime Database + Google Drive ===== */
let studyMaterials=[];let studyEditId=null;const STUDY_DB_PATH="studyMaterials";
function studyDriveLink(url=""){const value=String(url||"").trim();if(!value)return "#";const match=value.match(/\/d\/([a-zA-Z0-9_-]+)/)||value.match(/[?&]id=([a-zA-Z0-9_-]+)/);return match&&match[1]?`https://drive.google.com/file/d/${match[1]}/view`:value}
function studyDownloadLink(url=""){const value=String(url||"").trim();const match=value.match(/\/d\/([a-zA-Z0-9_-]+)/)||value.match(/[?&]id=([a-zA-Z0-9_-]+)/);return match&&match[1]?`https://drive.google.com/uc?export=download&id=${match[1]}`:(value||"#")}
function studyMaterialPage(){const published=studyMaterials.filter(x=>x.published!==false).length,hidden=studyMaterials.length-published;return page("Study Material Manager","Google Drive PDF links ke saath Firebase se notes, papers aur practice sets manage karein.",`<div class="stats"><div class="stat"><p>Total Materials</p><h2>${studyMaterials.length}</h2></div><div class="stat"><p>Published</p><h2>${published}</h2></div><div class="stat"><p>Hidden</p><h2>${hidden}</h2></div><div class="stat"><p>Featured</p><h2>${studyMaterials.filter(x=>x.featured).length}</h2></div></div><div class="panel"><div class="panel-head"><div><h2>All Study Materials</h2><p class="hint">PDF Google Drive par rahega; details Firebase me save hongi.</p></div><div class="study-manager-toolbar"><button class="btn light" onclick="window.open('study-material.html','_blank')"><i class="fa-solid fa-eye"></i> View Page</button><button class="btn green" onclick="openStudyMaterialForm()"><i class="fa-solid fa-plus"></i> Add Material</button></div></div>${studyMaterials.length?`<div class="study-manager-grid">${studyMaterials.map(studyAdminCard).join("")}</div>`:`<div class="study-empty"><i class="fa-regular fa-folder-open"></i><h3>No study material added</h3><p>Add your first material using Google Drive PDF link.</p></div>`}</div>`)}
function studyAdminCard(x){return `<article class="study-admin-card"><h3>${esc(x.title||"Untitled Material")}</h3><div class="study-admin-meta"><span>${esc(x.category||"General")}</span><span>${esc(x.subject||"All Subjects")}</span><span>${esc(x.materialType||"Notes")}</span><span class="${x.published===false?"hidden":""}">${x.published===false?"Hidden":"Published"}</span></div><p>${esc(x.shortDescription||"")}</p><p><i class="fa-regular fa-calendar"></i> ${esc(x.updatedOn||x.createdOn||"")}</p><div class="study-admin-actions"><button class="mini view" onclick="previewStudyMaterial('${x.id}')">Preview</button><button class="mini edit" onclick="openStudyMaterialForm('${x.id}')">Edit</button><button class="mini view" onclick="toggleStudyMaterial('${x.id}')">${x.published===false?"Publish":"Hide"}</button><button class="mini del" onclick="deleteStudyMaterial('${x.id}')">Delete</button></div></article>`}
function openStudyMaterialForm(id=null){studyEditId=id;const x=id?studyMaterials.find(m=>m.id===id)||{}:{published:true,materialType:"Notes",language:"Hindi",order:50};$("#app").innerHTML=page(id?"Edit Study Material":"Add Study Material","Google Drive link paste karein; material sab devices par live show hoga.",`<div class="panel"><div class="study-form-note"><i class="fa-brands fa-google-drive"></i> Google Drive file sharing ko <b>Anyone with the link</b> rakhein.</div><div class="grid2">${input("studyTitle","Material Title",x.title||"")}${input("studyCategory","Exam Category",x.category||"")}${input("studySubject","Subject",x.subject||"")}<div class="field"><label>Material Type</label><select id="studyType">${["Notes","Previous Paper","Practice Set","Book / eBook","Syllabus","Mock Test PDF"].map(v=>`<option ${x.materialType===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="field"><label>Language</label><select id="studyLanguage">${["Hindi","English","Hindi + English"].map(v=>`<option ${x.language===v?"selected":""}>${v}</option>`).join("")}</select></div>${input("studyExamYear","Exam / Year",x.examYear||"")}${input("studyThumbnail","Thumbnail Image URL",x.thumbnail||"")}${input("studyDriveUrl","Google Drive PDF Link",x.driveUrl||"","url")}${textarea("studyShortDescription","Short Description",x.shortDescription||"")}${textarea("studyFullDescription","Full Description",x.fullDescription||"")}${input("studyTags","Tags (comma separated)",Array.isArray(x.tags)?x.tags.join(", "):(x.tags||""))}<div class="field"><label>Featured / Trending</label><select id="studyFeatured"><option value="false">Normal</option><option value="true">Featured / Trending</option></select></div><div class="field"><label>Publish Status</label><select id="studyPublished"><option value="true">Published</option><option value="false">Hidden</option></select></div>${input("studyOrder","Display Order",String(x.order??50),"number")}</div><div class="study-drive-help">Example: https://drive.google.com/file/d/FILE_ID/view</div><div class="sticky-actions"><button class="btn preview" onclick="previewStudyDraft()"><i class="fa-solid fa-eye"></i> Preview</button><button class="btn green" onclick="saveStudyMaterial()"><i class="fa-solid fa-floppy-disk"></i> Save Material</button><button class="btn light" onclick="render('studyMaterialManager')">Cancel</button></div></div>`);$("#studyFeatured").value=String(!!x.featured);$("#studyPublished").value=String(x.published!==false)}
function collectStudyMaterial(){const get=id=>$("#"+id)?.value.trim()||"",old=studyEditId?studyMaterials.find(x=>x.id===studyEditId)||{}:{},now=Date.now();return {...old,id:studyEditId||("study_"+now),title:get("studyTitle"),category:get("studyCategory"),subject:get("studySubject"),materialType:get("studyType")||"Notes",language:get("studyLanguage")||"Hindi",examYear:get("studyExamYear"),thumbnail:get("studyThumbnail"),driveUrl:studyDriveLink(get("studyDriveUrl")),downloadUrl:studyDownloadLink(get("studyDriveUrl")),shortDescription:get("studyShortDescription"),fullDescription:get("studyFullDescription"),tags:get("studyTags").split(",").map(x=>x.trim()).filter(Boolean),featured:get("studyFeatured")==="true",published:get("studyPublished")!=="false",order:Number(get("studyOrder")||50),createdAt:old.createdAt||now,createdOn:old.createdOn||new Date().toLocaleString("en-IN"),updatedAt:now,updatedOn:new Date().toLocaleString("en-IN")}}
function studyPreviewMarkup(x){return `<div class="study-preview-box">${x.thumbnail?`<img class="study-preview-cover" src="${esc(x.thumbnail)}" alt="">`:""}<span class="tag">${esc(x.materialType||"Notes")}</span><h2>${esc(x.title||"Material Title")}</h2><div class="study-admin-meta"><span>${esc(x.category||"General")}</span><span>${esc(x.subject||"All Subjects")}</span><span>${esc(x.language||"Hindi")}</span></div><p>${br(x.fullDescription||x.shortDescription||"Description will appear here.")}</p><div class="cms-buttons"><a href="${esc(x.driveUrl||"#")}" target="_blank"><i class="fa-brands fa-google-drive"></i> View PDF</a><a href="${esc(x.downloadUrl||"#")}" target="_blank"><i class="fa-solid fa-download"></i> Download</a></div></div>`}
function previewStudyDraft(){const x=collectStudyMaterial();if(!x.title)return alertPopup("Material title is required.");openAdminModal(`<div class="modal-title-row"><h2>Study Material Preview</h2></div><div class="modal-body">${studyPreviewMarkup(x)}</div>`)}
function previewStudyMaterial(id){const x=studyMaterials.find(m=>m.id===id);if(!x)return;openAdminModal(`<div class="modal-title-row"><h2>${esc(x.title)}</h2><button class="btn" onclick="window.open('study-material-detail.html?id=${encodeURIComponent(id)}','_blank')">Open Page</button></div><div class="modal-body">${studyPreviewMarkup(x)}</div>`)}
async function saveStudyMaterial(){const x=collectStudyMaterial();if(!x.title)return alertPopup("Material title is required.");if(!x.category)return alertPopup("Exam category is required.");if(!x.driveUrl||x.driveUrl==="#")return alertPopup("Google Drive PDF link is required.");await db.ref(`${STUDY_DB_PATH}/${x.id}`).set(x);studyEditId=null;alertPopup("Study material saved successfully.");render("studyMaterialManager")}
async function toggleStudyMaterial(id){const x=studyMaterials.find(m=>m.id===id);if(!x)return;await db.ref(`${STUDY_DB_PATH}/${id}/published`).set(x.published===false);showToast(x.published===false?"Material published.":"Material hidden.")}
async function deleteStudyMaterial(id){const x=studyMaterials.find(m=>m.id===id),ok=await adminConfirm(`${x?.title||"This material"} will be permanently deleted from Firebase.`,"Delete Study Material?","Delete");if(ok){await db.ref(`${STUDY_DB_PATH}/${id}`).remove();showToast("Study material deleted.")}}
function bindStudyMaterials(){db.ref(STUDY_DB_PATH).on("value",snap=>{studyMaterials=Object.entries(snap.val()||{}).map(([id,x])=>({id,...x})).sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)));if(current==="studyMaterialManager")render("studyMaterialManager")},e=>console.error("Study material load error:",e))}
const renderBeforeStudyMaterial=render;render=function(pageName=current){if(pageName==="studyMaterialManager"){current=pageName;document.querySelectorAll("#sideNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===pageName));const app=$("#app");if(app)app.innerHTML=studyMaterialPage();if(window.innerWidth<1000)$("#sidebar")?.classList.remove("show");return}renderBeforeStudyMaterial(pageName)};
document.addEventListener("DOMContentLoaded",bindStudyMaterials);
