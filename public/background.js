// background.js
/**
 * Background script for the Chrome extension.
 *  - Initiates Extension
 *  - Listens for search requests from the side panel UI.
 *  - Stores search input in local Chrome storage.
 *  - Calls Flask server with user query and returns results to UI.
 */

// Trigger side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Automatically open side panel on icon click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performSearch') {
    console.log('📥 Received search request:', request.searchData);

    // Save search data to local storage for record-keeping or recall
    chrome.storage.local.set({
      'scholarSearchData': {
        query: request.searchData.query,
        keywords: request.searchData.keywords,
        timestamp: new Date().toISOString()
      }
    }, () => {
      console.log('✅ Search data saved to chrome.storage.local');

      // Send POST request to Flask server
      fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: request.searchData.query,
          keywords: request.searchData.keywords
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.results) {
            // Server responded with data
            console.log('✅ Received results from Flask:', data.results);
            sendResponse({
              success: true,
              message: 'Search completed successfully',
              data: data.results
            });
          } else {
            // Server response did not include expected results
            console.warn('Flask response missing "results" field.');
            sendResponse({
              success: false,
              message: 'No results returned from backend.'
            });
          }
        })
        .catch(error => {
          // Network or server error
          console.error('❌ Error calling Flask server:', error);
          sendResponse({
            success: false,
            message: 'Error contacting backend: ' + error.message
          });
        });
    });

    // Keep message channel open for async fetch
    return true;
  }
});