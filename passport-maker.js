const input=document.getElementById("photoInput");
const canvas=document.getElementById("photoCanvas");
const ctx=canvas.getContext("2d");
const presets={
  passport:{w:413,h:531,label:"Passport 35 × 45 mm"},
  india:{w:602,h:602,label:"India Passport 51 × 51 mm"},
  aadhaar:{w:295,h:413,label:"Aadhaar/PAN 25 × 35 mm"},
  visa:{w:591,h:591,label:"Visa 50 × 50 mm"}
};
let img=new Image(),loaded=false,bg="#ffffff",scale=1,offsetX=0,offsetY=0,drag=false,startX=0,startY=0,cleanBg=false;
function setPreset(key){
  const p=presets[key]||presets.passport;
  canvas.width=p.w;canvas.height=p.h;
  draw();
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if(!loaded){
    ctx.fillStyle="#64748b";
    ctx.font="bold 24px Arial";
    ctx.textAlign="center";
    ctx.fillText("Upload Photo",canvas.width/2,canvas.height/2);
    return;
  }
  const r=Math.max(canvas.width/img.width,canvas.height/img.height)*scale;
  const w=img.width*r,h=img.height*r;
  const x=(canvas.width-w)/2+offsetX,y=(canvas.height-h)/2+offsetY;
  if(cleanBg){
    const temp=document.createElement("canvas");
    temp.width=canvas.width;temp.height=canvas.height;
    const t=temp.getContext("2d");
    t.drawImage(img,x,y,w,h);
    const data=t.getImageData(0,0,temp.width,temp.height);
    for(let i=0;i<data.data.length;i+=4){
      const R=data.data[i],G=data.data[i+1],B=data.data[i+2];
      if(R>205&&G>205&&B>205){data.data[i+3]=0}
    }
    t.putImageData(data,0,0);
    ctx.drawImage(temp,0,0);
  }else{
    ctx.drawImage(img,x,y,w,h);
  }
  ctx.strokeStyle="rgba(7,94,232,.55)";
  ctx.lineWidth=4;
  ctx.strokeRect(2,2,canvas.width-4,canvas.height-4);
}
input.onchange=e=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    img.onload=()=>{loaded=true;scale=1;offsetX=0;offsetY=0;cleanBg=false;draw()};
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
};
document.querySelectorAll(".pm-colors button").forEach(btn=>{
  btn.onclick=()=>{document.querySelectorAll(".pm-colors button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");bg=btn.dataset.bg;draw();}
});
document.getElementById("presetSelect").onchange=e=>setPreset(e.target.value);
document.getElementById("zoomIn").onclick=()=>{scale+=.08;draw()};
document.getElementById("zoomOut").onclick=()=>{if(scale>.45){scale-=.08;draw()}};
document.getElementById("resetBtn").onclick=()=>{scale=1;offsetX=0;offsetY=0;cleanBg=false;draw()};
document.getElementById("removeBgBtn").onclick=()=>{cleanBg=!cleanBg;draw()};
canvas.addEventListener("mousedown",e=>{drag=true;startX=e.offsetX-offsetX;startY=e.offsetY-offsetY});
canvas.addEventListener("mousemove",e=>{if(!drag)return;offsetX=e.offsetX-startX;offsetY=e.offsetY-startY;draw()});
window.addEventListener("mouseup",()=>drag=false);
canvas.addEventListener("touchstart",e=>{const r=canvas.getBoundingClientRect();drag=true;startX=e.touches[0].clientX-r.left-offsetX;startY=e.touches[0].clientY-r.top-offsetY},{passive:true});
canvas.addEventListener("touchmove",e=>{if(!drag)return;const r=canvas.getBoundingClientRect();offsetX=e.touches[0].clientX-r.left-startX;offsetY=e.touches[0].clientY-r.top-startY;draw()},{passive:true});
window.addEventListener("touchend",()=>drag=false);
canvas.addEventListener("wheel",e=>{e.preventDefault();scale+=e.deltaY<0?.06:-.06;if(scale<.45)scale=.45;draw()},{passive:false});
document.getElementById("downloadPhoto").onclick=()=>{
  const a=document.createElement("a");
  a.download="rapid-job-passport-photo-HD.png";
  a.href=canvas.toDataURL("image/png",1);
  a.click();
};
document.getElementById("downloadSheet").onclick=()=>{
  const sheet=document.createElement("canvas");
  sheet.width=2480;sheet.height=3508;
  const s=sheet.getContext("2d");
  s.fillStyle="#fff";s.fillRect(0,0,sheet.width,sheet.height);
  const gap=80, cols=4;
  const ratio=canvas.width/canvas.height;
  const pw=420, ph=pw/ratio;
  let x=160,y=160,count=0;
  for(let i=0;i<20;i++){
    s.drawImage(canvas,x,y,pw,ph);
    s.strokeStyle="#ddd";s.strokeRect(x,y,pw,ph);
    count++; x+=pw+gap;
    if(count%cols===0){x=160;y+=ph+gap;}
  }
  const a=document.createElement("a");
  a.download="rapid-job-passport-photo-a4-sheet.png";
  a.href=sheet.toDataURL("image/png",1);
  a.click();
};
setPreset("passport");
