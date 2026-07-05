const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();
const db=firebase.database();
let POSTS={};
const $=id=>document.getElementById(id);
const fields=['title','type','state','organization','updatedOn','totalPost','description','details','startDate','lastDate','feeDate','correctionDate','examDate','admitDate','fee','ageText','ageAsOn','eligibility','vacancyTable','examPattern','selectionProcess','howToApply','salary','documents','applyLink','pdfLink','officialLink','imageUrl','seoTitle','metaDescription','faq'];
const typeLabel={job:'Latest Job',admit:'Admit Card',result:'Result',answer:'Answer Key',syllabus:'Syllabus',admission:'Admission',scholarship:'Scholarship',yojana:'Sarkari Yojana',documents:'Documents',blog:'Latest Blog',study:'Free Study Material'};

window.loginAdmin=e=>{e.preventDefault();auth.signInWithEmailAndPassword(email.value,password.value).catch(err=>loginMsg.textContent=err.message)};
window.logoutAdmin=()=>auth.signOut();
auth.onAuthStateChanged(user=>{loginScreen.classList.toggle('hide',!!user);adminApp.classList.toggle('hide',!user);if(user)loadPosts();});

document.addEventListener('click',e=>{const btn=e.target.closest('.side-link');if(!btn)return;document.querySelectorAll('.side-link').forEach(x=>x.classList.remove('active'));btn.classList.add('active');showView(btn.dataset.view);});
window.showView=id=>{document.querySelectorAll('.view').forEach(v=>v.classList.add('hide'));$(id).classList.remove('hide');pageTitle.textContent={dashboard:'Dashboard',addPost:'Add Post',allPosts:'All Posts',tools:'Tools',settings:'Settings'}[id]||'Dashboard';if(id==='allPosts')renderPostsTable();};

function loadPosts(){db.ref('posts').on('value',snap=>{POSTS=snap.val()||{};renderDashboard();renderPostsTable();});}
function postsArray(){return Object.entries(POSTS).map(([id,p])=>({id,...p})).sort((a,b)=>(b.time||0)-(a.time||0));}
function renderDashboard(){const arr=postsArray();statTotal.textContent=arr.length;statJobs.textContent=arr.filter(p=>p.type==='job').length;statAdmit.textContent=arr.filter(p=>p.type==='admit').length;statResult.textContent=arr.filter(p=>p.type==='result').length;statTrending.textContent=arr.filter(p=>p.trending).length;statPublished.textContent=arr.filter(p=>p.published!==false).length;recentPosts.innerHTML=tableHtml(arr.slice(0,6));}
window.renderPostsTable=()=>{const q=(searchAdmin?.value||'').toLowerCase();const ft=filterType?.value||'all';let arr=postsArray().filter(p=>(ft==='all'||p.type===ft)&&(!q||JSON.stringify(p).toLowerCase().includes(q)));postsTable.innerHTML=tableHtml(arr);};
function tableHtml(arr){if(!arr.length)return '<p class="hint">No posts found.</p>';return `<table class="admin-table"><thead><tr><th>Title</th><th>Type</th><th>State</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>${arr.map(p=>`<tr><td><b>${esc(p.title||'Untitled')}</b><br><small>${esc(p.organization||'')}</small></td><td><span class="badge">${typeLabel[p.type]||p.type||'Update'}</span></td><td>${esc(p.state||'Central')}</td><td><span class="badge status">${p.published===false?'Draft':'Published'}</span>${p.trending?' <span class="badge">Trending</span>':''}</td><td>${esc(p.updatedOn||p.lastDate||'')}</td><td><div class="row-actions"><button onclick="editPost('${p.id}')">Edit</button><button onclick="openPost('${p.id}')">View</button><button class="delete" onclick="deletePost('${p.id}')">Delete</button></div></td></tr>`).join('')}</tbody></table>`;}
function esc(s){return (s||'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
window.savePost=async e=>{e.preventDefault();const id=editId.value||Date.now().toString();let post={};fields.forEach(f=>post[f]=$(f)?.value||'');post.trending=isTrending.checked;post.published=isPublished.checked;post.featured=isFeatured.checked;post.time=POSTS[id]?.time||Date.now();post.updatedAt=Date.now();post.slug=slugify(post.title);await db.ref('posts/'+id).set(post);alert(editId.value?'Updated successfully':'Saved successfully');resetForm();showView('allPosts');};
window.editPost=id=>{const p=POSTS[id];if(!p)return;editId.value=id;fields.forEach(f=>{if($(f))$(f).value=p[f]||''});isTrending.checked=!!p.trending;isPublished.checked=p.published!==false;isFeatured.checked=!!p.featured;formTitle.textContent='Edit Update';showView('addPost');};
window.deletePost=id=>{if(confirm('Delete this post?'))db.ref('posts/'+id).remove();};
window.openPost=id=>window.open('job-detail.html?id='+id,'_blank');
window.resetForm=()=>{postForm.reset();editId.value='';isPublished.checked=true;formTitle.textContent='Add New Update';};
window.previewPost=()=>{if(editId.value)openPost(editId.value);else alert('Save first, then preview.');};
function slugify(t){return (t||'post').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);}
window.generateSitemap=()=>{const base=location.origin+location.pathname.replace(/admin\.html.*$/,'');let xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+base+'</loc></url>';postsArray().forEach(p=>xml+=`<url><loc>${base}job-detail.html?id=${p.id}</loc></url>`);xml+='</urlset>';download('sitemap.xml',xml,'text/xml');};
window.downloadBackup=()=>download('rapidjob-posts-backup.json',JSON.stringify(POSTS,null,2),'application/json');
function download(name,data,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
window.clearLocalCache=async()=>{if('caches'in window){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}localStorage.clear();alert('Local cache cleared.');};
window.copyWebsiteUrl=()=>navigator.clipboard.writeText(location.origin+location.pathname.replace(/admin\.html.*$/,'index.html')).then(()=>alert('Website URL copied'));
