const lineCtx = document.getElementById('visitChart');
if(lineCtx){new Chart(lineCtx,{type:'line',data:{labels:['30 May','31 May','1 Jun','2 Jun','3 Jun','4 Jun','5 Jun'],datasets:[{label:'Visitors',data:[450,900,520,1080,950,1180,980],fill:true,tension:.45}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#9fb2ca'},grid:{color:'rgba(255,255,255,.05)'}},y:{ticks:{color:'#9fb2ca'},grid:{color:'rgba(255,255,255,.08)'}}}}});}
const doughnutCtx = document.getElementById('userChart');
if(doughnutCtx){new Chart(doughnutCtx,{type:'doughnut',data:{labels:['Active','New','Inactive','Blocked'],datasets:[{data:[8542,248,3245,810]}]},options:{plugins:{legend:{position:'right',labels:{color:'#dbeafe'}}}}});}
document.querySelectorAll('nav button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
setInterval(()=>{document.querySelectorAll('.card h2').forEach(el=>{el.style.textShadow='0 0 20px rgba(99,102,241,.9)';setTimeout(()=>el.style.textShadow='none',500)})},3000);
