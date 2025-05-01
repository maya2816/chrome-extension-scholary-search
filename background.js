// background.js
/**
 * Background script for the Chrome extension.
 *  - Listens for search requests from the side panel UI.
 *  - Sends user input to Semantic Scholar server (Flask).
 *  - Sends returned papers to OpenAI backend (Node).
 *  - Sends ranked results back to the side panel.
 */

// Trigger side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Automatically open side panel on icon click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performSearch') {
    console.log('📥 Received search request:', request.searchData);

    const query = request.searchData.query;
    const keywords = request.searchData.keywords;

    // Save to chrome.storage
    chrome.storage.local.set({
      scholarSearchData: {
        query,
        keywords,
        timestamp: new Date().toISOString()
      }
    }, async () => {
      try {
        // STEP 1: Fetch papers from Semantic Scholar (Flask backend)
        const semanticRes = await fetch('http://localhost:5000/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, keywords })
        });
        const semanticData = await semanticRes.json();

        if (!semanticData.results) {
          throw new Error('Semantic Scholar server returned no results.');
        }

        console.log('✅ Got papers from Flask:', semanticData.results);

        // STEP 2: Send papers + research question to OpenAI backend
        const openaiRes = await fetch('http://localhost:4000/api/rank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            researchQuestion: query,
            papers: semanticData.results
          })
        });
        const openaiData = await openaiRes.json();

        if (!openaiData.result) {
          throw new Error('OpenAI server returned no result.');
        }

        console.log('✅ Got ranked response from OpenAI:', openaiData.result);

        // STEP 3: Send result to side panel
        chrome.runtime.sendMessage({
          action: 'searchResults',
          results: openaiData.result
        });

        sendResponse({ success: true }); // Response for original message
      } catch (error) {
        console.error('❌ Error during full pipeline:', error);
        sendResponse({
          success: false,
          message: error.message
        });
      }
    });

    // Keep async channel open
    return true;
  }
});
