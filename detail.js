const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
firebase.initializeApp(firebaseConfig);

const detailBox=document.getElementById('detailBox');
const id=new URLSearchParams(location.search).get('id');

const safe=v=>(v||'').toString().trim();
const br=v=>safe(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\n','<br>');
const list=v=>safe(v).split('\n').filter(Boolean).map(x=>`<li>${br(x)}</li>`).join('');
const val=(p,k,d='Check Notification')=>safe(p[k])||d;

function renderDetail(p){
  document.title=(p.title||'Job Details')+' | Rapid Job';
  const title=val(p,'title','Rapid Job Details');
  const updated=val(p,'updatedOn',new Date().toLocaleDateString('en-IN'));
  const desc=val(p,'description', val(p,'details','Interested candidates can read the full notification carefully before applying online.'));
  const apply=p.applyLink||'#';
  const pdf=p.pdfLink||'#';
  const official=p.officialLink||p.applyLink||'#';

  detailBox.innerHTML=`
    <h1 class="job-title">${br(title)}</h1>
    <div class="updated">Updated On : ${br(updated)}</div>
    <p class="short-desc">${br(desc)}</p>
    <p class="italic-note">Interested candidates read the full notification carefully, before applying online.</p>

    <div class="action-box">
      <div class="action-row">
        <a href="index.html#latest">☑ View All Jobs</a>
        <a href="${apply}" target="_blank">≫ Apply Online</a>
      </div>
      <a class="official-pill" href="${official}" target="_blank">${br(p.organization||'Official Website')}</a>
    </div>

    <section class="info-grid">
      <div class="info-box">
        <h2>Important Dates</h2>
        <div class="content"><ul>
          <li>Application Start Date: <b>${br(val(p,'startDate','Check Notification'))}</b></li>
          <li>Application Last Date: <span class="red">${br(val(p,'lastDate','Check Notification'))}</span></li>
          <li>Fee Payment Last Date: <b>${br(val(p,'feeDate','Check Notification'))}</b></li>
          <li>Exam Date: <b>${br(val(p,'examDate','As per schedule'))}</b></li>
        </ul></div>
      </div>
      <div class="info-box">
        <h2>Application Fee</h2>
        <div class="content"><ul>
          ${list(p.fee)||'<li>General / OBC / EWS: <b>Check Notification</b></li><li>SC / ST / Female: <b>Check Notification</b></li><li>Payment can be made by Debit Card, Credit Card, Net Banking or UPI.</li>'}
        </ul></div>
      </div>
      <div class="info-box">
        <h2>Age Limit</h2>
        <div class="content"><ul>
          <li>Age as On : <b>${br(val(p,'ageAsOn','Check Notification'))}</b></li>
          <li>Minimum Age: <b>${br(val(p,'minAge','Check Notification'))}</b></li>
          <li>Maximum Age: <span class="red">${br(val(p,'maxAge','See Notification'))}</span></li>
          <li>For Age Relaxation See Notification.</li>
        </ul></div>
      </div>
      <div class="info-box">
        <h2>Total Post</h2>
        <div class="total-post">${br(val(p,'totalPost','--'))}</div>
      </div>
    </section>

    <h2 class="blue-heading">${br(title)} Eligibility / Vacancy Details 2026</h2>
    <h3 class="sub-heading">Vacancy Details</h3>
    ${safe(p.vacancyTable)?`<div>${p.vacancyTable}</div>`:`<table class="simple-table"><tr><th>Post Name</th><th>Total Post</th><th>Eligibility</th></tr><tr><td>${br(val(p,'postName',title))}</td><td>${br(val(p,'totalPost','--'))}</td><td>${br(val(p,'eligibility','Read official notification for complete eligibility details.'))}</td></tr></table>`}

    <h3 class="sub-heading">Eligibility</h3>
    <p>${br(val(p,'eligibility','Read official notification for post wise eligibility, age limit and qualification details.'))}</p>

    <h3 class="sub-heading">Selection Process</h3>
    <ul>${list(p.selectionProcess)||'<li>Written Exam / CBT</li><li>Document Verification</li><li>Medical Examination</li>'}</ul>

    <h3 class="sub-heading">How to Apply</h3>
    <ul>${list(p.howToApply)||'<li>Open the official apply link.</li><li>Fill the online form carefully.</li><li>Upload required documents.</li><li>Pay application fee if applicable.</li><li>Submit form and take a printout.</li>'}</ul>

    <h3 class="sub-heading">Important Links</h3>
    <table class="simple-table important-links">
      <tr><th>Apply Online</th><td><a href="${apply}" target="_blank">Click Here</a></td></tr>
      <tr><th>Download Notification</th><td><a href="${pdf}" target="_blank">Click Here</a></td></tr>
      <tr><th>Official Website</th><td><a href="${official}" target="_blank">Click Here</a></td></tr>
    </table>

    <div class="discover-side discover-bottom">
      <h3>Discover more</h3>
      <a href="index.html#latest">Job <span>›</span></a>
      <a href="index.html#result">Result Updates <span>›</span></a>
      <a href="index.html#syllabus">Syllabus <span>›</span></a>
    </div>

    <div class="disclaimer"><b>Disclaimer:</b> This website will not be responsible at all in case of minor or major mistakes or inaccuracy. The information provided by this website is true and accurate according to the recruitment notification or advertisement or information brochure etc. Before taking any action please look into the recruitment notification or advertisement or portal. "I Hope You Will Understand Our Word".</div>
  `;
}

if(!id){
  renderDetail({title:'Rapid Job Detail Page',description:'No post selected. Please open any job from home page.',totalPost:'--'});
}else{
  firebase.database().ref('posts/'+id).once('value').then(s=>{
    const p=s.val();
    if(!p){detailBox.innerHTML='<div class="loading">Post not found</div>';return;}
    renderDetail(p);
  }).catch(()=>{detailBox.innerHTML='<div class="loading">Unable to load post details.</div>';});
}
