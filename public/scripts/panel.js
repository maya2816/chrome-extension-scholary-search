// panel.js
// This file manages user input, handles search requests to the background script,
// controls the loading UI, and manages modal interactions in the side panel.

// Track user input state in side-panel
let userInput = {
    query: '',
    keywords: ''
};

/**
* Function to update the 'query' state when user types
is */
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

    const mainContent = document.getElementById('fallbackUI');
    const loadingWindow = document.getElementById('loadingWindow');

    // Show loading state
    loadingWindow.classList.add('show');
    mainContent.classList.add('hide');

    // Simulate loading delay (!!!! Replace this when backend is connected!!!!)
    setTimeout(() => {
        chrome.runtime.sendMessage(
            {
                action: 'performSearch',
                searchData: userInput
            },
            (response) => {
                console.log('Received response:', response);

                // Hide loading and show main UI again
                loadingWindow.classList.remove('show');
                mainContent.classList.remove('hide');

                if (response && response.success) {
                    console.log('Search completed successfully:', response.data);
                } else {
                    console.error('Search failed:', response?.message || 'Unknown error');
                }
            }
        );
    }, 5000); // 🔁 Replace with backend-completion logic when available
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
    document.getElementById('keywords').addEventListener('input', updateKeywordsState);
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