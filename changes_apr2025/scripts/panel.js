// panel.js
// This file manages user input, handles search requests to the background script,
// controls the loading UI, and manages modal interactions in the side panel.

document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("query").value.trim();
    const keywords = document.getElementById("keywords").value
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0);
  
    if (!query || keywords.length === 0) {
      alert("Please enter both a search query and at least one keyword.");
      return;
    }
  
    document.getElementById("loadingWindow").classList.add("show");
  
    chrome.runtime.sendMessage(
      {
        action: "performSearch",
        searchData: { query, keywords }
      },
      (response) => {
        document.getElementById("loadingWindow").classList.remove("show");
  
        
        const root = document.getElementById("root");
        root.style.display = "block";
        root.innerHTML = ""; // Clear previous results
  
        if (!response || !response.success || !response.data) {
          root.innerHTML = "<p>❌ No results found or there was an error.</p>";
          return;
        }
  
        response.data.forEach((paper, i) => {
          const paperEl = document.createElement("div");
          paperEl.classList.add("result-card");
  
          paperEl.innerHTML = `
            <h3>Rank ${i + 1}: ${paper.title}</h3>
            <p><strong>Abstract:</strong> ${paper.abstract}</p>
            <hr />
          `;
  
          root.appendChild(paperEl);
        });
        
      }
    );
  });
  
  

// Track user input state in side-panel
let userInput = {
    query: '',
    keywords: ''
};

/**
 * Function to update the 'query' state when user types
 */
function updateQueryState(event) {
    userInput.query = event.target.value;
    console.log('User query updated:', userInput.query);
}

/**
 * Function to update the 'keywords' state when user types
 */
function updateKeywordsState(event) {
    userInput.keywords = event.target.value;
    console.log('User keywords updated:', userInput.keywords);
}

/**
 * Function to handle "FIND PAPER" button click:
 */
    /** 
function handleFindPaperClick() {
    console.log('FIND PAPER button clicked');

    const mainContent = document.getElementById('fallbackUI');
    const loadingWindow = document.getElementById('loadingWindow');

    // Show loading state
    loadingWindow.classList.add('show');
    mainContent.classList.add('hide');

    // Simulated delay (REPLACE with backend call when ready)
    setTimeout(() => {
        // 🔁 You can replace this logic with an async fetch to backend
        // After 5 seconds, navigate to the results page
        window.location.href = 'results.html';
    }, 5000);
}
    */

/**
 * Function OPEN the "help/about" modal
 */
function openModal() {
    document.getElementById('helpModal').classList.add('show');
    console.log('Opening modal');
}

/**
 * Function to CLOSE the "help/about" modal
 */
function closeModal() {
    document.getElementById('helpModal').classList.remove('show');
    console.log('Closing modal');
}

/**
 * Attach all event listeners when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Bind modal open/close
    document.getElementById('openModal').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Close modal on outside click or ESC key
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('helpModal')) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.getElementById('helpModal').classList.contains('show')) {
            closeModal();
        }
    });

    // Bind input and button events
    document.getElementById('query').addEventListener('input', updateQueryState);
    document.getElementById('keywords').addEventListener('input', updateKeywordsState);
    // document.getElementById('searchBtn').addEventListener('click', handleFindPaperClick);

    // Fallback-to-React check
    const checkReact = setInterval(() => {
        const root = document.getElementById('root');
        if (root && root.children.length > 0) {
            document.getElementById('fallbackUI').style.display = 'none';
            root.style.display = 'block';
            clearInterval(checkReact);
        }
    }, 100);
});