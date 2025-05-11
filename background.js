// background.js

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performSearch') {
    console.log('📥 Received search request:', request.searchData);

    // Save to Chrome local storage
    chrome.storage.local.set(
      {
        scholarSearchData: {
          ...request.searchData,
          timestamp: new Date().toISOString(),
        },
      },
      () => {
        console.log('✅ Search data saved to chrome.storage.local');

        // 🔗 Call FastAPI backend
        fetch('https://chrome-extension-scholary-search-main.onrender.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.searchData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log('📬 Data received from backend:', data);

            if (data.results && Array.isArray(data.results)) {
              sendResponse({
                success: true,
                message: 'Search completed successfully',
                data: data.results,
              });
            } else {
              sendResponse({
                success: false,
                message: 'No valid results received from backend.',
              });
            }
          })
          .catch((err) => {
            console.error('❌ Backend error:', err);
            sendResponse({
              success: false,
              message: 'Backend request failed: ' + err.message,
            });
          });
      }
    );

    return true; // Needed for async response
  }
});