// panel.js
// Handles user input, search requests, UI display, and modal controls

document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 DOM fully loaded");

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

      console.log("🧠 Sending search:", { query, keywords });
      loadingWindow.classList.add("show");
      root.innerHTML = "";

      chrome.runtime.sendMessage(
        {
          action: "performSearch",
          searchData: { query, keywords },
        },
        (response) => {
          loadingWindow.classList.remove("show");
          console.log("📨 Panel received response:", response);

          if (
            !response ||
            !response.data ||
            !Array.isArray(response.data) ||
            response.data.length === 0
          ) {
            root.innerHTML = "<p>❌ No results found or there was an error.</p>";
            root.style.display = "block";
            fallbackUI.style.display = "none";
            backBtn.style.display = "block";
            return;
          }

          response.data.forEach((paper, i) => {
            const el = document.createElement("div");
            el.className = "result-card";

            // Create collapsible abstract block
            const shortAbstract = paper.abstract.slice(0, 250);
            const isLong = paper.abstract.length > 250;

            el.innerHTML = `
              <h3>Rank ${i + 1}: ${paper.title}</h3>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                ${paper.score ? `<p><strong>Score:</strong> ${paper.score}</p>` : ""}
                <a href="${paper.url}" target="_blank" style="font-size: 14px;">🔗 View</a>
              </div>
              <p class="abstract-text">${shortAbstract}${isLong ? "..." : ""}</p>
              ${isLong ? `<button class="toggle-abstract">Show More</button>` : ""}
              <hr />
            `;

            // Add toggle behavior
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

          root.style.display = "block";
          fallbackUI.style.display = "none";
          backBtn.style.display = "block";
        }
      );
    });
  }

  // 🔙 Handle Back to Search
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      fallbackUI.style.display = "block";
      root.innerHTML = "";
      root.style.display = "none";
      backBtn.style.display = "none";
    });
  }

  // Modal controls
  const helpModal = document.getElementById("helpModal");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.getElementById("closeModal");

  if (openModalBtn && helpModal) {
    openModalBtn.addEventListener("click", () => {
      helpModal.classList.add("show");
      console.log("📖 Help modal opened");
    });
  }

  if (closeModalBtn && helpModal) {
    closeModalBtn.addEventListener("click", () => {
      helpModal.classList.remove("show");
      console.log("📖 Help modal closed");
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === helpModal) {
      helpModal.classList.remove("show");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && helpModal.classList.contains("show")) {
      helpModal.classList.remove("show");
    }
  });
});