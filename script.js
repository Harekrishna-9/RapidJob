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


// ===== Rapid Job Home Tools Search & Filter =====
(function(){
  const search=document.getElementById("homeToolSearch");
  const cards=[...document.querySelectorAll(".home-tool-card")];
  const buttons=[...document.querySelectorAll(".tool-filter-btn")];
  const empty=document.getElementById("homeToolsEmpty");
  if(!search||!cards.length)return;
  let filter="all";
  function run(){
    const q=search.value.trim().toLowerCase();let count=0;
    cards.forEach(card=>{
      const okSearch=!q||(card.dataset.toolName||card.textContent).toLowerCase().includes(q);
      const okFilter=filter==="all"||card.dataset.toolCategory===filter;
      card.hidden=!(okSearch&&okFilter);if(!card.hidden)count++;
    });
    if(empty)empty.hidden=count!==0;
  }
  search.addEventListener("input",run);
  buttons.forEach(btn=>btn.addEventListener("click",function(){
    buttons.forEach(x=>x.classList.remove("active"));this.classList.add("active");
    filter=this.dataset.toolFilter||"all";run();
  }));
})();


/* =========================================================
   RAPID JOB LIVE ADVERTISEMENT + POPUP INTEGRATION
   Reads: contentManager/advertisements and contentManager/popups
   ========================================================= */
(function(){
  "use strict";
  const RJ_PAGE_TYPE = document.getElementById("detailBox") ? "detail" : "home";
  const RJ_ADS_PATH = "contentManager/advertisements";
  const RJ_POPUPS_PATH = "contentManager/popups";
  const adState = {items:[], rendered:new Set()};

  function rjNow(){ return Date.now(); }
  function rjText(v){ return String(v == null ? "" : v); }
  function rjSafe(v){
    return rjText(v).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  }
  function rjIsMobile(){ return window.matchMedia("(max-width: 760px)").matches; }
  function rjDateValue(v){
    if(!v) return null;
    const t = new Date(v).getTime();
    return Number.isFinite(t) ? t : null;
  }
  function rjIsLive(x){
    if(x.enabled === false) return false;
    const now=rjNow(), start=rjDateValue(x.startAt), end=rjDateValue(x.endAt);
    if(start && now < start) return false;
    if(end && now > end) return false;
    if(rjIsMobile() && x.mobile === false) return false;
    if(!rjIsMobile() && x.desktop === false) return false;
    return true;
  }
  function rjNormPosition(v){
    return rjText(v).trim().toLowerCase().replace(/\s+/g," ");
  }
  function rjPositionMatches(item, wanted){
    const p=rjNormPosition(item.position);
    const aliases={
      "header":["header"],
      "homepage top":["homepage top","home top"],
      "homepage middle":["homepage middle","home middle"],
      "sidebar":["sidebar"],
      "post top":["post top"],
      "post middle":["post middle"],
      "post bottom":["post bottom"],
      "footer":["footer"],
      "mobile bottom":["mobile bottom","mobile sticky","bottom sticky"]
    };
    return (aliases[wanted]||[wanted]).includes(p);
  }
  function rjCounter(id,kind){
    if(!window.db || !id) return;
    try{
      window.db.ref(`contentManager/advertisements/${id}/${kind}`).transaction(n=>(Number(n)||0)+1);
    }catch(e){}
  }
  function rjExecuteScripts(container){
    container.querySelectorAll("script").forEach(old=>{
      const s=document.createElement("script");
      [...old.attributes].forEach(a=>s.setAttribute(a.name,a.value));
      s.text=old.textContent;
      old.replaceWith(s);
    });
  }
  function rjAdElement(item,slotName){
    const wrap=document.createElement("div");
    wrap.className="rj-live-ad";
    wrap.dataset.adId=item.id||"";
    wrap.innerHTML=`<span class="rj-sponsored">SPONSORED</span>`;
    const close=document.createElement("button");
    close.type="button"; close.className="rj-ad-close"; close.innerHTML="×";
    close.setAttribute("aria-label","Close advertisement");
    close.onclick=()=>wrap.remove();
    wrap.appendChild(close);

    const type=rjText(item.type).toLowerCase();
    if(type.includes("google") && item.code){
      const code=document.createElement("div");
      code.className="rj-ad-code";
      code.innerHTML=item.code;
      wrap.appendChild(code);
      requestAnimationFrame(()=>rjExecuteScripts(code));
    }else{
      const link=document.createElement(item.link ? "a" : "div");
      link.className="rj-live-ad-link";
      if(item.link){
        link.href=item.link; link.target="_blank"; link.rel="noopener sponsored";
        link.addEventListener("click",()=>rjCounter(item.id,"clicks"));
      }
      if(item.image){
        const img=document.createElement("img");
        img.src=item.image; img.alt=item.title||"Advertisement";
        img.loading="lazy";
        img.onerror=()=>{
          img.remove();
          link.insertAdjacentHTML("beforeend",`<div class="rj-ad-fallback"><i class="fa-solid fa-rectangle-ad"></i><span>${rjSafe(item.title||"Advertisement")}</span></div>`);
        };
        link.appendChild(img);
      }else{
        link.innerHTML=`<div class="rj-ad-fallback"><i class="fa-solid fa-rectangle-ad"></i><span>${rjSafe(item.title||"Advertisement")}</span></div>`;
      }
      wrap.appendChild(link);
    }
    rjCounter(item.id,"views");
    return wrap;
  }
  function rjCreateSlot(name,className=""){
    let slot=document.querySelector(`[data-rj-ad-slot="${name}"]`);
    if(slot) return slot;
    slot=document.createElement("div");
    slot.className=`rj-ad-slot ${className}`.trim();
    slot.dataset.rjAdSlot=name;
    return slot;
  }
  function rjBestAd(wanted){
    return adState.items
      .filter(x=>rjIsLive(x)&&rjPositionMatches(x,wanted))
      .sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)))[0];
  }
  function rjFillSlot(slot,wanted){
    if(!slot || slot.dataset.rjFilled==="1") return;
    const item=rjBestAd(wanted);
    if(!item) return;
    slot.innerHTML="";
    slot.appendChild(rjAdElement(item,wanted));
    slot.dataset.rjFilled="1";
  }
  function rjPlaceHomeSlots(){
    const page=document.querySelector(".page-wrap");
    const nav=document.querySelector(".top-nav");
    const main=document.querySelector(".main-box");
    const hero=document.querySelector(".hero-section");
    const footer=document.querySelector(".main-footer");
    if(nav && main){
      const header=rjCreateSlot("header","rj-ad-slot--header");
      if(!header.isConnected) nav.insertAdjacentElement("afterend",header);
      rjFillSlot(header,"header");
    }
    if(main){
      const top=rjCreateSlot("homepage-top","rj-ad-slot--home-top");
      if(!top.isConnected) (hero||main.firstElementChild)?.insertAdjacentElement("beforebegin",top);
      rjFillSlot(top,"homepage top");

      const middle=rjCreateSlot("homepage-middle","rj-ad-slot--home-middle");
      const tools=document.querySelector(".home-tools-section")||document.querySelector(".category-section");
      if(!middle.isConnected && tools) tools.insertAdjacentElement("beforebegin",middle);
      rjFillSlot(middle,"homepage middle");
    }
    if(footer){
      const foot=rjCreateSlot("footer","rj-ad-slot--footer");
      if(!foot.isConnected) footer.insertAdjacentElement("beforebegin",foot);
      rjFillSlot(foot,"footer");
    }
    const sidebarAd=rjBestAd("sidebar");
    if(sidebarAd && !document.querySelector('[data-rj-ad-slot="home-sidebar"]')){
      const side=rjCreateSlot("home-sidebar","rj-ad-slot--sidebar");
      side.style.maxWidth="330px";
      side.style.margin="22px auto";
      const target=document.querySelector(".discover")||document.querySelector(".category-section");
      if(target) target.insertAdjacentElement("beforebegin",side);
      rjFillSlot(side,"sidebar");
    }
    if(rjIsMobile()){
      const sticky=rjCreateSlot("mobile-bottom","rj-ad-sticky-mobile");
      if(!sticky.isConnected) document.body.appendChild(sticky);
      rjFillSlot(sticky,"mobile bottom");
    }
  }
  function rjPlaceDetailSlots(){
    const nav=document.querySelector(".rj-nav");
    const wrap=document.querySelector(".rj-wrap");
    const detail=document.getElementById("detailBox");
    const side=document.querySelector(".side");
    const footer=document.querySelector(".rj-footer");
    if(nav && wrap){
      const header=rjCreateSlot("header","rj-ad-slot--header");
      if(!header.isConnected) nav.insertAdjacentElement("afterend",header);
      rjFillSlot(header,"header");
    }
    if(side){
      const sideSlot=rjCreateSlot("sidebar","rj-ad-slot--sidebar");
      if(!sideSlot.isConnected) side.prepend(sideSlot);
      rjFillSlot(sideSlot,"sidebar");
    }
    if(footer){
      const foot=rjCreateSlot("footer","rj-ad-slot--footer");
      if(!foot.isConnected) footer.insertAdjacentElement("beforebegin",foot);
      rjFillSlot(foot,"footer");
    }
    if(detail && !detail.querySelector(".loading-box")){
      const top=rjCreateSlot("post-top","rj-ad-slot--post-top");
      if(!top.isConnected) detail.prepend(top);
      rjFillSlot(top,"post top");

      const bottom=rjCreateSlot("post-bottom","rj-ad-slot--post-bottom");
      if(!bottom.isConnected) detail.append(bottom);
      rjFillSlot(bottom,"post bottom");

      const middle=rjCreateSlot("post-middle","rj-ad-slot--post-middle");
      if(!middle.isConnected){
        const children=[...detail.children].filter(x=>!x.classList.contains("rj-ad-slot"));
        const anchor=children[Math.max(1,Math.floor(children.length/2))];
        if(anchor) anchor.insertAdjacentElement("afterend",middle);
        else detail.append(middle);
      }
      rjFillSlot(middle,"post middle");
    }
    if(rjIsMobile()){
      const sticky=rjCreateSlot("mobile-bottom","rj-ad-sticky-mobile");
      if(!sticky.isConnected) document.body.appendChild(sticky);
      rjFillSlot(sticky,"mobile bottom");
    }
  }
  function rjRenderAllAds(){
    if(RJ_PAGE_TYPE==="detail") rjPlaceDetailSlots();
    else rjPlaceHomeSlots();
  }

  function rjPopupAllowed(x){
    if(!rjIsLive(x)) return false;
    const key=`rjPopup_${x.id}`;
    const freq=rjText(x.frequency).toLowerCase();
    if(freq.includes("day")){
      const today=new Date().toISOString().slice(0,10);
      return localStorage.getItem(key)!==today;
    }
    if(freq.includes("session")) return sessionStorage.getItem(key)!=="1";
    return true;
  }
  function rjMarkPopup(x){
    const key=`rjPopup_${x.id}`;
    const freq=rjText(x.frequency).toLowerCase();
    if(freq.includes("day")) localStorage.setItem(key,new Date().toISOString().slice(0,10));
    if(freq.includes("session")) sessionStorage.setItem(key,"1");
  }
  function rjShowPopup(x){
    if(document.querySelector(".rj-announcement-overlay")) return;
    const overlay=document.createElement("div");
    overlay.className="rj-announcement-overlay";
    overlay.innerHTML=`
      <div class="rj-announcement-box" role="dialog" aria-modal="true" aria-label="${rjSafe(x.title||"Announcement")}">
        <div class="rj-announcement-inner">
          <button class="rj-announcement-close" type="button" aria-label="Close">×</button>
          ${x.image?`<img class="rj-announcement-image" src="${rjSafe(x.image)}" alt="">`:`<div class="rj-announcement-icon"><i class="fa-solid fa-bullhorn"></i></div>`}
          <h2>${rjSafe(x.title||"Important Announcement")}</h2>
          <p>${rjSafe(x.message||"").replace(/\n/g,"<br>")}</p>
          ${x.link?`<a class="rj-announcement-action" href="${rjSafe(x.link)}">${rjSafe(x.buttonText||"View Details")}</a>`:""}
        </div>
      </div>`;
    const close=()=>{overlay.classList.remove("show");setTimeout(()=>overlay.remove(),260)};
    overlay.querySelector(".rj-announcement-close").onclick=close;
    overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
    document.addEventListener("keydown",function escClose(e){if(e.key==="Escape"){close();document.removeEventListener("keydown",escClose)}});
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>overlay.classList.add("show"));
    rjMarkPopup(x);
  }
  function rjLoadPopups(){
    if(!window.db) return;
    window.db.ref(RJ_POPUPS_PATH).once("value").then(s=>{
      const items=Object.entries(s.val()||{}).map(([id,x])=>({id,...x}))
        .filter(rjPopupAllowed)
        .sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)));
      const x=items[0]; if(!x) return;
      const delay=Math.max(0,Number(x.delay||0))*1000;
      setTimeout(()=>rjShowPopup(x),delay);
    }).catch(()=>{});
  }
  function rjStart(){
    if(!window.db){
      setTimeout(rjStart,250);
      return;
    }
    window.db.ref(RJ_ADS_PATH).on("value",s=>{
      adState.items=Object.entries(s.val()||{}).map(([id,x])=>({id,...x}));
      document.querySelectorAll(".rj-ad-slot").forEach(x=>{x.dataset.rjFilled="";x.innerHTML=""});
      rjRenderAllAds();
    });
    rjLoadPopups();
    if(RJ_PAGE_TYPE==="detail"){
      const target=document.getElementById("detailBox");
      if(target) new MutationObserver(()=>rjRenderAllAds()).observe(target,{childList:true,subtree:false});
    }
    window.addEventListener("resize",()=>rjRenderAllAds());
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",rjStart);
  else rjStart();
})();
