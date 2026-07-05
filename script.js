const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
firebase.initializeApp(firebaseConfig);
const db=firebase.database();
let POSTS=[];
let slideIndex=0;

const cats=[['job','💼 Latest Jobs'],['admit','📝 Admit Card'],['result','📊 Results'],['answer','✅ Answer Key'],['syllabus','📚 Syllabus'],['admission','🎓 Admissions'],['scholarship','🏆 Scholarships'],['state','🏛️ State Jobs']];
const defaultStates=['AP','Assam','Bihar','Chhattisgarh','Delhi','Jharkhand','Haryana','HP','MP','Odisha','Rajasthan','TN','Telangana','UK','UP','WB'];

document.getElementById('categoryCards').innerHTML=cats.map(c=>`<div class="cat"><h3>${c[1]}</h3><p id="count_${c[0]}">0 Updates</p></div>`).join('');
document.getElementById('stateLinks').innerHTML=defaultStates.map(s=>`<a href="#" data-state="${s}">📍 ${s}</a>`).join('');

document.getElementById('stateLinks').addEventListener('click',e=>{
  if(e.target.dataset.state){e.preventDefault();document.getElementById('stateFilter').value=e.target.dataset.state;render();}
});

document.getElementById('darkBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dark',document.body.classList.contains('dark'))};
if(localStorage.getItem('dark')==='true')document.body.classList.add('dark');

db.ref('posts').on('value',s=>{
  const data=s.val()||{};
  POSTS=Object.entries(data).map(([id,p])=>({id,...p})).sort((a,b)=>(b.time||0)-(a.time||0));
  render();
});

function render(){
  const q=(document.getElementById('searchInput').value||'').toLowerCase();
  const selected=document.getElementById('stateFilter').value;
  const states=[...new Set([...defaultStates,...POSTS.map(p=>p.state||'Central')])];
  document.getElementById('stateFilter').innerHTML='<option value="All">All States</option>'+states.map(s=>`<option ${selected===s?'selected':''}>${s}</option>`).join('');
  const st=document.getElementById('stateFilter').value;
  let list=POSTS.filter(p=>(!q||JSON.stringify(p).toLowerCase().includes(q))&&(st==='All'||!st||(p.state||'Central')===st));

  document.getElementById('topJobs').innerHTML=(POSTS.slice(0,8).length?POSTS.slice(0,8):samplePosts()).map(p=>`<div class="quick-card"><a href="job-detail.html?id=${p.id||''}">🔥 ${p.title}</a></div>`).join('');
  document.getElementById('admitList').innerHTML=miniList(POSTS.filter(p=>p.type==='admit').slice(0,7));
  document.getElementById('updateList').innerHTML=miniList(POSTS.filter(p=>p.type!=='job').slice(0,7));
  document.getElementById('jobList').innerHTML=miniList(POSTS.filter(p=>p.type==='job').slice(0,7));
  document.getElementById('posts').innerHTML=list.map(card).join('')||'<div class="post">No updates found.</div>';
  document.getElementById('tickerText').innerText=(POSTS.length?POSTS:samplePosts()).slice(0,8).map(p=>p.title).join('  |  ')||'Fast Government Job Updates';
  cats.forEach(c=>{let n=c[0]==='state'?states.length:POSTS.filter(p=>p.type===c[0]).length;let el=document.getElementById('count_'+c[0]);if(el)el.innerText=n+' Updates'});
  renderSlide();
}

function miniList(arr){
  const list=arr.length?arr:samplePosts().slice(0,5);
  return list.map(p=>`<a class="mini-item" href="job-detail.html?id=${p.id||''}">${p.title} <small>${p.status||''}</small></a>`).join('');
}
function renderSlide(){
  const tr=(POSTS.filter(p=>p.trending).length?POSTS.filter(p=>p.trending):POSTS.length?POSTS:samplePosts());
  if(!tr.length)return;
  slideIndex=(slideIndex+tr.length)%tr.length;
  document.getElementById('slideTitle').innerText='🔥 '+tr[slideIndex].title;
  document.getElementById('slideBadge').innerText=tr[slideIndex].status||'Released';
}
document.getElementById('prevSlide').onclick=()=>{slideIndex--;renderSlide()};
document.getElementById('nextSlide').onclick=()=>{slideIndex++;renderSlide()};
setInterval(()=>{slideIndex++;renderSlide()},3500);

function card(p){return `<div class="post"><span class="tag">${label(p.type)}</span><h3>${p.title}</h3><p><b>State:</b> ${p.state||'Central'} | <b>Date:</b> ${p.lastDate||'Check details'}</p><p>${(p.details||'').slice(0,140)}...</p><a href="job-detail.html?id=${p.id}">View Details</a></div>`}
function label(t){return {job:'Current Job',admit:'Admit Card',result:'Result',answer:'Answer Key',syllabus:'Syllabus',admission:'Admission',scholarship:'Scholarship'}[t]||'Update'}
function samplePosts(){return [
  {title:'PMS Online Bihar Scholarship 2026-27 New',type:'scholarship',state:'Bihar',status:'New'},
  {title:'SBI PO Recruitment 2026 Online Form',type:'job',state:'Central',status:'New'},
  {title:'RRB Ministerial Admit Card 2026',type:'admit',state:'Central',status:'Out'},
  {title:'BPSSC SI General Closed Cadre Vacancy 2026',type:'job',state:'Bihar',status:'New'},
  {title:'Bihar DElEd Answer Key 2026',type:'answer',state:'Bihar',status:'Released'}
]}

document.getElementById('searchInput').oninput=render;
document.getElementById('stateFilter').onchange=render;
db.ref('visitors/count').transaction(n=>(n||0)+1);
db.ref('visitors/count').on('value',s=>document.getElementById('visitorCount').innerText=s.val()||0);
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');
