// panel.js

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
function handleFindPaperClick() {
    console.log('FIND PAPER button clicked');

    // Hide the main content and show the loading window
    const mainContent = document.getElementById('fallbackUI');
    const loadingWindow = document.getElementById('loadingWindow');

    // Send user input to the background script
    chrome.runtime.sendMessage({
        action: 'performSearch',
        searchData: userInput
    }, (response) => {
        console.log('Received response:', response);

    // Hide loading screen, show main content again
    loadingWindow.classList.remove('show');
    mainContent.classList.remove('hide');

    if (response && response.success) {
      // TODO: Display actual search results
      console.log('Search completed successfully:', response.data);
    } else {
      // TODO: Handle error visually
      console.error('Search failed:', response?.message || 'Unknown error');
    }
  });
}

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
    document.getElementById('keywords').addEventListener('input', handleKeywordsChange);
    document.getElementById('searchBtn').addEventListener('click', handleFindPaperClick);
  
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