(function () {
  const script = document.currentScript;
  const url = new URL(script.src);
  const clientId = url.searchParams.get("client");

  if (!clientId) return console.error("Client ID manquant dans le script src.");

  fetch(`/config/${clientId}.json`)
    .then((res) => res.json())
    .then((data) => {
      const { logo, color, review, sav } = data;
      const container = document.createElement("div");

      container.style.maxWidth = "360px";
      container.style.padding = "16px";
      container.style.margin = "24px auto";
      container.style.background = "#fff";
      container.style.border = "1px solid #ddd";
      container.style.borderRadius = "12px";
      container.style.fontFamily = "Segoe UI, sans-serif";
      container.style.textAlign = "center";
      container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";

      if (logo) {
        const img = document.createElement("img");
        img.src = logo;
        img.style.maxHeight = "48px";
        img.style.marginBottom = "12px";
        container.appendChild(img);
      }

      const question = document.createElement("p");
      question.textContent = "Comment évaluez-vous votre expérience ?";
      question.style.fontWeight = "500";
      container.appendChild(question);

      const stars = document.createElement("div");
      stars.style.fontSize = "24px";
      stars.style.cursor = "pointer";
      stars.style.color = "#ccc";
      stars.style.userSelect = "none";
      stars.style.marginTop = "8px";

      let score = 0;

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = "★";
        star.setAttribute("data-score", i.toString());
        star.addEventListener("mouseover", () => highlight(i));
        star.addEventListener("mouseout", () => highlight(score));
        star.addEventListener("click", () => {
          score = i;
          highlight(score);
          setTimeout(() => {
            const target = score >= 4 ? review : sav;
            window.location.href = target;
          }, 200);
        });
        stars.appendChild(star);
      }

      container.appendChild(stars);
      script.parentNode.insertBefore(container, script.nextSibling);

      function highlight(n) {
        const allStars = stars.querySelectorAll("span");
        allStars.forEach((s, i) => {
          s.style.color = i < n ? color : "#ccc";
        });
      }
    })
    .catch((err) => console.error("Erreur chargement config client:", err));
})();
