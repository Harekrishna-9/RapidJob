const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};
let db=null;
try{firebase.initializeApp(firebaseConfig);db=firebase.database();}catch(e){console.warn(e)}

let POSTS=[];
let slideIndex=0;
const fallbackPosts=[
{id:'demo1',title:'PMS Online Bihar Scholarship 2026-27 New',type:'scholarship',state:'Bihar',lastDate:'Check details',details:'Online scholarship update for Bihar students.',trending:true,time:8},
{id:'demo2',title:'SBI PO Recruitment 2026 Online Form',type:'job',state:'All India',lastDate:'Check details',details:'SBI PO online recruitment form update.',trending:true,time:7},
{id:'demo3',title:'RRB Ministerial Admit Card 2026',type:'admit',state:'All India',lastDate:'Released',details:'RRB Ministerial and Isolated categories admit card update.',trending:true,time:6},
{id:'demo4',title:'BPSSC SI General Closed Cadre Vacancy 2026',type:'job',state:'Bihar',lastDate:'Check details',details:'BPSSC SI vacancy latest update.',trending:true,time:5},
{id:'demo5',title:'Bihar DElEd Answer Key 2026',type:'answer',state:'Bihar',lastDate:'Released',details:'Bihar DElEd answer key released.',trending:false,time:4},
{id:'demo6',title:'UP Home Guard DV / PST Admit Card 2026',type:'admit',state:'UP',lastDate:'Check details',details:'UP Home Guard admit card update.',trending:false,time:3},
{id:'demo7',title:'E Kalyan Jharkhand Scholarship 2026 New',type:'scholarship',state:'Jharkhand',lastDate:'Check details',details:'Jharkhand scholarship update.',trending:false,time:2},
{id:'demo8',title:'Bihar BEd Merit List 2026 OUT',type:'result',state:'Bihar',lastDate:'Released',details:'Bihar BEd merit list/result update.',trending:false,time:1},
{id:'demo9',title:'Railway Exam Preparation Latest Blog',type:'blog',state:'All India',lastDate:'New',details:'Helpful blog for railway exam preparation.',trending:false,time:0},
{id:'demo10',title:'OBC Certificate Document Guide',type:'document',state:'All India',lastDate:'New',details:'Important document guide for government forms.',trending:false,time:0}
];
const cats=[['job','💼 Current Job'],['admit','📥 Admit Card'],['result','📊 Result'],['answer','✅ Answer Key'],['syllabus','📚 Syllabus'],['admission','🎓 Admission'],['scholarship','🏆 Scholarship'],['state','🏛️ State Jobs']];

const $=id=>document.getElementById(id);
function normalizeType(t){
 t=String(t||'').toLowerCase().trim();
 const map={
  'latest job':'job','post management':'job','current job':'job','job':'job',
  'new update':'new','new':'new',
  'admit card':'admit','admit':'admit',
  'results':'result','result':'result',
  'answer key':'answer','answerkey':'answer','answer-key':'answer','answer_key':'answer','answers':'answer',
  'admissions':'admission','admission':'admission',
  'scholarships':'scholarship','scholarship':'scholarship',
  'latest blog':'blog','latestblog':'blog','latest-blog':'blog','latest_blog':'blog','blog':'blog','blogs':'blog',
  'study material':'study','study':'study',
  'document':'document','documents':'document','doc':'document',
  'age calculator':'agecalc','agecalc':'agecalc'
 };
 return map[t]||t;
}
if($('categoryCards')) {
  $('categoryCards').innerHTML = cats.map(c => `
    <div class="cat" onclick="openCategory('${c[0]}')">
      <h3>${c[1]}</h3>
      <p id="count_${c[0]}">0 Updates</p>
    </div>
  `).join('');
}
if($('darkBtn')) $('darkBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dark',document.body.classList.contains('dark'))};
if(localStorage.getItem('dark')==='true')document.body.classList.add('dark');

function loadData(){
 if(!db){POSTS=fallbackPosts;render();return;}
 db.ref('posts').on('value',s=>{
  const data=s.val()||{};
  const arr=Object.entries(data).map(([id,p])=>({id,...p,type:normalizeType(p.type)})).sort((a,b)=>(b.time||0)-(a.time||0));
  POSTS=arr.length?arr:fallbackPosts;
  render();
 },()=>{POSTS=fallbackPosts;render();});
 try{db.ref('visitors/count').transaction(n=>(n||0)+1)}catch(e){}
}

function render(){
 const searchEl=$('searchInput');
 const stateEl=$('stateFilter');
 const q=searchEl?(searchEl.value||'').toLowerCase():'';
 const oldState=stateEl?(stateEl.value||'All'):'All';
 const states=[...new Set(POSTS.map(p=>p.state||'Central'))];
 if(stateEl){
  stateEl.innerHTML='<option value="All">All States</option>'+states.map(s=>`<option ${oldState===s?'selected':''}>${s}</option>`).join('');
 }
 const st=stateEl?(stateEl.value||'All'):'All';
 const list=POSTS.filter(p=>(!q||JSON.stringify(p).toLowerCase().includes(q))&&(st==='All'||(p.state||'Central')===st));
 if($('tickerText')) $('tickerText').innerText=POSTS.slice(0,8).map(p=>p.title).join(' | ')||'Fast Government Job Updates';
 if($('topCards')) $('topCards').innerHTML=POSTS.slice(0,8).map(p=>`<div class="quick-card"><a href="job-detail.html?id=${p.id}">🔥 ${p.title}</a></div>`).join('');
 if($('posts')) $('posts').innerHTML=list.map(postCard).join('')||'<div class="post">No updates found.</div>';
 setList('admitList', listBy('admit'), 'No Admit Card');
 setList('jobList', listBy('job'), 'No Current Job');
 setList('newList', POSTS.slice(0,7), 'No New Update');
 setList('admissionList', listBy('admission'), 'No Admission Update');
 setList('answerKeyList', listByMany(['answer','answerkey','answer-key','answer_key']), 'No Answer Key');
 setList('resultList', listBy('result'), 'No Result');
 setList('scholarshipList', listBy('scholarship'), 'No Scholarship Update');
 setList('blogList', listByMany(['blog','latestblog','latest-blog','latest_blog']), 'No Latest Blog');
 setList('documentList', listByMany(['document','documents','doc']), 'No Document Update');
 updateSlider();
 cats.forEach(c=>{const n=c[0]==='state'?states.length:POSTS.filter(p=>normalizeType(p.type)===c[0]).length;const el=$('count_'+c[0]);if(el)el.innerText=n+' Updates'});
}
function listBy(type){return POSTS.filter(p=>normalizeType(p.type)===type)}
function listByMany(types){const set=types.map(t=>normalizeType(t));return POSTS.filter(p=>set.includes(normalizeType(p.type)))}
function setList(id,data,emptyText){const el=$(id);if(el)el.innerHTML=data.map(mini).join('')||miniEmpty(emptyText)}
function mini(p){return `<a class="mini-item" href="job-detail.html?id=${p.id}">${p.title} ${p.lastDate&&p.lastDate.toLowerCase().includes('out')?'<small>OUT</small>':''}</a>`}
function miniEmpty(t){return `<span class="mini-item">${t}</span>`}
function postCard(p){return `<div class="post"><span class="tag">${label(p.type)}</span><h3>${p.title}</h3><p><b>State:</b> ${p.state||'Central'} | <b>Date:</b> ${p.lastDate||'Check details'}</p><p>${(p.details||'Click view details for full information.').slice(0,150)}...</p><a href="job-detail.html?id=${p.id}">View Details</a></div>`}
function label(t){return {job:'Current Job',new:'New Update',admit:'Admit Card',result:'Result',answer:'Answer Key',syllabus:'Syllabus',admission:'Admission',scholarship:'Scholarship',blog:'Latest Blog',study:'Study Material',document:'Document',agecalc:'Age Calculator'}[normalizeType(t)]||'Update'}
function updateSlider(){const arr=POSTS.length?POSTS:fallbackPosts;slideIndex=(slideIndex+arr.length)%arr.length;const p=arr[slideIndex];if($('slideLink')){$('slideLink').href=`job-detail.html?id=${p.id}`;$('slideLink').innerHTML=`<span>${p.trending?'New':'Released'}</span><b>🔥 ${p.title}</b>`}}
if($('prevSlide')) $('prevSlide').onclick=()=>{slideIndex--;updateSlider()};
if($('nextSlide')) $('nextSlide').onclick=()=>{slideIndex++;updateSlider()};
if($('searchInput')) $('searchInput').oninput=render;
if($('stateFilter')) $('stateFilter').onchange=render;
setInterval(()=>{slideIndex++;updateSlider()},3500);
loadData();
// if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');
function openCategory(type){
  const targetType = normalizeType(type);

  if(type === 'state'){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if($('stateFilter')) $('stateFilter').focus();
    return;
  }

  const list = POSTS.filter(p => normalizeType(p.type) === targetType);

  if($('posts')){
    $('posts').innerHTML = list.map(postCard).join('') || '<div class="post">No updates found.</div>';
    $('posts').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


// ===== Premium homepage UI additions (existing Firebase logic preserved) =====
(function(){
  function updateRapidJobClock(){
    const now = new Date();
    const dateEl = document.getElementById('liveDate');
    const timeEl = document.getElementById('liveTime');

    if(dateEl){
      dateEl.textContent = now.toLocaleDateString('en-GB',{
        day:'2-digit',
        month:'long',
        year:'numeric',
        weekday:'long'
      }).replace(',', '  |');
    }

    if(timeEl){
      timeEl.textContent = now.toLocaleTimeString('en-IN',{
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit',
        hour12:true
      });
    }
  }

  updateRapidJobClock();
  setInterval(updateRapidJobClock,1000);
})();
