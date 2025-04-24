// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open the side panel
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Set the side panel icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performSearch') {
    console.log('Received search request:', request.searchData);
    
    // Store the search data
    chrome.storage.local.set({
      'scholarSearchData': {
        query: request.searchData.query,
        keywords: request.searchData.keywords,
        timestamp: new Date().toISOString()
      }
    }, () => {
      console.log('Search data saved to storage');
      
      // Simulate search process (replace with actual API call later)
      setTimeout(() => {
        // Send response back to the side panel
        sendResponse({
          success: true,
          message: 'Search completed',
          data: {
            query: request.searchData.query,
            keywords: request.searchData.keywords,
            // Add more data here when implementing actual search
          }
        });
      }, 2000);
    });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
}); 