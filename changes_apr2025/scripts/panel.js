// panel.js
// Handles user input, search requests, UI display, and modal controls

document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 DOM fully loaded");

  const searchBtn = document.getElementById("searchBtn");
  const loadingWindow = document.getElementById("loadingWindow");
  const root = document.getElementById("root");
  const fallbackUI = document.getElementById("fallbackUI");

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
          console.log("📨 Panel received response:", response);
          loadingWindow.classList.remove("show");

          if (
            !response ||
            !response.results ||
            !Array.isArray(response.results) ||
            response.results.length === 0
          ) {
            root.innerHTML = "<p>❌ No results found or there was an error.</p>";
            root.style.display = "block";
            fallbackUI.style.display = "none";
            return;
          }

          response.results.forEach((paper, i) => {
            const el = document.createElement("div");
            el.className = "result-card";
            el.innerHTML = `
              <h3>Rank ${i + 1}: ${paper.title}</h3>
              <p><strong>Score:</strong> ${paper.score}</p>
              <p><strong>Abstract:</strong> ${paper.abstract}</p>
              <a href="${paper.url}" target="_blank">🔗 View Paper</a>
              <hr />
            `;
            root.appendChild(el);
          });

          root.style.display = "block";
          fallbackUI.style.display = "none";
        }
      );
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