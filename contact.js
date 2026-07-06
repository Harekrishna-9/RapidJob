document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const backTop = document.getElementById("backTop");

  backTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  form?.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = "Please fill all fields.";
      status.style.color = "#e11d48";
      return;
    }

    const body = encodeURIComponent(`Name: ${name}\nEmail/Mobile: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`);
    window.location.href = `mailto:rapidjob@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    status.textContent = "Opening your email app...";
    status.style.color = "#16a34a";
    form.reset();
  });
});
