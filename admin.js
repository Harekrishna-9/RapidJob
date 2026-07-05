const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

const demoPosts = [
  {title:'SSC CGL 2026 Notification', type:'Latest Job', status:'Published', date:'05 Jun 2026'},
  {title:'Railway Group D Exam Date', type:'Admit Card', status:'Active', date:'04 Jun 2026'},
  {title:'BPSC 70th Result', type:'Result', status:'Published', date:'03 Jun 2026'},
  {title:'JSSC CGL Syllabus PDF', type:'Syllabus', status:'Draft', date:'02 Jun 2026'},
];

const views = {
  dashboard: $('#dashboardView')?.innerHTML || '',
  'posts management': tableView('Posts Management', 'Manage all jobs, results, admit cards and syllabus posts.'),
  'admit cards': tableView('Admit Cards', 'Upload and update admit card details.'),
  results: tableView('Results', 'Publish result updates and merit list links.'),
  'answer keys': tableView('Answer Keys', 'Manage answer keys and objection links.'),
  syllabus: tableView('Syllabus', 'Upload syllabus posts and PDF links.'),
  admissions: tableView('Admissions', 'Manage admission forms and important dates.'),
  scholarships: tableView('Scholarships', 'Manage scholarship posts and eligibility.'),
  'breaking news': newsView(),
  trending: tableView('Trending Jobs', 'Top viewed jobs and popular searches.'),
  users: statsView('Users', ['Total Users: 12,845','New Users: 248','Blocked Users: 810','Active Users: 8,542']),
  messages: messagesView(),
  'media manager': mediaView(),
  'ads manager': adsView(),
  'analytics & reports': analyticsView(),
  'seo tools': seoView(),
  'google adsense': adsenseManagerView(),
  notifications: statsView('Notifications', ['Sent: 324','Pending: 18','Failed: 2','Today: 32']),
  'backup & restore': backupView(),
  settings: settingsView()
};

function tableView(title, desc){
  return `<section class="page-view"><h2>${title}</h2><p>${desc}</p><div class="toolbar"><button onclick="openPostForm('${title}')">+ Add New</button><button onclick="showToast('Export ready')">Export</button></div><div class="table-card"><table><thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>${demoPosts.map(p=>`<tr><td>${p.title}</td><td>${p.type}</td><td><span class="badge">${p.status}</span></td><td>${p.date}</td><td><button onclick="showToast('Edit opened')">Edit</button> <button onclick="showToast('Deleted demo item')">Delete</button></td></tr>`).join('')}</tbody></table></div></section>`;
}
function statsView(title, items){return `<section class="page-view"><h2>${title}</h2><div class="stat-grid">${items.map(x=>`<div class="glass"><b>${x.split(':')[0]}</b><h3>${x.split(':')[1]||''}</h3></div>`).join('')}</div></section>`}
function newsView(){return `<section class="page-view"><h2>Breaking News Manager</h2><textarea id="newsText" placeholder="Write breaking news..."></textarea><button onclick="showToast('Breaking news saved')">Save News</button><div class="news"><p>📌 SSC CGL 2026 Notification Out <span>Pinned</span></p><p>📌 Railway Group D Exam Date Released</p></div></section>`}
function messagesView(){return `<section class="page-view"><h2>Contact Messages</h2><div class="list"><p>📩 Ravi Kumar: Sir admit card kab aayega? <button onclick="showToast('Reply box opened')">Reply</button></p><p>📩 Aman: Result link not working. <button onclick="showToast('Reply box opened')">Reply</button></p></div></section>`}
function mediaView(){return `<section class="page-view"><h2>Media Manager</h2><input type="file" id="mediaFile"><button onclick="showToast('Demo upload completed')">Upload Media</button><div class="stat-grid"><div class="glass">🖼 Logo</div><div class="glass">📄 PDF</div><div class="glass">📷 Images</div></div></section>`}
function adsView(){return `<section class="page-view"><h2>Ads Manager</h2><input placeholder="Top banner ad code"><input placeholder="Sidebar ad code"><textarea placeholder="Paste ad script/code here"></textarea><button onclick="showToast('Ad code saved')">Save Ads</button></section>`}
function analyticsView(){return `<section class="page-view"><h2>Analytics & Reports</h2><div class="stat-grid"><div class="glass"><b>Visitors</b><h3>1,245</h3></div><div class="glass"><b>Page Views</b><h3>3,542</h3></div><div class="glass"><b>Bounce Rate</b><h3>32.6%</h3></div></div><canvas id="reportChart"></canvas></section>`}
function seoView(){return `<section class="page-view"><h2>SEO Tools</h2><input placeholder="Meta Title"><textarea placeholder="Meta Description"></textarea><input placeholder="Keywords"><button onclick="showToast('SEO settings saved')">Save SEO</button><button onclick="showToast('Sitemap generated')">Generate Sitemap</button></section>`}
function adsenseManagerView(){return `<section class="page-view"><h2>Google AdSense Manager</h2><p>Future AdSense ke liye placeholder ready hai.</p><input placeholder="Publisher ID: ca-pub-xxxxxxxx"><input placeholder="Ad Slot ID"><textarea placeholder="AdSense script paste karein"></textarea><div class="stat-grid"><div class="glass"><b>Estimated Earnings</b><h3>$124.50</h3></div><div class="glass"><b>Clicks</b><h3>1,245</h3></div><div class="glass"><b>RPM</b><h3>$2.45</h3></div></div><button onclick="showToast('AdSense settings saved')">Save AdSense</button></section>`}
function backupView(){return `<section class="page-view"><h2>Backup & Restore</h2><button onclick="showToast('Backup created successfully')">Create Backup</button><button onclick="showToast('Restore demo started')">Restore Backup</button><button onclick="showToast('Backup downloaded')">Download Backup</button></section>`}
function settingsView(){return `<section class="page-view"><h2>Website Settings</h2><input value="Rapid Job"><input value="Fast Government Job Updates"><button onclick="showToast('Settings saved')">Save Settings</button></section>`}

function renderView(key){
  const content = $('#content');
  if(!content) return;
  content.innerHTML = views[key] || views.dashboard;
  initCharts();
}

function openPostForm(type='Post'){
  $('#content').innerHTML = `<section class="page-view"><h2>Add New ${type}</h2><input placeholder="Post Title"><select><option>Latest Job</option><option>Admit Card</option><option>Result</option><option>Answer Key</option><option>Syllabus</option></select><input placeholder="Important Date"><input placeholder="Apply / Download Link"><textarea placeholder="Full details"></textarea><button onclick="showToast('Post saved successfully')">Save Post</button><button onclick="renderView('dashboard')">Back</button></section>`;
}

function showToast(msg){
  let t = $('.toast'); if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
  t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800);
}

function initCharts(){
  const lineCtx = document.getElementById('visitChart');
  if(lineCtx && !lineCtx.dataset.ok){lineCtx.dataset.ok=1; new Chart(lineCtx,{type:'line',data:{labels:['30 May','31 May','1 Jun','2 Jun','3 Jun','4 Jun','5 Jun'],datasets:[{label:'Visitors',data:[450,900,520,1080,950,1180,980],fill:true,tension:.45,borderColor:'#38bdf8',backgroundColor:'rgba(56,189,248,.25)'}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#9fb2ca'},grid:{color:'rgba(255,255,255,.05)'}},y:{ticks:{color:'#9fb2ca'},grid:{color:'rgba(255,255,255,.08)'}}}}});}
  const doughnutCtx = document.getElementById('userChart');
  if(doughnutCtx && !doughnutCtx.dataset.ok){doughnutCtx.dataset.ok=1; new Chart(doughnutCtx,{type:'doughnut',data:{labels:['Active','New','Inactive','Blocked'],datasets:[{data:[8542,248,3245,810],backgroundColor:['#22c55e','#3b82f6','#f59e0b','#ef4444']}]},options:{plugins:{legend:{position:'right',labels:{color:'#dbeafe'}}}}});}
  const reportCtx = document.getElementById('reportChart');
  if(reportCtx && !reportCtx.dataset.ok){reportCtx.dataset.ok=1; new Chart(reportCtx,{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri'],datasets:[{data:[120,190,300,250,420],backgroundColor:'#6366f1'}]},options:{plugins:{legend:{display:false}}}});}
}

$$('nav button').forEach(btn=>btn.addEventListener('click',()=>{
  $$('nav button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const key = btn.textContent.replace(/New|\d+/g,'').replace(/[⌂▣▤▥▧▨▩◈📢📈👥💬🖼📣📊🌐💰🔔💾⚙]/g,'').trim().toLowerCase();
  renderView(key);
}));

$$('.quick button').forEach(btn=>btn.addEventListener('click',()=>openPostForm(btn.textContent.replace(/[^a-zA-Z ]/g,'').trim())));
$('.menu')?.addEventListener('click',()=>$('.sidebar').classList.toggle('hide'));
$('.topbar input')?.addEventListener('input',e=>{ if(e.target.value.length>1) showToast('Searching: '+e.target.value); });
$('.open-web')?.addEventListener('click',()=>showToast('Opening website...'));
$('.ad-btn')?.addEventListener('click',()=>renderView('google adsense'));
$$('.wide').forEach(b=>b.addEventListener('click',()=>showToast(b.textContent+' clicked')));
$('.status button')?.addEventListener('click',()=>showToast('Backup created successfully'));
initCharts();
setInterval(()=>{$$('.card h2').forEach(el=>{el.style.textShadow='0 0 20px rgba(99,102,241,.9)';setTimeout(()=>el.style.textShadow='none',500)})},3000);
