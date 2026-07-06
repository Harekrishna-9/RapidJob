const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
firebase.initializeApp(firebaseConfig);

const detailBox=document.getElementById('detailBox');
const id=new URLSearchParams(location.search).get('id');
const safe=v=>(v??'').toString().trim();
const esc=v=>safe(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const br=v=>esc(v).replaceAll('\n','<br>');
const val=(p,k,d='Check Notification')=>safe(p[k])||d;
const list=(v,fb=[])=>{let arr=Array.isArray(v)?v:safe(v).split('\n').filter(Boolean); if(!arr.length) arr=fb; return arr.map(x=>`<li>${br(x)}</li>`).join('');};

const demoPost={
  title:'RRB Ministerial & Isolated Categories Online Form 2026',
  organization:'Railway Recruitment Board',
  updatedOn:'04 July 2026 10:42 PM',
  description:'Railway Recruitment Board (RRB) invites online applications for the recruitment of various ministerial and isolated categories posts. A total of 312 vacancies are available. Interested and eligible candidates can apply online from 30th December 2025 to 29th January 2026. Read the full notification before applying.',
  startDate:'30-12-2025', lastDate:'29-01-2026', feeDate:'31-01-2026', examDate:'14 & 15 July 2026', ageAsOn:'01.01.2026', minAge:'18 Years', maxAge:'See Below Post Wise', totalPost:'312',
  applyLink:'#', pdfLink:'#', officialLink:'#',
  fee:'SC / ST / Female / ESM / Minorities / EBC: Rs.250/-\nAll Other Candidates: Rs.500/-\nPayment can be made through Debit Card, Credit Card, Internet Banking or UPI.',
  selectionProcess:'Computer Based Test (CBT)\nSkill Test / Typing Test (Post Wise)\nDocument Verification\nMedical Examination',
  howToApply:'Visit the official website of RRB.\nClick on the Apply Online link.\nFill the application form carefully.\nUpload required documents and pay the fee.\nSubmit and take a printout for future reference.',
  salary:'Pay Level-2 to Pay Level-7\nAs per 7th CPC Pay Matrix and other allowances as applicable.',
  eligibility:'Read the official notification carefully for post wise eligibility, educational qualification, age limit and other details.',
  vacancyRows:[['Chief Law Assistant','Level-6','54','Degree in Law with 3 Years Practice'],['Junior Translator (Hindi)','Level-6','130','Master Degree with Hindi & English'],['Staff and Welfare Inspector','Level-6','08','Graduate + Relevant Diploma'],['Scientific Assistant / Training','Level-6','16','Master Degree in Psychology'],['Lab Assistant Grade-III','Level-2','12','12th with Science (PCM)']],
  examRows:[['General Intelligence & Reasoning','50','50','90 Minutes'],['General Awareness','40','40',''],['General Science','40','40',''],['Mathematics','40','40','']],
  faq:'What is the last date to apply? | 29-01-2026\nWhat is the application fee? | Rs.250/- for reserved and Rs.500/- for others.\nWhat is the total number of vacancies? | 312 Posts'
};

function vacancyTable(p){
  if(safe(p.vacancyTable)) return p.vacancyTable;
  const rows=p.vacancyRows||[[val(p,'postName',val(p,'title','Post Name')),'-',val(p,'totalPost','--'),val(p,'eligibility','Read official notification for eligibility details.')]];
  return `<table class="vacancy-table"><tr><th>Post Name</th><th>Pay Level</th><th>Total Post</th><th>Eligibility</th></tr>${rows.map(r=>`<tr><td>${br(r[0])}</td><td>${br(r[1])}</td><td>${br(r[2])}</td><td>${br(r[3])}</td></tr>`).join('')}</table>`;
}
function examTable(p){
  const rows=p.examRows||[['General Intelligence & Reasoning','50','50','90 Minutes'],['General Awareness','40','40',''],['General Science','40','40',''],['Mathematics','40','40','']];
  return `<table class="exam-table"><tr><th>Subject</th><th>Questions</th><th>Marks</th><th>Duration</th></tr>${rows.map(r=>`<tr><td>${br(r[0])}</td><td>${br(r[1])}</td><td>${br(r[2])}</td><td>${br(r[3])}</td></tr>`).join('')}</table>`;
}
function faqHtml(p){
  const lines=safe(p.faq).split('\n').filter(Boolean);
  if(!lines.length) return '<p><b>Q.</b> What is the last date to apply?<br><b>Ans:</b> Check notification.</p>';
  return lines.map(x=>{const [q,a]=x.split('|');return `<p><b>Q.</b> ${br(q)}<br><b>Ans:</b> ${br(a||'Check notification')}</p>`}).join('');
}
function setShare(){
  const u=encodeURIComponent(location.href), t=encodeURIComponent(document.title);
  document.getElementById('shareFb').href=`https://www.facebook.com/sharer/sharer.php?u=${u}`;
  document.getElementById('shareTw').href=`https://twitter.com/intent/tweet?url=${u}&text=${t}`;
  document.getElementById('shareWa').href=`https://api.whatsapp.com/send?text=${t}%20${u}`;
  document.getElementById('shareTg').href=`https://t.me/share/url?url=${u}&text=${t}`;
  document.getElementById('copyLink').onclick=e=>{e.preventDefault();navigator.clipboard.writeText(location.href);alert('Link copied');};
}
function renderDetail(p){
  p={...demoPost,...p};
  const title=val(p,'title','Rapid Job Details');
  document.title=title+' | Rapid Job';
  detailBox.innerHTML=`
    <div class="breadcrumb">🏠 Home / Current Job / ${br(title)}</div>
    <div class="job-card">
      <div class="top-flex"><div class="job-main"><h1 class="job-title">${br(title)}</h1><p class="updated">▣ Updated On : ${br(val(p,'updatedOn'))}</p><p class="desc">${br(val(p,'description')).replace(/312|30th December 2025|29th January 2026/g,m=>`<b>${m}</b>`)}</p></div><div class="job-logo">🚆</div></div>
      <div class="btn-row"><a class="btn btn-yellow" href="index.html#latest">▣ View All Jobs</a><a class="btn btn-green" href="${val(p,'applyLink','#')}" target="_blank">➤ Apply Online</a><a class="btn btn-blue" href="${val(p,'officialLink','#')}" target="_blank">🌐 Official Website</a></div>
      <div class="info-grid"><div class="info-box"><h2>▣ Important Dates</h2><div class="body"><ul><li>Application Start Date : <b>${br(val(p,'startDate'))}</b></li><li>Application Last Date : <span class="red">${br(val(p,'lastDate'))}</span></li><li>Fee Payment Last Date : <b>${br(val(p,'feeDate'))}</b></li><li>Exam Date : <b>${br(val(p,'examDate'))}</b></li></ul></div></div><div class="info-box"><h2>▣ Application Fee</h2><div class="body"><ul>${list(p.fee)}</ul></div></div><div class="info-box"><h2>👤 Age Limit (As on ${br(val(p,'ageAsOn','01-01-2026'))})</h2><div class="body"><ul><li>Minimum Age : <b>${br(val(p,'minAge'))}</b></li><li>Maximum Age : <b>${br(val(p,'maxAge'))}</b></li><li>Age Relaxation : As per Government Rules</li></ul><a href="#">Age Calculator</a></div></div><div class="info-box"><h2>▣ Total Post</h2><div class="total-post">${br(val(p,'totalPost','--'))}</div></div></div>
      <div class="section-title">▣ Vacancy Details</div>${vacancyTable(p)}
      <div class="notice-box"><div><b>✅ Vacancy Criteria</b><br>Candidates must read the official notification carefully before applying. Post wise eligibility, educational qualification, age limit, experience and other details are available in the official notification.</div><a class="download-btn" href="${val(p,'pdfLink','#')}" target="_blank">▣ Download Notification</a></div>
      <div class="two-col"><div class="mini-panel"><h3>🏆 Selection Process</h3><ul>${list(p.selectionProcess)}</ul></div><div class="mini-panel"><h3>▣ Exam Pattern (CBT)</h3>${examTable(p)}</div><div class="mini-panel"><h3>₹ Salary / Pay Scale</h3><p>${br(val(p,'salary','Check notification for salary details.'))}</p></div><div class="mini-panel"><h3>📦 How to Apply</h3><ol>${list(p.howToApply).replaceAll('<li>','<li>')}</ol></div><div class="mini-panel links-panel"><h3>🔗 Important Links</h3><div class="important-links">
<a class="imp-card apply" href="${val(p,'applyLink','#')}" target="_blank"><i class="fa-solid fa-paper-plane"></i><span>Apply</span></a>
<a class="imp-card notification" href="${val(p,'pdfLink','#')}" target="_blank"><i class="fa-solid fa-file-lines"></i><span>Notification</span></a>
<a class="imp-card syllabus" href="index.html#syllabus"><i class="fa-solid fa-book-open"></i><span>Syllabus</span></a>
<a class="imp-card website" href="${val(p,'officialLink','#')}" target="_blank"><i class="fa-solid fa-globe"></i><span>Website</span></a>
</div></div><div class="mini-panel faq-panel"><h3>❔ FAQ</h3>${faqHtml(p)}</div></div>
      <div class="bottom-disclaimer disclaimer"><b>🛡 Disclaimer</b>This website will not be responsible at all in case of minor or major mistakes or inaccuracy. Before taking any action please check the official notification or portal.</div>
    </div>`;
  setShare();
}

if(!id || id==='demo3') renderDetail(demoPost);
else firebase.database().ref('posts/'+id).once('value').then(s=>renderDetail(s.val()||demoPost)).catch(()=>renderDetail(demoPost));
