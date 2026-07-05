const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth(),db=firebase.database();
const $=id=>document.getElementById(id);
const fields=['title','type','state','organization','updatedOn','totalPost','description','details','startDate','lastDate','feeDate','correctionDate','examDate','admitCardDate','fee','ageAsOn','minAge','maxAge','salary','eligibility','vacancyRowsText','selectionProcess','examRowsText','howToApply','faq','applyLink','pdfLink','officialLink','imageUrl'];
const labels={job:'Latest Job',admit:'Admit Card',result:'Result',answer:'Answer Key',syllabus:'Syllabus',admission:'Admission',scholarship:'Scholarship'};

window.loginAdmin=()=>auth.signInWithEmailAndPassword($('email').value,$('password').value).catch(e=>$('msg').innerText=e.message);
window.logoutAdmin=()=>auth.signOut();
auth.onAuthStateChanged(u=>{ $('loginBox').classList.toggle('hide',!!u); $('adminPanel').classList.toggle('hide',!u); if(u)loadAdminPosts(); });

window.showForm=t=>{ $('type').value=t; $('formTitle').innerText='Add '+(labels[t]||'Update'); };

function parseRows(text,cols){
  return (text||'').split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
    const parts=line.split('|').map(p=>p.trim());
    while(parts.length<cols) parts.push('');
    return parts.slice(0,cols);
  });
}
function rowsToText(rows){ return Array.isArray(rows)?rows.map(r=>r.join(' | ')).join('\n'):''; }
function nowText(){ return new Date().toLocaleString('en-IN',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}); }

window.savePost=async()=>{
  const title=$('title').value.trim();
  if(!title){ alert('Title required'); return; }
  const id=$('editId').value || Date.now().toString();
  const data={};
  fields.forEach(f=>{ if($(f)) data[f]=$(f).value.trim(); });
  data.trending=$('isTrending').checked;
  data.time=Date.now();
  data.updatedOn=data.updatedOn || nowText();
  data.vacancyRows=parseRows(data.vacancyRowsText,4);
  data.examRows=parseRows(data.examRowsText,4);
  delete data.vacancyRowsText;
  delete data.examRowsText;
  await db.ref('posts/'+id).set(data);
  alert($('editId').value?'Updated':'Saved');
  clearForm();
};

window.clearForm=()=>{
  $('editId').value='';
  fields.forEach(f=>{ if($(f)) $(f).value=''; });
  $('type').value='job';
  $('isTrending').checked=false;
  $('formTitle').innerText='Add Update';
};

function fillForm(id,p){
  $('editId').value=id;
  fields.forEach(f=>{ if($(f)) $(f).value=p[f]||''; });
  $('vacancyRowsText').value=rowsToText(p.vacancyRows);
  $('examRowsText').value=rowsToText(p.examRows);
  $('isTrending').checked=!!p.trending;
  $('formTitle').innerText='Edit Update';
  scrollTo({top:0,behavior:'smooth'});
}
window.editPost=id=>db.ref('posts/'+id).once('value').then(s=>fillForm(id,s.val()||{}));
window.delPost=id=>confirm('Delete this update?')&&db.ref('posts/'+id).remove();

function loadAdminPosts(){
  db.ref('posts').on('value',s=>{
    const data=s.val()||{};
    const rows=Object.entries(data).sort((a,b)=>(b[1].time||0)-(a[1].time||0));
    $('adminPosts').innerHTML=rows.map(([id,p])=>`<div class="post-row"><div><h3>${p.title||'Untitled'}</h3><p>${labels[p.type]||p.type||'Update'} • ${p.state||'Central'} • Total Post: ${p.totalPost||'--'}</p></div><div class="post-actions"><a class="btn secondary" href="job-detail.html?id=${id}" target="_blank">View</a><button class="btn green" onclick="editPost('${id}')">Edit</button><button onclick="delPost('${id}')">Delete</button></div></div>`).join('')||'No posts';
  });
}

window.generateSitemap=()=>{
  db.ref('posts').once('value').then(s=>{
    const data=s.val()||{};
    const base=location.origin+location.pathname.replace(/admin\.html.*$/,'');
    let xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml+=`<url><loc>${base}index.html</loc></url>\n`;
    Object.keys(data).forEach(id=>xml+=`<url><loc>${base}job-detail.html?id=${id}</loc></url>\n`);
    xml+='</urlset>';
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([xml],{type:'text/xml'}));
    a.download='sitemap.xml';
    a.click();
  });
};
