const progress = document.querySelector('.top-progress');
const backTop = document.querySelector('.back-top');

function updateProgress(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
  progress.style.width = pct + '%';
  backTop.classList.toggle('show', doc.scrollTop > 450);
}
window.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.policy-card').forEach(card=>observer.observe(card));

document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item = btn.closest('.faq-item');
    item.classList.toggle('open');
  });
});

backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));