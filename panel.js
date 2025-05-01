document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("query").value;
    const keywords = document.getElementById("keywords").value;
  
    chrome.runtime.sendMessage({
      action: "performSearch",
      searchData: { query, keywords }
    });
  });
  