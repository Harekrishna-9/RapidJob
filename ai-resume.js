function showAlert(title, message, icon = "✅") {
  const box = document.getElementById("customAlert");
  const titleEl = document.getElementById("alertTitle");
  const messageEl = document.getElementById("alertMessage");
  const iconEl = document.querySelector(".alert-icon");
  if (!box || !titleEl || !messageEl || !iconEl) {
    window.alert(message || title);
    return;
  }
  titleEl.innerText = title;
  messageEl.innerText = message;
  iconEl.innerText = icon;
  box.classList.add("show");
}

function closeAlert() {
  const box = document.getElementById("customAlert");
  if (box) box.classList.remove("show");
}


function showView(view){
  document.querySelectorAll('.view-panel').forEach(p=>p.classList.remove('active-view'));
  const panel=document.getElementById(view); if(panel) panel.classList.add('active-view');
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));

const $=id=>document.getElementById(id);
const fields=['name','title','phone','email','location','link','summary','experience','education','skills','projects','certifications','languages','template','role','expLevel','eduDrop'];

const roleData={
  'Stock Manager':{title:'Stock Manager',skills:'Inventory Management, Stock Audit, MS Excel, Store Operations, Billing Support, Vendor Coordination, Data Entry, Reporting',summary:'Dedicated and detail-oriented Stock Manager with {exp} experience in inventory management, stock handling, documentation and store operations. Skilled in maintaining accurate stock records, checking product availability, coordinating with team members and supporting smooth daily operations with responsibility and discipline.'},
  'Data Entry Operator':{title:'Data Entry Operator',skills:'Typing, MS Word, MS Excel, Internet Research, Documentation, Accuracy, File Management, Data Verification',summary:'Accurate and responsible Data Entry Operator with {exp} experience in computer work, documentation, record management and data verification. Able to handle office tasks, maintain clean records and complete assigned work on time with strong attention to detail.'},
  'Accountant':{title:'Accountant',skills:'Tally, GST, MS Excel, Billing, Ledger, Bank Reconciliation, Invoice Management, Financial Reporting',summary:'Organized and detail-focused Accountant with {exp} experience in billing, ledger maintenance, GST-related documentation and financial record keeping. Skilled in MS Excel, invoice management and supporting accurate accounting operations.'},
  'Teacher':{title:'Teacher',skills:'Lesson Planning, Classroom Management, Communication, Student Assessment, Subject Knowledge, MS Office, Online Teaching',summary:'Passionate and disciplined Teacher with {exp} experience in student guidance, lesson planning and classroom management. Strong ability to explain concepts clearly, maintain learning records and support student growth with patience and responsibility.'},
  'Web Developer':{title:'Web Developer',skills:'HTML, CSS, JavaScript, Responsive Design, GitHub, Firebase, UI Design, Debugging',summary:'Creative and practical Web Developer with {exp} experience in building responsive websites using HTML, CSS and JavaScript. Skilled in clean UI design, debugging, GitHub deployment and creating user-friendly web pages.'},
  'Sales Executive':{title:'Sales Executive',skills:'Customer Handling, Sales Target, Product Knowledge, Communication, Lead Follow-up, Negotiation, Reporting',summary:'Result-oriented Sales Executive with {exp} experience in customer handling, product explanation, lead follow-up and sales support. Able to communicate clearly, understand customer needs and contribute to business growth with a positive attitude.'},
  'Computer Operator':{title:'Computer Operator',skills:'MS Office, Typing, Internet, Email Handling, Printing, Scanning, Data Entry, Documentation',summary:'Reliable Computer Operator with {exp} experience in office computer work, typing, email handling, documentation and data entry. Skilled in MS Office, internet operations and maintaining organized digital records.'},
  'Office Assistant':{title:'Office Assistant',skills:'Office Management, Documentation, MS Word, MS Excel, Communication, File Handling, Scheduling, Data Entry',summary:'Responsible Office Assistant with {exp} experience in documentation, file handling, office coordination and daily administrative support. Skilled in MS Office, communication and maintaining accurate records.'},
  'Hotel Manager':{title:'Hotel Manager',skills:'Hotel Operations, Guest Handling, Staff Coordination, Billing Support, Inventory, Housekeeping Supervision, Communication',summary:'Professional Hotel Manager with {exp} experience in guest handling, staff coordination, daily hotel operations and service quality management. Able to manage responsibilities with discipline, communication and customer-focused service.'},
  'Nurse / GNM':{title:'Nurse / GNM',skills:'Patient Care, Vital Signs, Ward Management, Documentation, Emergency Support, Communication, Infection Control',summary:'Compassionate and disciplined Nurse / GNM professional with {exp} experience in patient care, vital signs monitoring, ward support and medical documentation. Able to assist patients and healthcare teams with responsibility, patience and care.'}
};

function expText(){return $('expLevel').value ? $('expLevel').value.toLowerCase() : 'relevant';}
function autoByDropdown(){
  const role=$('role').value;
  const data=roleData[role];
  if(data){
    if(!$('title').value.trim() || Object.values(roleData).some(x=>x.title===$('title').value.trim())) $('title').value=data.title;
    $('summary').value=data.summary.replace('{exp}',expText());
    $('skills').value=data.skills;
  } else {
    if(!$('summary').value.trim()) $('summary').value='';
    if(!$('skills').value.trim()) $('skills').value='';
  }
  const edu=$('eduDrop').value;
  if(edu && !$('education').value.trim()) $('education').placeholder=`Example: ${edu} - Board / University Name`;
  update();
}

function load(){
  const saved=JSON.parse(localStorage.getItem('resumeProClean')||'{}');
  fields.forEach(f=>{if($(f))$(f).value=saved[f]||''});
  if(!$('template').value)$('template').value='executive';
  update();
}
function save(){const data={};fields.forEach(f=>{if($(f))data[f]=$(f).value});localStorage.setItem('resumeProClean',JSON.stringify(data));updateStrength();showAlert("Saved", "Resume details saved successfully.", "✅")}
function list(txt){return (txt||'').split(/,|\n/).map(x=>x.trim()).filter(Boolean).map(x=>`<li>${x}</li>`).join('')||'<li>Your skills will appear here.</li>'}
function update(){
  const contact=[$('phone').value,$('email').value,$('location').value,$('link').value].filter(Boolean).join(' | ');
  $('rName').textContent=$('name').value||'YOUR NAME';
  $('rTitle').textContent=$('title').value||'PROFESSIONAL TITLE';
  $('rContact').textContent=contact||'Phone | Email | Location';
  $('rSummary').textContent=$('summary').value||'Your professional summary will appear here.';
  $('rExperience').textContent=$('experience').value||'Your work experience will appear here.';
  $('rEducation').textContent=$('education').value||'Your education details will appear here.';
  $('rSkills').innerHTML=list($('skills').value);
  $('rProjects').textContent=$('projects').value||'Your projects or achievements will appear here.';
  $('rCertifications').textContent=$('certifications').value||'Your certifications will appear here.';
  $('rLanguages').textContent=$('languages').value||'Your languages will appear here.';
  $('resume').className='resume '+($('template').value||'executive');
  updateStrength();
}
function updateStrength(){
  let score=0;
  ['name','phone','email','summary','experience','education','skills'].forEach(f=>{if($(f).value.trim())score+=13});
  if($('role').value)score+=5;if($('expLevel').value)score+=4;if($('eduDrop').value)score+=4;
  score=Math.min(score,100);
  $('strengthText').textContent=score+'%';$('strengthBar').style.width=score+'%';
}
fields.forEach(f=>setTimeout(()=>$(f)&&$(f).addEventListener('input',update),0));
['role','expLevel','eduDrop'].forEach(id=>$(id).addEventListener('change',autoByDropdown));
$('template').addEventListener('change',update);
$('saveBtn').onclick=save;
$('resetBtn').onclick=()=>{if(confirm('Clear all details?')){localStorage.removeItem('resumeProClean');fields.forEach(f=>{if($(f))$(f).value=''});$('template').value='executive';update();showAlert("Cleared", "All resume details have been cleared.", "🗑️")}};
$('photo').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{$('rPhoto').src=reader.result;$('rPhoto').hidden=false};reader.readAsDataURL(file)};
load();


/* ===== Professional Center Popup System ===== */
function popupIcon(type){
  if(type === "success") return "✅";
  if(type === "error") return "❌";
  if(type === "warning") return "⚠️";
  if(type === "info") return "ℹ️";
  return type || "✅";
}

function ensurePopupBox(){
  let box = document.getElementById("customAlert");
  if(box) return box;

  box = document.createElement("div");
  box.id = "customAlert";
  box.className = "custom-alert";
  box.innerHTML = `
    <div class="alert-box">
      <button class="alert-close" type="button" aria-label="Close">×</button>
      <div class="alert-icon">✅</div>
      <h3 id="alertTitle">Success</h3>
      <p id="alertMessage">Your action completed successfully.</p>
      <div class="alert-actions">
        <button class="alert-ok" type="button">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(box);

  box.querySelector(".alert-close").onclick = closeAlert;
  box.querySelector(".alert-ok").onclick = closeAlert;
  box.addEventListener("click", function(e){
    if(e.target === box) closeAlert();
  });

  return box;
}

function showAlert(title, message, type = "success", autoClose = 2500) {
  const box = ensurePopupBox();
  const icon = popupIcon(type);

  box.querySelector("#alertTitle").innerText = title || "Message";
  box.querySelector("#alertMessage").innerText = message || "";
  box.querySelector(".alert-icon").innerText = icon;

  box.classList.remove("success","error","warning","info");
  if(["success","error","warning","info"].includes(type)) box.classList.add(type);

  box.classList.add("show");

  clearTimeout(window.__resumeAlertTimer);
  if(autoClose){
    window.__resumeAlertTimer = setTimeout(closeAlert, autoClose);
  }
}

function closeAlert() {
  const box = document.getElementById("customAlert");
  if(box) box.classList.remove("show");
}

function showConfirm(title, message, onYes){
  const box = ensurePopupBox();
  const actions = box.querySelector(".alert-actions");

  box.querySelector("#alertTitle").innerText = title || "Are you sure?";
  box.querySelector("#alertMessage").innerText = message || "";
  box.querySelector(".alert-icon").innerText = "⚠️";

  box.classList.remove("success","error","info");
  box.classList.add("warning");

  actions.innerHTML = `
    <button class="alert-cancel" type="button">Cancel</button>
    <button class="alert-ok" type="button">Yes, Clear</button>
  `;

  actions.querySelector(".alert-cancel").onclick = function(){
    actions.innerHTML = `<button class="alert-ok" type="button">OK</button>`;
    actions.querySelector(".alert-ok").onclick = closeAlert;
    closeAlert();
  };

  actions.querySelector(".alert-ok").onclick = function(){
    actions.innerHTML = `<button class="alert-ok" type="button">OK</button>`;
    actions.querySelector(".alert-ok").onclick = closeAlert;
    closeAlert();
    if(typeof onYes === "function") onYes();
  };

  clearTimeout(window.__resumeAlertTimer);
  box.classList.add("show");
}
