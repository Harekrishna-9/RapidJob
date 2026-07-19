
(function(){
'use strict';
const cfg={apiKey:'AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ',authDomain:'rapid-job-09.firebaseapp.com',databaseURL:'https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app',projectId:'rapid-job-09',storageBucket:'rapid-job-09.firebasestorage.app',messagingSenderId:'129444686750',appId:'1:129444686750:web:6175ba1f1bfe7c9fff048f'};
try{if(!firebase.apps.length)firebase.initializeApp(cfg)}catch(e){}
const db=firebase.database(),auth=firebase.auth(),$=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
let uid=null;
function arr(v){return Object.entries(v||{}).map(([id,x])=>({id,...(x||{})})).sort((a,b)=>(b.updatedAt||b.savedAt||b.viewedAt||b.appliedAt||0)-(a.updatedAt||a.savedAt||a.viewedAt||a.appliedAt||0))}
function empty(t){return `<div class="empty-user">${esc(t)}</div>`}
function listHtml(items,emptyText,section){if(!items.length)return empty(emptyText);return `<div class="rj-list">${items.map(x=>`<div class="rj-list-item"><div><a href="${esc(x.url||'#')}">${esc(x.title||'Rapid Job Update')}</a><small>${esc(x.status||x.category||'')}</small></div>${section?`<button class="rj-remove" data-section="${section}" data-id="${esc(x.id)}"><i class="fa-solid fa-trash"></i></button>`:''}</div>`).join('')}</div>`}
function bindRemove(){document.querySelectorAll('.rj-remove').forEach(b=>b.onclick=()=>db.ref(`users/${uid}/${b.dataset.section}/${b.dataset.id}`).remove())}
function renderUser(data){
 const saved=arr(data.savedJobs),applied=arr(data.appliedJobs),recent=arr(data.recentJobs),tests=arr(data.testHistory),downloads=arr(data.downloads),times=arr(data.savedTimetables),personal=arr(data.notifications);
 $('statSaved').textContent=saved.length;$('statApplied').textContent=applied.length;$('statRecent').textContent=recent.length;$('statTests').textContent=tests.length;$('statDownloads').textContent=downloads.length;$('statNotifications').textContent=personal.filter(x=>!x.read).length;
 $('savedJobsList').innerHTML=listHtml(saved,'No saved jobs yet.','savedJobs');$('appliedJobsList').innerHTML=listHtml(applied,'No applied jobs yet.','appliedJobs');$('recentJobsList').innerHTML=listHtml(recent,'No recently viewed jobs yet.','recentJobs');$('testHistoryList').innerHTML=tests.length?`<div class="rj-list">${tests.map(x=>`<div class="rj-list-item"><div><b>${esc(x.title||'Test')}</b><small>Score: ${esc(x.score||0)} / ${esc(x.total||0)}</small></div></div>`).join('')}</div>`:empty('Your future test scores will appear here.');$('savedTimetablesList').innerHTML=listHtml(times,'Saved study plans will appear here.','savedTimetables');
 const total=Math.min(100,saved.length*5+applied.length*10+tests.length*15+downloads.length*3);$('preparationProgress').innerHTML=`<div class="rj-progress-wrap"><div class="rj-progress-ring" style="--p:${total}%"><div class="rj-progress-inner">${total}%</div></div><p>Preparation activity progress</p></div>`;
 bindRemove();
}
function renderCompare(){let list=[];try{list=JSON.parse(localStorage.getItem('rjCompareJobs')||'[]')}catch(e){}$('compareJobsList').innerHTML=list.length?`<table class="rj-compare-table"><tr><th>Job</th><th>Open</th></tr>${list.map(x=>`<tr><td>${esc(x.title)}</td><td><a href="${esc(x.url)}">View</a></td></tr>`).join('')}</table>`:empty('No jobs selected for comparison.');}
function loadGlobalNotifications(){const paths=['contentManager/notifications','notifications'];Promise.all(paths.map(p=>db.ref(p).once('value').catch(()=>null))).then(snaps=>{const items=[];snaps.forEach(s=>{if(s&&s.exists())items.push(...arr(s.val()))});if(!items.length&&$('userNotifications'))$('userNotifications').innerHTML=empty('No personal notifications yet.');else if($('userNotifications'))$('userNotifications').innerHTML=`<div class="rj-list">${items.slice(0,10).map(x=>`<div class="rj-list-item"><div><b>${esc(x.title||'Notification')}</b><small>${esc(x.message||x.text||'')}</small></div></div>`).join('')}</div>`;});}
function setPrivateFeatureVisibility(isLoggedIn){
 const directSelectors=[
  '#rjSaveJob','#saveJobBtn','[data-rj-action="save"]','[data-action="save-job"]',
  '#rjCompareJob','#compareJobBtn','[data-rj-action="compare"]','[data-action="compare-job"]',
  '#rjEligibility','#eligibilityBtn','[data-rj-action="eligibility"]','[data-action="eligibility"]'
 ];
 directSelectors.forEach(selector=>{
  document.querySelectorAll(selector).forEach(el=>{
   el.style.display=isLoggedIn?'':'none';
  });
 });

 document.querySelectorAll('button,a').forEach(el=>{
  const label=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const privateFeature=
   label==='save job'||
   label.includes('save job')||
   label==='compare'||
   label.includes('compare job')||
   label==='eligibility'||
   label.includes('check eligibility');
  const publicPdf=label.includes('pdf viewer');
  if(privateFeature&&!publicPdf)el.style.display=isLoggedIn?'':'none';
 });
}


function requireLoginForPrivateAction(event){
 const target=event.target.closest('button,a');
 if(!target)return;

 const label=(target.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 const isCompare=
  target.id==='rjCompareJob'||
  target.id==='compareJobBtn'||
  target.matches('[data-rj-action="compare"],[data-action="compare-job"]')||
  label==='compare'||
  label.includes('compare job');

 const isEligibility=
  target.id==='rjEligibility'||
  target.id==='eligibilityBtn'||
  target.matches('[data-rj-action="eligibility"],[data-action="eligibility"]')||
  label==='eligibility'||
  label.includes('check eligibility');

 if(!isCompare&&!isEligibility)return;
 if(auth.currentUser)return;

 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();

 const next=location.pathname.split('/').pop()+location.search+location.hash;
 location.href='login.html?next='+encodeURIComponent(next);
}

document.addEventListener('click',requireLoginForPrivateAction,true);

auth.onAuthStateChanged(user=>{
 setPrivateFeatureVisibility(Boolean(user));

 const isDashboard=Boolean($('dashboardWelcome'));
 if(!user){
  if(isDashboard)location.href='login.html?redirect='+encodeURIComponent(location.href);
  return;
 }

 uid=user.uid;
 if(!isDashboard)return;

 const emailEl=document.querySelector('[data-user-email]');
 if(emailEl)emailEl.textContent=user.email||'';

 db.ref(`users/${uid}`).on('value',s=>renderUser(s.val()||{}));
 db.ref(`users/${uid}/profile`).once('value').then(s=>{
  const n=s.val()?.name||user.displayName||user.email?.split('@')[0]||'User';
  const welcome=$('dashboardWelcome');
  if(welcome)welcome.textContent='Welcome, '+String(n).toUpperCase();
 });
 loadGlobalNotifications();
 renderCompare();
});
window.addEventListener('storage',renderCompare);
})();
