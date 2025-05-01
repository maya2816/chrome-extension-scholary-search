document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("query").value;
    const keywords = document.getElementById("keywords").value;
  
    chrome.runtime.sendMessage({
      action: "performSearch",
      searchData: { query, keywords }
    });
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === 'searchResults') {
    const container = document.createElement('div');
    container.style.marginTop = '20px';
    container.innerHTML = `
    <h3>Ranked Papers:</h3>
    <pre style="white-space: pre-wrap; font-size: 14px;">${message.results}</pre>
    `;
    document.body.appendChild(container);
}
});

