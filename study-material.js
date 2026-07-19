const firebaseConfig={apiKey:"AIzaSyBRLAUu228CbxbvokRG2Xp1hcGFhfrqpIQ",authDomain:"rapid-job-09.firebaseapp.com",databaseURL:"https://rapid-job-09-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"rapid-job-09",storageBucket:"rapid-job-09.firebasestorage.app",messagingSenderId:"129444686750",appId:"1:129444686750:web:6175ba1f1bfe7c9fff048f"};if(!firebase.apps.length)firebase.initializeApp(firebaseConfig);const db=firebase.database(),grid=document.getElementById("materialGrid"),empty=document.getElementById("emptyState"),count=document.getElementById("resultCount");let materials=[];const esc=s=>String(s??"").replace(/[&<>\"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#039;"}[c]));function clock(){const n=new Date();document.getElementById("date").textContent=n.toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"});document.getElementById("time").textContent=n.toLocaleTimeString("en-IN")}setInterval(clock,1000);clock();function setupCategories(){const s=document.getElementById("category"),old=s.value;s.innerHTML='<option value="">All Categories</option>'+[...new Set(materials.map(x=>x.category).filter(Boolean))].sort().map(x=>`<option>${esc(x)}</option>`).join("");s.value=old}function render(){const q=document.getElementById("search").value.toLowerCase(),cat=document.getElementById("category").value,type=document.getElementById("type").value,list=materials.filter(x=>{const hay=`${x.title} ${x.category} ${x.subject} ${x.materialType} ${(x.tags||[]).join(" ")}`.toLowerCase();return(!q||hay.includes(q))&&(!cat||x.category===cat)&&(!type||x.materialType===type)});count.textContent=`${list.length} material${list.length===1?"":"s"} found`;empty.hidden=!!list.length;grid.innerHTML=list.map(x=>`<article class="material"><div class="cover">${x.thumbnail?`<img src="${esc(x.thumbnail)}" alt="${esc(x.title)}">`:'<i class="fa-solid fa-book-open-reader"></i>'}</div><div class="body"><h3>${esc(x.title)}</h3><div class="chips"><span>${esc(x.category||"General")}</span><span>${esc(x.subject||"All Subjects")}</span><span>${esc(x.materialType||"Notes")}</span></div><p>${esc(x.shortDescription||"Study material for exam preparation.")}</p><div class="actions"><a class="btn light" href="study-material-detail.html?id=${encodeURIComponent(x.id)}">View Details</a><a class="btn primary" href="${esc(x.driveUrl||"#")}" target="_blank" rel="noopener"><i class="fa-brands fa-google-drive"></i> View PDF</a></div></div></article>`).join("")}["search","category","type"].forEach(id=>document.getElementById(id).addEventListener("input",render));db.ref("studyMaterials").on("value",snap=>{materials=Object.entries(snap.val()||{}).map(([id,x])=>({id,...x})).filter(x=>x.published!==false).sort((a,b)=>(Number(a.order||999)-Number(b.order||999))||((b.updatedAt||0)-(a.updatedAt||0)));setupCategories();render()},e=>{console.error(e);count.textContent="Unable to load materials";empty.hidden=false});
function updateStudyClock(){

    const now = new Date();

    const date = now.toLocaleDateString("en-IN",{
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
    });

    const time = now.toLocaleTimeString("en-IN");

    const d = document.getElementById("studyLiveDate");
    const t = document.getElementById("studyLiveTime");

    if(d) d.textContent = date;
    if(t) t.textContent = time;
}

updateStudyClock();
setInterval(updateStudyClock,1000);
