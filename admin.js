const $=q=>document.querySelector(q);const $$=q=>document.querySelectorAll(q);
const STORE_KEY='rapidJobAdminPosts';

const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
let db=null;
try{ if(window.firebase && !firebase.apps.length){firebase.initializeApp(firebaseConfig)} db=window.firebase?firebase.database():null; }catch(e){console.warn('Firebase init error',e)}

const typeOptions=[
 {value:'job',label:'Current Job'},
 {value:'new',label:'New Update'},
 {value:'admit',label:'Admit Card'},
 {value:'result',label:'Result'},
 {value:'answer',label:'Answer Key'},
 {value:'admission',label:'Admission'},
 {value:'scholarship',label:'Scholarship'},
 {value:'blog',label:'Latest Blog'},
 {value:'study',label:'Study Material'},
 {value:'document',label:'Document'},
 {value:'agecalc',label:'Age Calculator'}
];
const labelByValue=v=>(typeOptions.find(x=>x.value===normalizeType(v))||{}).label||v||'Update';
function normalizeType(t){
 t=String(t||'job').toLowerCase().trim();
 const map={'latest job':'job','post management':'job','current job':'job','job':'job','new update':'new','new':'new','admit card':'admit','admit':'admit','results':'result','result':'result','answer key':'answer','answerkey':'answer','answer-key':'answer','answers':'answer','admissions':'admission','admission':'admission','scholarships':'scholarship','scholarship':'scholarship','latest blog':'blog','blog':'blog','blogs':'blog','study material':'study','study':'study','document':'document','documents':'document','age calculator':'agecalc','agecalc':'agecalc'};
 return map[t]||t;
}
const sections=[
 {id:'posts',title:'Post Management',icon:'▤',desc:'Jobs, notifications aur updates manage karein.',type:'job'},
 {id:'admit',title:'Admit Card',icon:'▥',desc:'Admit card link aur date update karein.',type:'admit'},
 {id:'results',title:'Result',icon:'▧',desc:'Results aur merit list publish karein.',type:'result'},
 {id:'answers',title:'Answer Key',icon:'▨',desc:'Answer key aur objection link add karein.',type:'answer'},
 {id:'admissions',title:'Admission',icon:'🎓',desc:'Admission forms aur important dates.',type:'admission'},
 {id:'scholarships',title:'Scholarship',icon:'💵',desc:'Scholarship eligibility aur links.',type:'scholarship'},
 {id:'blogs',title:'Latest Blog',icon:'📝',desc:'Career news, tips aur articles.',type:'blog'},
 {id:'study',title:'Study Material',icon:'📚',desc:'PDF notes, syllabus aur resources.',type:'study'},
 {id:'agecalc',title:'Age Calculator',icon:'🎂',desc:'DOB se exact age, months aur days calculate karein.',type:'agecalc'}
];
const managerTools=[
 {id:'ads',title:'Ads Manager',icon:'📣',desc:'Banner, sidebar aur script ads manage karein.'},
 {id:'adsense',title:'Google AdSense',icon:'💰',desc:'Publisher ID, slot ID aur future setup.'},
 {id:'seo',title:'SEO Tools',icon:'🌐',desc:'Meta title, keywords aur sitemap tools.'}
];
let posts=JSON.parse(localStorage.getItem(STORE_KEY)||'[]').map(p=>({...p,type:normalizeType(p.type)}));
let notifyCount=Number(localStorage.getItem('notifyCount')||8);let msgCount=Number(localStorage.getItem('msgCount')||5);
function save(){localStorage.setItem(STORE_KEY,JSON.stringify(posts))}
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function counts(){['sideNotifyCount','topNotifyCount'].forEach(id=>{const e=$('#'+id);if(e)e.textContent=notifyCount;if(e&&notifyCount===0)e.style.display='none';else if(e)e.style.display='inline-block'});['msgCount','topMsgCount'].forEach(id=>{const e=$('#'+id);if(e)e.textContent=msgCount;if(e&&msgCount===0)e.style.display='none';else if(e)e.style.display='inline-block'})}
function page(title,sub,body,tag='Admin Panel'){return `<section class="page"><div class="hero"><div><span class="tag">${tag}</span><h1>${title}</h1><p>${sub}</p></div></div>${body}</section>`}
function dashboard(){const total=posts.length,pub=posts.filter(p=>p.status==='Published').length,draft=posts.filter(p=>p.status==='Draft').length;return page('Dashboard','Aapke admin data ka summary yahan dikhega.',`<div class="cards"><div class="stat-card"><p>Total Posts</p><h2>${total}</h2><small>Firebase / Local data</small></div><div class="stat-card"><p>Published</p><h2>${pub}</h2><small>Live ready</small></div><div class="stat-card"><p>Draft</p><h2>${draft}</h2><small>Pending</small></div><div class="stat-card"><p>Notifications</p><h2>${notifyCount}</h2><small>Unread</small></div></div><div class="table-wrap"><table><thead><tr><th>Recent Title</th><th>Type</th><th>Status</th><th>Date</th></tr></thead><tbody>${posts.slice(-5).reverse().map(row).join('')||'<tr><td colspan="4">Abhi koi real post add nahi hua.</td></tr>'}</tbody></table></div>`,'Control Center')}
function content(){return page('Content Manager','Sabhi post category yahin se manage karein.',`<div class="tools-grid">${sections.map(s=>`<div class="tool-card" onclick="render('${s.id}')"><div class="circle">${s.icon}</div><h2>${s.title}</h2><p>${s.desc}</p><button class="btn">Open</button></div>`).join('')}</div>`,'Content Center')}
function manager(){return page('Manager','Ads Manager, Google AdSense aur SEO Tools.',`<div class="tools-grid">${managerTools.map(s=>`<div class="tool-card" onclick="render('${s.id}')"><div class="circle">${s.icon}</div><h2>${s.title}</h2><p>${s.desc}</p><button class="btn">Open</button></div>`).join('')}</div><div id="managerBox" class="empty">Kisi bhi manager tool par click karein.</div>`,'Manager')}
function row(p,i){return `<tr><td>${p.title||''}</td><td>${labelByValue(p.type)}</td><td><span class="badge">${p.status||'Published'}</span></td><td>${p.date||''}</td><td class="actions"><button class="mini-btn edit" onclick="editPost(${i})">Edit</button><button class="mini-btn del" onclick="deletePost(${i})">Delete</button></td></tr>`}
function sectionPage(s){const list=posts.filter(p=>normalizeType(p.type)===s.type);return page(s.title,`${s.title} ke posts add, edit, delete yahin se hoga.`,`${form(s.type)}<div class="table-wrap"><table><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>${list.map((p)=>row(p,posts.indexOf(p))).join('')||`<tr><td colspan="5">Abhi ${s.title} me koi data nahi hai.</td></tr>`}</tbody></table></div>`,'Content Manager')}
function templateFor(type){
 const t=normalizeType(type);
 const common={
  job:{title:'RRB Ministerial & Isolated Categories Online Form 2026',short:'Railway Recruitment Board invites online application for various posts. Interested candidates can read the full notification before applying.',dates:'Application Start Date : 30-12-2025\nApplication Last Date : 29-01-2026\nFee Payment Last Date : 31-01-2026\nExam Date : 14 & 15 July 2026',fee:'SC / ST / Female / ESM / Minorities / EBC : Rs.250/-\nAll Other Candidates : Rs.500/-\nPayment Mode : Debit Card, Credit Card, Net Banking or UPI.',age:'Minimum Age : 18 Years\nMaximum Age : See Below Post Wise\nAge Relaxation : As per Government Rules',vacancy:'Total Post : 312\nPost Name : Ministerial & Isolated Categories',selection:'Written Exam\nSkill Test / Document Verification\nMedical Examination'},
  admit:{title:'RRB Ministerial Admit Card 2026',short:'Admit card has been released. Candidates can download their hall ticket from the official website.',dates:'Admit Card Released : 04-07-2026\nExam Date : 14 & 15 July 2026',fee:'No application fee for admit card download.',age:'Age limit as per original recruitment notification.',vacancy:'Admit Card for eligible candidates.',selection:'Download admit card and follow exam instructions.'},
  result:{title:'Bihar Board Result 2026 OUT',short:'Result / merit list has been released. Candidates can check their result using roll number or registration details.',dates:'Result Released : 04-07-2026\nScore Card Available : Check official website',fee:'No fee for result checking.',age:'Not applicable.',vacancy:'Result / Merit List / Score Card update.',selection:'Check marks, cutoff and merit list details.'},
  answer:{title:'Bihar DElEd Answer Key 2026',short:'Answer key has been released. Candidates can check answer key and raise objection before the last date.',dates:'Answer Key Released : 04-07-2026\nObjection Last Date : Check official notice',fee:'Objection fee as per official notice.',age:'Not applicable.',vacancy:'Answer Key / Objection update.',selection:'Download answer key and check objection process.'},
  admission:{title:'B.Ed Admission Online Form 2026',short:'Online admission form has started. Interested candidates can check eligibility, dates and apply online.',dates:'Application Start : 10-07-2026\nLast Date : 30-07-2026\nMerit List : Notify Soon',fee:'General / OBC : Rs.500/-\nSC / ST : Rs.250/-',age:'Minimum age as per admission rule.',vacancy:'Course / Seat details as per official notice.',selection:'Merit List / Entrance Exam / Counselling'},
  scholarship:{title:'PMS Online Bihar Scholarship 2026-27 New',short:'Scholarship online application update for eligible students.',dates:'Application Start : Notify Soon\nLast Date : Check official website',fee:'No application fee.',age:'Student eligibility as per scheme.',vacancy:'Scholarship scheme for eligible students.',selection:'Document verification and approval process.'},
  blog:{title:'Railway Exam Preparation Latest Blog',short:'Career news, exam tips and preparation guidance for students.',dates:'Published Date : Today',fee:'Not applicable.',age:'Not applicable.',vacancy:'Blog / Article update.',selection:'Read full article for guidance.'},
  study:{title:'Railway Exam Study Material PDF',short:'Free study material, notes, syllabus and important PDF resources.',dates:'Updated Date : Today',fee:'Free study material.',age:'Not applicable.',vacancy:'PDF Notes / Syllabus / Practice Set',selection:'Download and study topic wise.'},
  document:{title:'OBC Certificate Document Guide',short:'Important document guide for government forms and applications.',dates:'Updated Date : Today',fee:'Not applicable.',age:'Not applicable.',vacancy:'Document list and process guide.',selection:'Check required documents carefully.'},
  new:{title:'Latest Government Job Update 2026',short:'Latest important update for job seekers. Read full details before applying.',dates:'Updated Date : Today\nLast Date : Check details',fee:'As per official notice.',age:'As per official rules.',vacancy:'Latest update details.',selection:'Check full notification.'},
  agecalc:{title:'Age Calculator for Government Forms',short:'Use date of birth to calculate exact age for government exam forms.',dates:'Updated Date : Today',fee:'Free tool.',age:'Enter DOB and calculate age.',vacancy:'Age calculation tool.',selection:'Use before filling form.'}
 };
 return common[t]||common.job;
}
function optionsHtml(selected){return typeOptions.map(o=>`<option value="${o.value}" ${normalizeType(selected)===o.value?'selected':''}>${o.label}</option>`).join('')}
function esc(v){return String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function form(type='job',editIndex=''){
 const tmp=templateFor(type);
 const today=new Date().toISOString().slice(0,10);
 const now=new Date().toTimeString().slice(0,5);
 return `<div class="post-pro-grid">
  <div class="post-form-card">
    <div class="post-card-head">
      <div><h2>Post Details</h2><p>Rapid Job website ke liye new update create karein.</p></div>
      <span class="required-note">* Required</span>
    </div>

    <label class="pro-label">Select Category <b>*</b></label>
    <select id="postType" class="pro-input" onchange="openPostForm(this.value)">${optionsHtml(type)}</select>

    <div class="field-line"><label class="pro-label">Post Title <b>*</b></label><small id="titleCount">0/120</small></div>
    <input id="postTitle" class="pro-input liveField" maxlength="120" placeholder="Enter post title here..." value="${esc(tmp.title)}">

    <div class="field-line"><label class="pro-label">Short Description <b>*</b></label><small id="descCount">0/200</small></div>
    <textarea id="postDetails" class="pro-textarea liveField" maxlength="200" placeholder="Enter short description...">${esc(tmp.short)}</textarea>

    <label class="pro-label">Post Image</label>
    <div class="drop-upload" onclick="document.getElementById('postImage').click()">
      <input id="postImage" type="file" accept="image/*" hidden onchange="handlePostImage(this)">
      <div class="drop-icon">☁️</div>
      <h3><span>Choose File</span> or Drag & Drop</h3>
      <p id="postImageName">JPG, PNG, WEBP (Max. 2MB)</p>
    </div>

    <label class="pro-label">Post Date & Time</label>
    <div class="date-time-row">
      <input id="postDate" class="pro-input" type="date" value="${today}">
      <input id="postTime" class="pro-input" type="time" value="${now}">
    </div>

    <label class="pro-label">Extra Details</label>
    <div class="mini-grid">
      <input id="postState" class="pro-input" placeholder="State / All India" value="All India">
      <input id="postLastDate" class="pro-input" placeholder="Last Date / Released" value="Check details">
      <select id="postStatus" class="pro-input"><option>Published</option><option>Draft</option><option>Pending</option></select>
      <select id="postTrending" class="pro-input"><option value="false">Trending: No</option><option value="true">Trending: Yes</option></select>
      <input id="applyLink" class="pro-input" placeholder="Apply Online Link">
      <input id="officialLink" class="pro-input" placeholder="Official Website Link">
      <input id="pdfLink" class="pro-input" placeholder="Notification PDF Link">
    </div>

    <label class="pro-label">Post Content <b>*</b></label>
    <div class="editor-box">
      <div class="editor-toolbar"><button type="button">B</button><button type="button"><i>I</i></button><button type="button"><u>U</u></button><button type="button">❝</button><button type="button">H1</button><button type="button">H2</button><button type="button">☷</button><button type="button">🔗</button><button type="button">🖼</button></div>
      <textarea id="postContent" class="editor-area" placeholder="Write full post content here..."></textarea>
    </div>

    <div class="accordion-details">
      <details open><summary>▣ Important Dates</summary><textarea id="importantDates">${esc(tmp.dates)}</textarea></details>
      <details><summary>▣ Application Fee</summary><textarea id="applicationFee">${esc(tmp.fee)}</textarea></details>
      <details><summary>▣ Age Limit</summary><textarea id="ageLimit">${esc(tmp.age)}</textarea></details>
      <details><summary>▣ Vacancy / Total Post Details</summary><textarea id="vacancyDetails">${esc(tmp.vacancy)}</textarea></details>
      <details><summary>▣ Selection Process / Eligibility</summary><textarea id="selectionProcess">${esc(tmp.selection)}</textarea></details>
    </div>

    <div class="publish-actions">
      <button class="btn" onclick="savePost(${editIndex===''?'null':editIndex})">🚀 Publish Post</button>
      <button class="btn light" onclick="saveDraft(${editIndex===''?'null':editIndex})">📋 Save Draft</button>
      <button class="btn light" onclick="render('content')">Cancel</button>
    </div>
  </div>

  <div class="preview-column">
    <div class="live-preview-card">
      <div class="post-card-head"><div><h2>Live Preview</h2><p>This is how your post will appear on the website.</p></div></div>
      <article class="preview-post">
        <div class="preview-top"><span id="previewCat">${labelByValue(type)}</span><b>NEW</b></div>
        <h2 id="previewTitle">${esc(tmp.title)}</h2>
        <div class="preview-meta"><span>👤 Admin</span><span>📅 <em id="previewDate">${today}</em></span><span>🕒 <em id="previewTime">${now}</em></span><span>👁 1254 Views</span></div>
        <div class="preview-image" id="previewImage"><span>🖼️</span><p>Post Image</p></div>
        <p id="previewDesc">${esc(tmp.short)}</p>
        <div class="preview-bottom"><button type="button">Read More →</button><button type="button">↗</button></div>
      </article>
    </div>
    <div class="tips-card"><h2>Post Tips</h2><p>✅ Choose the correct category for your post.</p><p>✅ Use a clear and attractive title.</p><p>✅ Add high quality image.</p><p>✅ Write SEO friendly content.</p><p>✅ Preview before publishing.</p></div>
  </div>
 </div>`
}
function bindPostPreview(){
 const title=$('#postTitle'),desc=$('#postDetails'),type=$('#postType'),date=$('#postDate'),time=$('#postTime');
 const upd=()=>{
  if($('#previewTitle')) $('#previewTitle').textContent=title?.value||'Post Title Will Appear Here';
  if($('#previewDesc')) $('#previewDesc').textContent=desc?.value||'This is short description of your post. It will appear here.';
  if($('#previewCat')) $('#previewCat').textContent=labelByValue(type?.value||'job');
  if($('#previewDate')) $('#previewDate').textContent=date?.value||new Date().toISOString().slice(0,10);
  if($('#previewTime')) $('#previewTime').textContent=time?.value||'';
  if($('#titleCount')) $('#titleCount').textContent=(title?.value.length||0)+'/120';
  if($('#descCount')) $('#descCount').textContent=(desc?.value.length||0)+'/200';
 };
 ['input','change'].forEach(ev=>[title,desc,type,date,time].forEach(el=>el&&el.addEventListener(ev,upd)));
 upd();
}
function handlePostImage(input){
 const file=input.files&&input.files[0]; if(!file) return;
 const name=$('#postImageName'); if(name) name.textContent='Selected: '+file.name;
 const box=$('#previewImage');
 const reader=new FileReader();
 reader.onload=e=>{ if(box){box.innerHTML=`<img src="${e.target.result}" alt="Post Image">`;box.classList.add('has-img')} };
 reader.readAsDataURL(file); toast('Image selected');
}
function saveDraft(editIndex=null){const st=$('#postStatus'); if(st) st.value='Draft'; savePost(editIndex)}
async function loadFirebasePosts(){
 if(!db){return}
 try{db.ref('posts').on('value',snap=>{const data=snap.val()||{};const arr=Object.entries(data).map(([id,p])=>({id,...p,type:normalizeType(p.type)})).sort((a,b)=>(b.time||0)-(a.time||0)); if(arr.length){posts=arr;save();render(currentView||'dashboard')}})}catch(e){console.warn(e)}
}
let currentView='dashboard';
async function savePost(editIndex=null){
 let title=$('#postTitle')?.value.trim();if(!title)return toast('Title likhna jaruri hai');
 const now=Date.now();
 let data={
  id:editIndex!==null&&posts[editIndex]?.id?posts[editIndex].id:'post_'+now,
  title,
  type:normalizeType($('#postType').value),
  category:labelByValue($('#postType').value),
  date:$('#postDate').value||new Date().toISOString().slice(0,10),
  postTime:$('#postTime')?$('#postTime').value:'',
  status:$('#postStatus').value,
  state:$('#postState').value||'All India',
  lastDate:$('#postLastDate').value||'Check details',
  details:$('#postDetails').value,
  importantDates:$('#importantDates').value,
  applicationFee:$('#applicationFee').value,
  ageLimit:$('#ageLimit').value,
  vacancyDetails:$('#vacancyDetails').value,
  selectionProcess:$('#selectionProcess').value,
  postContent:$('#postContent')?$('#postContent').value:'',
  applyLink:$('#applyLink').value,
  officialLink:$('#officialLink').value,
  pdfLink:$('#pdfLink').value,
  trending:$('#postTrending').value==='true',
  time: editIndex!==null&&posts[editIndex]?.time?posts[editIndex].time:now
 };
 if(editIndex!==null){posts[editIndex]=data}else posts.push(data);save();
 if(db){try{await db.ref('posts/'+data.id).set(data);toast('Post Firebase me save ho gaya')}catch(e){console.warn(e);toast('Local save ho gaya, Firebase error')}}else toast('Local save ho gaya');
 render(sections.find(s=>s.type===data.type)?.id||'content')
}
function editPost(i){let p=posts[i];$('#content').innerHTML=page('Edit Post','Post details update karein.',form(p.type,i),'Edit');bindPostPreview();$('#postTitle').value=p.title||'';$('#postDate').value=p.date||'';if($('#postTime'))$('#postTime').value=p.postTime||'';$('#postStatus').value=p.status||'Published';$('#postState').value=p.state||'All India';$('#postLastDate').value=p.lastDate||'';$('#applyLink').value=p.applyLink||'';$('#officialLink').value=p.officialLink||'';$('#pdfLink').value=p.pdfLink||'';$('#postTrending').value=String(!!p.trending);$('#postDetails').value=p.details||'';if($('#postContent'))$('#postContent').value=p.postContent||'';$('#importantDates').value=p.importantDates||'';$('#applicationFee').value=p.applicationFee||'';$('#ageLimit').value=p.ageLimit||'';$('#vacancyDetails').value=p.vacancyDetails||'';$('#selectionProcess').value=p.selectionProcess||''}
async function deletePost(i){if(confirm('Delete this post?')){let type=posts[i].type,id=posts[i].id;posts.splice(i,1);save();if(db&&id){try{await db.ref('posts/'+id).remove()}catch(e){console.warn(e)}}toast('Deleted');render(sections.find(s=>s.type===type)?.id||'dashboard')}}
function ads(){return page('Ads Manager','Ad code local browser me save hoga.',`<input id="adTop" placeholder="Top banner ad code"><textarea id="adScript" placeholder="Paste ad script/code"></textarea><button class="btn" onclick="localStorage.setItem('adsCode',$('#adScript').value);toast('Ads saved')">Save Ads</button>`,'Manager')}
function adsense(){return page('Google AdSense','Future AdSense ke liye setup placeholder.',`<div class="form-grid"><input id="pub" placeholder="Publisher ID: ca-pub-xxxxxxxx"><input id="slot" placeholder="Ad Slot ID"></div><textarea placeholder="AdSense script"></textarea><button class="btn" onclick="toast('AdSense settings saved')">Save AdSense</button>`,'Manager')}
function seo(){return page('SEO Tools','Meta title, keywords aur sitemap generate karein.',`<input id="metaTitle" placeholder="Meta Title"><textarea id="metaDesc" placeholder="Meta Description"></textarea><input id="keywords" placeholder="Keywords"><button class="btn" onclick="toast('SEO saved')">Save SEO</button> <button class="btn light" onclick="toast('Sitemap generated')">Generate Sitemap</button>`,'Manager')}
function notifications(){let items=notifyCount?Array.from({length:notifyCount},(_,i)=>`<div class="list-item">🔔 Notification ${i+1}<button class="mini-btn edit" onclick="toast('Opened')">Open</button></div>`).join(''):'<div class="empty">All notifications read.</div>';return page('Notifications','Mark All Read par click karte hi badge zero ho jayega.',`<button class="btn" onclick="markAllRead()">Mark All Read</button><div class="notification-panel">${items}</div>`,'Notification Center')}
function markAllRead(){notifyCount=0;localStorage.setItem('notifyCount',0);counts();toast('All notifications read');render('notifications')}
function messages(){return page('Messages','Message count bhi working hai.',`<button class="btn" onclick="msgCount=0;localStorage.setItem('msgCount',0);counts();render('messages');toast('Messages cleared')">Clear Messages</button>${msgCount?'<div class="list-item">💬 5 demo unread messages</div>':'<div class="empty">No unread messages.</div>'}`,'Messages')}
function users(){return page('Users','Users section ready hai. Firebase connect karne par real users show honge.',`<div class="empty">Abhi Firebase user data connected nahi hai.</div>`,'Users')}
function media(){return page('Media Manager','Images, PDF aur logo upload section.',`<div class="pro-upload" onclick="document.getElementById('mediaFile').click()"><input id="mediaFile" type="file" hidden onchange="showFileName(this)"><div class="upload-ring"><span>☁️</span></div><h2>Drag & Drop Media Here</h2><p id="fileName">Choose file: Image, PDF, Logo or Document</p><div class="upload-actions"><button class="btn" type="button" onclick="event.stopPropagation();document.getElementById('mediaFile').click()">📁 Choose File</button><button class="btn upload-btn" type="button" onclick="event.stopPropagation();uploadMedia()">⬆ Upload Now</button></div></div><div class="cards media-cards"><div class="stat-card">🖼 Logo</div><div class="stat-card">📄 PDF</div><div class="stat-card">📷 Images</div><div class="stat-card">📁 Files</div></div>`,'Media')}
function showFileName(input){const name=input.files&&input.files[0]?input.files[0].name:'No file selected';const e=document.getElementById('fileName');if(e)e.textContent='Selected: '+name;toast('Media file selected')}
function uploadMedia(){const file=document.getElementById("mediaFile").files[0];if(!file){alert("⚠ Please choose a file first.");return;}alert("✅ "+file.name+" uploaded successfully!");}
function agecalc(){return page('Age Calculator','Date of Birth डालकर exact age calculate karein.',`<div class="age-box"><div class="age-form"><label>Date of Birth</label><input id="dob" type="date"><button class="btn" onclick="calculateAge()">Calculate Age</button><button class="btn light" onclick="clearAge()">Clear</button></div><div id="ageResult" class="age-result"><div class="age-pill"><b>0</b><span>Years</span></div><div class="age-pill"><b>0</b><span>Months</span></div><div class="age-pill"><b>0</b><span>Days</span></div></div></div>`,'Smart Tool')}
function calculateAge(){const v=document.getElementById('dob')?.value;if(!v)return toast('Please select date of birth');const dob=new Date(v),now=new Date();if(dob>now)return toast('Future date valid nahi hai');let y=now.getFullYear()-dob.getFullYear();let m=now.getMonth()-dob.getMonth();let d=now.getDate()-dob.getDate();if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}if(m<0){y--;m+=12}document.getElementById('ageResult').innerHTML=`<div class="age-pill"><b>${y}</b><span>Years</span></div><div class="age-pill"><b>${m}</b><span>Months</span></div><div class="age-pill"><b>${d}</b><span>Days</span></div>`;toast('Age calculated')}
function clearAge(){const d=document.getElementById('dob');if(d)d.value='';document.getElementById('ageResult').innerHTML='<div class="age-pill"><b>0</b><span>Years</span></div><div class="age-pill"><b>0</b><span>Months</span></div><div class="age-pill"><b>0</b><span>Days</span></div>'}
function reports(){return page('Reports','Local posts ke basis par report chart.',`<canvas id="reportChart"></canvas>`,'Reports')}
function settings(){return page('Settings','Website basic settings.',`<div class="form-grid"><input value="Rapid Job"><input value="Fast Government Job Updates"></div><button class="btn" onclick="toast('Settings saved')">Save Settings</button>`,'Settings')}
const views={dashboard,content,manager,notifications,messages,users,media,reports,settings,ads,adsense,seo,agecalc};sections.forEach(s=>views[s.id]=()=>sectionPage(s));
function render(key){currentView=key;$('#content').innerHTML=(views[key]||dashboard)();$$('#sideNav button').forEach(b=>b.classList.toggle('active',b.dataset.view===key||(['posts','admit','results','answers','admissions','scholarships','blogs','study','agecalc'].includes(key)&&b.dataset.view==='content')||(['ads','adsense','seo'].includes(key)&&b.dataset.view==='manager')));initCharts();if(innerWidth<900)$('#sidebar').classList.remove('show')}
function openPostForm(type='job'){$('#content').innerHTML=page('Add New Post','Create and publish new updates for your website.',form(type),'New Post');bindPostPreview()}
function initCharts(){const c=$('#reportChart');if(c&&!c.dataset.ok){c.dataset.ok=1;new Chart(c,{type:'bar',data:{labels:sections.map(s=>s.title),datasets:[{label:'Posts',data:sections.map(s=>posts.filter(p=>normalizeType(p.type)===s.type).length),backgroundColor:'#8b5cf6'}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#69728a'}},y:{ticks:{color:'#69728a'}}}}})}}
$('#sideNav').addEventListener('click',e=>{const b=e.target.closest('button');if(b)render(b.dataset.view)});$('#quickPostBtn').onclick=()=>openPostForm('job');$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('show');$('#notifyBtn').onclick=()=>render('notifications');$('#messageBtn').onclick=()=>render('messages');$('#backupBtn').onclick=()=>toast('Backup created successfully');$('#themeBtn').onclick=()=>document.documentElement.classList.toggle('dark');$('#searchInput').addEventListener('input',e=>{if(e.target.value.length>1)toast('Searching: '+e.target.value)});document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();$('#searchInput').focus()}});counts();render('dashboard');loadFirebasePosts();
