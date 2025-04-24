// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open the side panel
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Set the side panel icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }); 