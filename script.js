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
{id:'demo8',title:'Bihar BEd Merit List 2026 OUT',type:'result',state:'Bihar',lastDate:'Released',details:'Bihar BEd merit list/result update.',trending:false,time:1}
];
const cats=[['job','💼 Current Job'],['admit','📥 Admit Card'],['result','📊 Result'],['answer','✅ Answer Key'],['syllabus','📚 Syllabus'],['admission','🎓 Admission'],['scholarship','🏆 Scholarship'],['state','🏛️ State Jobs']];

const $=id=>document.getElementById(id);
$('categoryCards').innerHTML=cats.map(c=>`<div class="cat"><h3>${c[1]}</h3><p id="count_${c[0]}">0 Updates</p></div>`).join('');
$('darkBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('dark',document.body.classList.contains('dark'))};
if(localStorage.getItem('dark')==='true')document.body.classList.add('dark');

function loadData(){
 if(!db){POSTS=fallbackPosts;render();return;}
 db.ref('posts').on('value',s=>{
  const data=s.val()||{};
  const arr=Object.entries(data).map(([id,p])=>({id,...p})).sort((a,b)=>(b.time||0)-(a.time||0));
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
 $('tickerText').innerText=POSTS.slice(0,8).map(p=>p.title).join(' | ')||'Fast Government Job Updates';
 $('topCards').innerHTML=POSTS.slice(0,8).map(p=>`<div class="quick-card"><a href="job-detail.html?id=${p.id}">🔥 ${p.title}</a></div>`).join('');
 $('posts').innerHTML=list.map(postCard).join('')||'<div class="post">No updates found.</div>';
 $('admitList').innerHTML=listBy('admit').map(mini).join('')||miniEmpty('No Admit Card');
 $('jobList').innerHTML=listBy('job').map(mini).join('')||miniEmpty('No Current Job');
 $('newList').innerHTML=POSTS.slice(0,7).map(mini).join('');
 updateSlider();
 cats.forEach(c=>{const n=c[0]==='state'?states.length:POSTS.filter(p=>p.type===c[0]).length;const el=$('count_'+c[0]);if(el)el.innerText=n+' Updates'});
}
function listBy(type){return POSTS.filter(p=>p.type===type).slice(0,8)}
function mini(p){return `<a class="mini-item" href="job-detail.html?id=${p.id}">${p.title} ${p.lastDate&&p.lastDate.toLowerCase().includes('out')?'<small>OUT</small>':''}</a>`}
function miniEmpty(t){return `<span class="mini-item">${t}</span>`}
function postCard(p){return `<div class="post"><span class="tag">${label(p.type)}</span><h3>${p.title}</h3><p><b>State:</b> ${p.state||'Central'} | <b>Date:</b> ${p.lastDate||'Check details'}</p><p>${(p.details||'Click view details for full information.').slice(0,150)}...</p><a href="job-detail.html?id=${p.id}">View Details</a></div>`}
function label(t){return {job:'Current Job',admit:'Admit Card',result:'Result',answer:'Answer Key',syllabus:'Syllabus',admission:'Admission',scholarship:'Scholarship'}[t]||'Update'}
function updateSlider(){const arr=POSTS.length?POSTS:fallbackPosts;slideIndex=(slideIndex+arr.length)%arr.length;const p=arr[slideIndex];$('slideLink').href=`job-detail.html?id=${p.id}`;$('slideLink').innerHTML=`<span>${p.trending?'New':'Released'}</span><b>🔥 ${p.title}</b>`}
$('prevSlide').onclick=()=>{slideIndex--;updateSlider()};
$('nextSlide').onclick=()=>{slideIndex++;updateSlider()};
if($('searchInput')) $('searchInput').oninput=render;
if($('stateFilter')) $('stateFilter').onchange=render;
setInterval(()=>{slideIndex++;updateSlider()},3500);
loadData();
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');
