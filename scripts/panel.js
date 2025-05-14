document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const loadingWindow = document.getElementById("loadingWindow");
  const root = document.getElementById("root");
  const fallbackUI = document.getElementById("fallbackUI");
  const backBtn = document.getElementById("backBtn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = document.getElementById("query").value.trim();
      const keywords = document
        .getElementById("keywords")
        .value.split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

      if (!query || keywords.length === 0) {
        alert("Please enter both a search query and at least one keyword.");
        return;
      }

      loadingWindow.classList.add("show");
      root.innerHTML = "";

      chrome.runtime.sendMessage(
        {
          action: "performSearch",
          searchData: { query, keywords },
        },
        (response) => {
          loadingWindow.classList.remove("show");

          if (!response || !Array.isArray(response.data) || response.data.length === 0) {
            root.innerHTML = `
              <div style="text-align: center; margin-top: 50px;">
              <p>❌ No results found or there was an error.</p>
              <p>Please try a different search query or keyword set.</p>
              </div>
            `;
            root.style.display = "block";
            fallbackUI.style.display = "none";
            backBtn.style.display = "block";
            return;
          }

          root.innerHTML = ""; // Clear previous results

          const summaryCard = document.createElement("div");
          summaryCard.className = "summary-card";
          summaryCard.innerHTML = `
            <p><strong>Query:</strong> ${query}</p>
            <p><strong>Keywords:</strong> ${keywords.join(", ")}</p>
          `;
          root.appendChild(summaryCard);

          response.data.forEach((paper, i) => {
            const el = document.createElement("div");
            el.className = "result-card";
          
            const shortAbstract = paper.abstract.slice(0, 250);
            const isLong = paper.abstract.length > 250;
          
            el.innerHTML = `
              <h3>Rank ${i + 1}: ${paper.title}</h3>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <p style="margin: 0;"><strong>Score:</strong> ${paper.score !== undefined ? paper.score : "N/A"}</p>
                <a href="${paper.url}" target="_blank" style="font-size: 14px; margin-left: auto;">🔗 View paper</a>
              </div>
              <p><em>Summarized Abstract:</em></p>
              <p class="abstract-text">${shortAbstract}${isLong ? "..." : ""}</p>
              ${isLong ? `<button class="toggle-abstract">Show More</button>` : ""}
              <hr />
            `;
          
            if (isLong) {
              const btn = el.querySelector(".toggle-abstract");
              const p = el.querySelector(".abstract-text");
              let expanded = false;
              btn.addEventListener("click", () => {
                expanded = !expanded;
                p.textContent = expanded ? paper.abstract : shortAbstract + "...";
                btn.textContent = expanded ? "Show Less" : "Show More";
              });
            }
          
            root.appendChild(el);
          });

          fallbackUI.style.display = "none";
          root.style.display = "block";
          backBtn.style.display = "block";
        }
      );
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      fallbackUI.style.display = "block";
      root.innerHTML = "";
      root.style.display = "none";
      backBtn.style.display = "none";
      document.getElementById("query").value = "";
      document.getElementById("keywords").value = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Modal controls
  const helpModal = document.getElementById("helpModal");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.getElementById("closeModal");

  if (openModalBtn && helpModal) {
    openModalBtn.addEventListener("click", () => helpModal.classList.add("show"));
  }

  if (closeModalBtn && helpModal) {
    closeModalBtn.addEventListener("click", () => helpModal.classList.remove("show"));
  }

  window.addEventListener("click", (event) => {
    if (event.target === helpModal) helpModal.classList.remove("show");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && helpModal.classList.contains("show")) {
      helpModal.classList.remove("show");
    }
  });
});
