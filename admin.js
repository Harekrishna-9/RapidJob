/* Rapid Job Admin CMS - Fixed Dashboard + Separate Blog Editor */
const ADMIN_SECRET_CODE = "RJ2026";
const ADMIN_SESSION_KEY = "rapidJobAdminLogin";
const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
try{if(!firebase.apps.length)firebase.initializeApp(firebaseConfig)}catch(e){console.warn(e)}
const db=firebase.database();
const $=q=>document.querySelector(q);
let posts=[],messages=[],current="dashboard",editId=null,blogEditId=null;
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
function openPostForm(id=null){editId=id;blogEditId=null;const p=id?posts.find(x=>x.id===id)||demo:demo;$("#app").innerHTML=page(id?"Edit Job Post":"Add New Job Post","Job editor: table, links, notice, FAQ aur custom blocks add karo.",`<div class="panel"><div class="grid2"><div class="field"><label>Category</label><select id="type">${categories.filter(c=>c[0]!=="blog").map(c=>`<option value="${c[0]}" ${(p.type||p.category)===c[0]?"selected":""}>${c[1]}</option>`).join("")}</select></div><div class="field"><label>Status</label><select id="status"><option>Published</option><option>Draft</option><option>Pending</option></select></div><div class="field"><label>State</label><input id="state" value="${esc(p.state||"All India")}"></div><div class="field"><label>Featured / Trending</label><select id="featured"><option value="false">Normal Post</option><option value="true">Featured / Trending</option></select></div>${input("title","Post Title",p.title||"")}${input("updatedOn","Updated On",p.updatedOn||"")}${textarea("description","Top Short Information",p.description||p.details||"")}</div><div class="section-bar"><div><h2>Job Visual Builder</h2><p class="hint">Table = Column1 | Column2 | Column3. Buttons = Button Text | URL. Yellow Link = Left | Right Text | URL.</p></div><button class="btn light" onclick="loadFastTemplate()">⚡ Add FastJob Template</button></div><div class="builder-toolbar"><button class="btn small light" onclick="addBlock('card')">+ Card</button><button class="btn small light" onclick="addBlock('twoCard')">+ Two Card</button><button class="btn small light" onclick="addBlock('table')">+ Table</button><button class="btn small light" onclick="addBlock('yellowLinks')">+ Yellow Links</button><button class="btn small light" onclick="addBlock('buttons')">+ Buttons</button><button class="btn small light" onclick="addBlock('notice')">+ Notice</button><button class="btn small light" onclick="addBlock('alert')">+ Alert</button><button class="btn small light" onclick="addBlock('html')">+ HTML</button><button class="btn small light" onclick="addBlock('faq')">+ FAQ</button><button class="btn small light" onclick="addBlock('image')">+ Image</button></div><div id="customBlocks"></div><div class="sticky-actions"><button class="btn preview" onclick="previewDraft()"><i class="fa-solid fa-eye"></i> Draft Preview</button><button class="btn light" onclick="savePost('Draft')"><i class="fa-solid fa-file-lines"></i> Save Draft</button><button class="btn green" onclick="savePost('Published')"><i class="fa-solid fa-paper-plane"></i> Publish Job</button><button class="btn light" onclick="render('posts')">Cancel</button></div></div>`);$("#status").value=p.status||"Published";$("#featured").value=String(!!p.featured||!!p.trending);(p.customBlocks&&p.customBlocks.length?p.customBlocks:demo.customBlocks).sort((a,b)=>(a.order||0)-(b.order||0)).forEach(b=>addBlock(b.style,b))}
function sample(style){const m={card:["Selection Process","Computer Based Test (CBT)\nDocument Verification",50],twoCard:["Important Dates + Fee","Important Dates\nStart Date : 01-01-2026\nLast Date : 31-01-2026\n---\nApplication Fee\nGeneral: Rs.500\nSC/ST: Rs.250",20],table:["Vacancy Details","Post Name | Total Post | Eligibility\nAssistant | 50 | Graduate\nClerk | 20 | 12th Pass",30],yellowLinks:["Important Links","Apply Online | Click Here To Apply | #\nDownload Notification | Click Here For Notification | #\nOfficial Website | Click Here To Open | #",100],buttons:["Top Buttons","View All Jobs | index.html\nApply Online | #\nOfficial Website | #",1],notice:["Important Notice","Read official notification before applying.",60],alert:["Latest Update","Application date extended.",5],html:["Custom HTML","<b>Write your custom HTML here</b>",70],faq:["FAQ","What is last date? | Check notification\nHow to apply? | Apply online",90],image:["Image/Banner","https://via.placeholder.com/900x250",45]};return m[style]||m.card}
function addBlock(style="card",data=null){const d=document.createElement("div");d.className="builder-row";const s=data?[data.title||"",data.content||"",data.order||50]:sample(style);d.innerHTML=`<input class="b-title" placeholder="Section Title" value="${esc(s[0])}"><select class="b-style"><option value="card">Card Box</option><option value="twoCard">Two Column Cards</option><option value="table">Table</option><option value="yellowLinks">Yellow Link Table</option><option value="buttons">Button Row</option><option value="notice">Notice Box</option><option value="alert">Alert Box</option><option value="faq">FAQ</option><option value="image">Image / Banner</option><option value="html">Custom HTML</option></select><textarea class="b-content" placeholder="Content">${esc(s[1])}</textarea><input class="b-order" type="number" value="${esc(s[2])}" placeholder="Order"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;$("#customBlocks").appendChild(d);d.querySelector(".b-style").value=data?data.style||style:style}
function loadFastTemplate(){if(confirm("FastJob template add karna hai? Current custom blocks clear ho jayenge.")){if($("#customBlocks"))$("#customBlocks").innerHTML="";demo.customBlocks.forEach(b=>addBlock(b.style,b))}}
function collectPostData(statusOverride=null){const get=id=>$("#"+id)?.value.trim()||"";const customBlocks=[...document.querySelectorAll(".builder-row")].map(r=>({title:r.querySelector(".b-title").value.trim(),style:r.querySelector(".b-style").value,content:r.querySelector(".b-content").value.trim(),order:Number(r.querySelector(".b-order").value||50)})).filter(b=>b.title||b.content).sort((a,b)=>a.order-b.order);const id=editId||("post_"+Date.now());return {id,type:get("type"),category:get("type"),section:get("type"),categoryName:catName(get("type")),status:statusOverride||get("status")||"Published",state:get("state")||"All India",featured:get("featured")==="true",trending:get("featured")==="true",title:get("title"),updatedOn:get("updatedOn"),description:get("description"),details:get("description"),customBlocks,time:Date.now(),date:new Date().toISOString().slice(0,10)}}
function renderBlock(b){const rows=String(b.content||"").split("\n").filter(x=>x.trim());if(b.style==="html")return `<div class="cms-card"><h3>${esc(b.title)}</h3>${b.content}</div>`;if(b.style==="image")return `<div class="cms-card"><h3>${esc(b.title)}</h3><img src="${esc(b.content)}" style="width:100%;border-radius:12px"></div>`;if(b.style==="notice"||b.style==="alert")return `<div class="cms-${b.style}"><b>${esc(b.title)}</b><br>${br(b.content)}</div>`;if(b.style==="buttons")return `<div class="cms-buttons">${rows.map(x=>{let[t,u]=x.split("|").map(y=>y?.trim()||"");return `<a href="${esc(u||'#')}" target="_blank">${esc(t||'Open')}</a>`}).join("")}</div>`;if(b.style==="yellowLinks")return `<h2>${esc(b.title)}</h2><table class="cms-table cms-links"><tbody>${rows.map(x=>{let[a,c,u]=x.split("|").map(y=>y?.trim()||"");return `<tr><td>${esc(a)}</td><td><a href="${esc(u||'#')}" target="_blank">${esc(c||'Click Here')}</a></td></tr>`}).join("")}</tbody></table>`;if(b.style==="table"){let table=rows.map(x=>x.split("|").map(y=>y.trim()));let head=table.shift()||[];return `<h2>${esc(b.title)}</h2><table class="cms-table"><thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${table.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`}if(b.style==="twoCard"){let parts=String(b.content||"").split("---");return `<div class="preview-grid">${parts.map(p=>{let l=p.trim().split("\n");let title=l.shift()||b.title;return `<div class="cms-card"><h3>${esc(title)}</h3><ul>${l.filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`}).join("")}</div>`}if(b.style==="faq")return `<div class="cms-card"><h3>${esc(b.title)}</h3>${rows.map(x=>{let[q,a]=x.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check details")}</p>`}).join("")}</div>`;return `<div class="cms-card"><h3>${esc(b.title)}</h3><ul>${rows.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`}
function previewHtml(d){return `<div class="preview-post"><div class="preview-head"><span class="tag">${esc(d.categoryName)}</span><h1>${esc(d.title||"Post Title")}</h1><p><i class="fa-regular fa-clock"></i> Updated On : ${esc(d.updatedOn||"")}</p></div><p>${br(d.description||"")}</p>${(d.customBlocks||[]).map(renderBlock).join("")}</div>`}
function ensureModal(){if(document.getElementById("adminModal"))return;let m=document.createElement("div");m.id="adminModal";m.className="admin-modal";m.innerHTML=`<div class="admin-modal-box wide"><button class="admin-modal-close" onclick="closeAdminModal()">×</button><div id="adminModalContent"></div></div>`;document.body.appendChild(m)}function openAdminModal(html){ensureModal();$("#adminModalContent").innerHTML=html;document.getElementById("adminModal").classList.add("show")}function closeAdminModal(){document.getElementById("adminModal")?.classList.remove("show")}
function alertPopup(m){
  openAdminModal(`
    <div class="modal-body delete-pop">
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

function previewDraft(){let d=collectPostData();if(!d.title)return alert("Title required");openAdminModal(`<div class="modal-title-row"><h2>Post Preview Before Publish</h2><button class="btn green" onclick="closeAdminModal();savePost('Published')">Publish Now</button></div>${previewHtml(d)}`)}function previewSavedPost(id){let d=posts.find(p=>p.id===id);if(!d)return alert("Post not found");openAdminModal(`<div class="modal-title-row"><h2>${esc(d.title)}</h2><button class="btn" onclick="window.open('job-detail.html?id=${id}','_blank')">Open Page</button></div>${d.type==='blog'?blogPreviewHtml(d):previewHtml(d)}`)}
async function savePost(status){let d=collectPostData(status);if(!d.title)return alert("Title required");await db.ref("posts/"+d.id).set(d);alertPopup(d.status==="Draft"?"Draft saved successfully.":"Post published successfully.");render("posts")}async function deletePost(id){if(confirm("Delete this post?")){await db.ref("posts/"+id).remove();alertPopup("Post deleted successfully.")}}
function blogEditor(){const blogs=posts.filter(p=>p.type==="blog");return page("Blog / Article Editor","Blog layout ke liye alag article editor.",`<div class="panel"><div class="panel-head"><h2>Blog Articles</h2><button class="btn" onclick="openBlogForm()">+ Create Blog Article</button></div>${postTable(blogs)}</div><div class="panel"><h2>Blog Format Features</h2><div class="blog-toolbox"><div class="cms-card"><h3>🖼 Featured Image</h3><p>Article banner image add karo.</p></div><div class="cms-card"><h3>🟨 Highlight Box</h3><p>Important paragraph yellow mark me.</p></div><div class="cms-card"><h3>📊 Summary Table</h3><p>Fastjobsearchers jaisa summary table.</p></div><div class="cms-card"><h3>🟩 Green Headings</h3><p>Article sections green heading style me.</p></div></div></div>`)}
function openBlogForm(id=null){blogEditId=id;editId=null;const p=id?posts.find(x=>x.id===id)||{}:{};const b=p.blog||{};$("#app").innerHTML=page(id?"Edit Blog Article":"Create Blog Article","Blog ke liye alag editor: image, highlight, summary table, content aur FAQ.",`<div class="panel blog-editor-grid"><div><div class="grid2">${input("blogTitle","Blog Title",p.title||"")}${input("blogUpdated","Updated On",p.updatedOn||"")}${input("blogAuthor","Author",b.author||"Harekrishna Patel")}${input("blogImage","Featured Image URL",b.image||"")}${textarea("blogIntro","Short Introduction",p.description||"")}${textarea("blogHighlight","Yellow Highlight Paragraph",b.highlight||"")}${textarea("blogSummary","Summary Table (Left | Right)",b.summary||"Article Name | Voter ID Card Download\nOfficial Website | voters.eci.gov.in")}</div><div class="section-bar"><h2>Blog Content Blocks</h2><button class="btn light" onclick="addBlogBlock('green')">+ Green Heading</button></div><div class="builder-toolbar"><button class="btn small light" onclick="addBlogBlock('paragraph')">+ Paragraph</button><button class="btn small light" onclick="addBlogBlock('image')">+ Image</button><button class="btn small light" onclick="addBlogBlock('table')">+ Table</button><button class="btn small light" onclick="addBlogBlock('button')">+ Button</button><button class="btn small light" onclick="addBlogBlock('faq')">+ FAQ</button><button class="btn small light" onclick="addBlogBlock('html')">+ HTML</button></div><div id="blogBlocks"></div><div class="sticky-actions"><button class="btn preview" onclick="previewBlogDraft()"><i class="fa-solid fa-eye"></i> Blog Preview</button><button class="btn light" onclick="saveBlog('Draft')">Save Draft</button><button class="btn green" onclick="saveBlog('Published')">Publish Blog</button><button class="btn light" onclick="render('blogEditor')">Cancel</button></div></div><div><div class="blog-preview" id="blogLivePreview"><div class="blog-preview-body"><h2>Live Preview</h2><p>Preview button dabao.</p></div></div></div></div>`);(b.blocks&&b.blocks.length?b.blocks:[{title:"Voter ID Card क्या है ?",style:"green",content:"यहां अपना article content लिखें.",order:10},{title:"FAQ",style:"faq",content:"Voter ID कैसे डाउनलोड करें? | Official website पर जाकर download करें.",order:90}]).forEach(x=>addBlogBlock(x.style,x))}
function blogSample(style){const m={green:["Green Section Heading","यहां अपना paragraph लिखें।",20],paragraph:["Paragraph","Normal article paragraph content.",30],image:["Image","https://via.placeholder.com/900x350",40],table:["Summary Table","Name | Details\nOfficial Website | voters.eci.gov.in",50],button:["Download Button","Download Voter ID | #",60],faq:["FAQ","Question? | Answer here",90],html:["Custom HTML","<b>Custom HTML</b>",80]};return m[style]||m.paragraph}
function addBlogBlock(style="paragraph",data=null){const d=document.createElement("div");d.className="blog-block-row";const s=data?[data.title||"",data.content||"",data.order||50]:blogSample(style);d.innerHTML=`<input class="bb-title" placeholder="Title" value="${esc(s[0])}"><select class="bb-style"><option value="green">Green Heading</option><option value="paragraph">Paragraph</option><option value="image">Image</option><option value="table">Table</option><option value="button">Button</option><option value="faq">FAQ</option><option value="html">HTML</option></select><textarea class="bb-content">${esc(s[1])}</textarea><input class="bb-order" type="number" value="${esc(s[2])}"><button class="mini del" onclick="this.parentElement.remove()">X</button>`;$("#blogBlocks").appendChild(d);d.querySelector(".bb-style").value=data?data.style||style:style}
function collectBlogData(status){const get=id=>$("#"+id)?.value.trim()||"";const id=blogEditId||("post_"+Date.now());const blocks=[...document.querySelectorAll(".blog-block-row")].map(r=>({title:r.querySelector(".bb-title").value.trim(),style:r.querySelector(".bb-style").value,content:r.querySelector(".bb-content").value.trim(),order:Number(r.querySelector(".bb-order").value||50)})).filter(b=>b.title||b.content).sort((a,b)=>a.order-b.order);return {id,type:"blog",category:"blog",section:"blog",categoryName:"Latest Blog",status:status||"Published",state:"All India",title:get("blogTitle"),updatedOn:get("blogUpdated"),description:get("blogIntro"),details:get("blogIntro"),blog:{author:get("blogAuthor"),image:get("blogImage"),highlight:get("blogHighlight"),summary:get("blogSummary"),blocks},customBlocks:blocks.map(x=>({title:x.title,style:x.style==="green"||x.style==="paragraph"?"card":x.style==="button"?"buttons":x.style,content:x.content,order:x.order})),time:Date.now(),date:new Date().toISOString().slice(0,10)}}
function blogPreviewHtml(d){const b=d.blog||{};return `<div class="preview-post"><div class="preview-head"><span class="tag">Latest Blog</span><h1>${esc(d.title||"Blog Title")}</h1><p>Updated On : ${esc(d.updatedOn||"")} ${b.author?" | Author: "+esc(b.author):""}</p></div>${b.image?`<img class="blog-preview-cover" src="${esc(b.image)}">`:""}<div class="blog-preview-body"><p>${br(d.description||"")}</p>${b.highlight?`<div class="blog-highlight">${br(b.highlight)}</div>`:""}${blogSummaryTable(b.summary||"")}${(b.blocks||[]).map(renderBlogBlock).join("")}</div></div>`}
function blogSummaryTable(txt){const rows=String(txt||"").split("\n").filter(Boolean).map(x=>x.split("|").map(y=>y.trim()));if(!rows.length)return"";return `<table class="blog-summary-table"><tbody>${rows.map(r=>`<tr><td>${esc(r[0]||"")}</td><td>${esc(r[1]||"")}</td></tr>`).join("")}</tbody></table>`}
function renderBlogBlock(b){if(b.style==="green")return `<h2 class="blog-green-title">${esc(b.title)}</h2><p>${br(b.content)}</p>`;if(b.style==="image")return `<h2>${esc(b.title)}</h2><img class="blog-preview-cover" src="${esc(b.content)}">`;if(b.style==="table")return `<h2>${esc(b.title)}</h2>${blogSummaryTable(b.content)}`;if(b.style==="button"){const rows=String(b.content).split("\n").filter(Boolean);return `<div class="blog-action-row">${rows.map((x,i)=>{let[t,u]=x.split("|").map(y=>y.trim());return `<a class="${i%2?'wa-btn':'tg-btn'}" href="${esc(u||'#')}" target="_blank">${esc(t||'Open')}</a>`}).join("")}</div>`}if(b.style==="faq"){return `<div class="cms-card"><h3>${esc(b.title)}</h3>${String(b.content).split("\n").filter(Boolean).map(x=>{let[q,a]=x.split("|");return `<p><b>Q.</b> ${esc(q||"")}<br><b>Ans:</b> ${esc(a||"Check details")}</p>`}).join("")}</div>`}if(b.style==="html")return `<div>${b.content}</div>`;return `<p>${br(b.content)}</p>`}
function previewBlogDraft(){const d=collectBlogData("Draft");if(!d.title)return alert("Blog title required");const html=blogPreviewHtml(d);$("#blogLivePreview").innerHTML=html;openAdminModal(`<div class="modal-title-row"><h2>Blog Preview</h2><button class="btn green" onclick="closeAdminModal();saveBlog('Published')">Publish Blog</button></div>${html}`)}
async function saveBlog(status){const d=collectBlogData(status);if(!d.title)return alert("Blog title required");await db.ref("posts/"+d.id).set(d);alertPopup(status==="Draft"?"Blog draft saved successfully.":"Blog published successfully.");render("blogEditor")}
function messagesPage(){
  return page("Contact Messages","Contact page messages.",`
    <div class="panel message-panel">
      ${
        messages.length
        ? messages.map(m=>`
          <div class="message-card pro-message-card">
            <div class="msg-top">
              <div>
                <h3>${esc(m.name || "No Name")}</h3>
                <p class="msg-email">📧 ${esc(m.email || m.userEmail || m.customerEmail || m.mail || "No Email")}</p>
                <p class="msg-phone">📞 ${esc(m.phone || m.mobile || m.contact || m.number || m.phoneNumber || m.mobileNumber || "No Phone")}</p>
              </div>
              <span class="msg-date">${esc(m.date || m.time || "New Message")}</span>
            </div>

            <div class="msg-body">
              ${esc(m.message || "No message")}
            </div>

            <div class="msg-actions">
              <a class="reply-btn" href="mailto:${esc(m.email || m.userEmail || m.customerEmail || m.mail || "")}?subject=Reply from Rapid Job&body=Hello ${esc(m.name || "")},%0D%0A%0D%0A">
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
        <div class="modal-body delete-pop">
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

function breaking(){return page("Breaking News","Ticker update manage karein.",`<div class="panel"><textarea id="breakingText" style="width:100%;min-height:140px"></textarea><br><br><button class="btn" onclick="db.ref('settings/breakingNews').set($('#breakingText').value);alertPopup('Saved')">Save</button></div>`)}
function media(){return page("Media Manager","Media links store karein.",`<div class="panel"><p>Use direct image/PDF URL in visual builder.</p></div>`)}
function settings(){return page("Settings","Website settings.",`<div class="panel"><p>Rapid Job CMS settings.</p></div>`)}
function render(pageName=current){current=pageName;document.querySelectorAll("#sideNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===pageName));const map={dashboard,posts:postsPage,blogEditor,messages:messagesPage,breaking,media,settings};const fn=map[pageName]||dashboard;const app=$("#app");if(app)app.innerHTML=fn();if(window.innerWidth<1000)$("#sidebar")?.classList.remove("show")}
function loadPosts(){db.ref("posts").on("value",s=>{posts=Object.entries(s.val()||{}).map(([id,p])=>({id,...p})).sort((a,b)=>(b.time||0)-(a.time||0));render(current)},e=>{console.error(e);render(current)})}
function loadMessages(){db.ref("contactMessages").on("value",s=>{messages=Object.entries(s.val()||{}).map(([id,m])=>({id,...m})).reverse();const badge=$("#msgBadge");if(badge)badge.textContent=messages.length;if(current==="messages")render(current)})}
document.addEventListener("click",e=>{if(e.target.id==="adminModal")closeAdminModal();let b=e.target.closest("#sideNav button");if(b)render(b.dataset.page)});
document.addEventListener("DOMContentLoaded",()=>{initAdminLogin();$("#quickPost")&&($("#quickPost").onclick=()=>openPostForm());$("#quickBlog")&&($("#quickBlog").onclick=()=>openBlogForm());$("#menuBtn")&&($("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("show"));$("#themeBtn")&&($("#themeBtn").onclick=()=>document.documentElement.classList.toggle("dark"));$("#searchInput")&&$("#searchInput").addEventListener("input",e=>{if(current!=="posts"&&current!=="blogEditor")return;let q=e.target.value.toLowerCase();$("#app").innerHTML=page("Search Results","Filtered posts.",`<div class="panel">${postTable(posts.filter(p=>(p.title||"").toLowerCase().includes(q)))}</div>`)});loadPosts();loadMessages();render();});
/* ===== Global Custom Alert / Confirm Popup ===== */

function customPopupBox(type, title, message, okText = "OK", cancelText = "Cancel"){
  return new Promise(resolve=>{
    const old = document.getElementById("globalPopupOverlay");
    if(old) old.remove();

    const overlay = document.createElement("div");
    overlay.id = "globalPopupOverlay";
    overlay.className = "global-pop-overlay";

    const icon = type === "success" ? "fa-check" : type === "delete" ? "fa-trash" : "fa-circle-info";

    overlay.innerHTML = `
      <div class="global-pop-box">
        <button class="global-pop-close" id="globalPopClose">×</button>

        <div class="global-pop-icon ${type}">
          <i class="fa-solid ${icon}"></i>
        </div>

        <h2>${title}</h2>
        <p>${message}</p>

        <div class="global-pop-actions">
          ${
            type === "confirm" || type === "delete"
            ? `<button class="global-btn cancel" id="globalCancel">${cancelText}</button>`
            : ""
          }
          <button class="global-btn ok" id="globalOk">${okText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(()=>overlay.classList.add("show"),10);

    function close(val){
      overlay.classList.remove("show");
      setTimeout(()=>{
        overlay.remove();
        resolve(val);
      },220);
    }

    overlay.querySelector("#globalOk").onclick = ()=>close(true);
    overlay.querySelector("#globalPopClose").onclick = ()=>close(false);

    const cancel = overlay.querySelector("#globalCancel");
    if(cancel) cancel.onclick = ()=>close(false);
  });
}

window.customAlert = function(message, title="Success"){
  return customPopupBox("success", title, message, "OK");
};

window.customConfirm = function(message, title="Confirm"){
  return customPopupBox("delete", title, message, "Yes, Delete", "Cancel");
};

/* Old alert / confirm ko replace */
window.alert = function(message){
  customPopupBox("success", "Message", message, "OK");
};

window.confirm = function(message){
  customPopupBox("delete", "Confirm", message, "OK", "Cancel");
  return true;
};
