function bytesToSize(b){if(!b)return'0 B';const k=1024,s=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k));return(b/Math.pow(k,i)).toFixed(2)+' '+s[i]}

// ===== Rapid Job Tools Live Date, Time and Dark Mode =====
(function(){
  function updateToolsClock(){
    const now = new Date();
    const dateEl = document.getElementById("toolsLiveDate");
    const timeEl = document.getElementById("toolsLiveTime");

    if(dateEl){
      dateEl.textContent = now.toLocaleDateString("en-GB",{
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
      });
    }

    if(timeEl){
      timeEl.textContent = now.toLocaleTimeString("en-IN",{
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:true
      });
    }
  }

  updateToolsClock();
  setInterval(updateToolsClock,1000);

  const modeBtn = document.getElementById("toolsModeBtn");
  if(localStorage.getItem("rapidToolsDark")==="true"){
    document.body.classList.add("dark");
    if(modeBtn) modeBtn.textContent="☀️";
  }

  if(modeBtn){
    modeBtn.addEventListener("click",function(){
      document.body.classList.toggle("dark");
      const enabled = document.body.classList.contains("dark");
      localStorage.setItem("rapidToolsDark",enabled);
      modeBtn.textContent = enabled ? "☀️" : "🌙";
    });
  }
})();

