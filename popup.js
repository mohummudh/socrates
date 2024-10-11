document.getElementById('generateButton').addEventListener('click', async () => {
    console.log('Button clicked. Attempting to send message to content script...');
    const loader = document.getElementById('loader');
    const questionOutput = document.getElementById('questionOutput');
  
    // Show loader
    loader.style.display = 'block';
    questionOutput.innerText = '';
  
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        console.error('No active tab found');
        loader.style.display = 'none';
        return;
      }
  
      chrome.tabs.sendMessage(tab.id, { action: 'generateQuestion' }, (response) => {
        loader.style.display = 'none';
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message);
          questionOutput.innerText = 'Error: ' + chrome.runtime.lastError.message;
        } else {
          console.log('Message sent successfully, received response:', response);
          questionOutput.innerText = response?.question || 'No text found.';
        }
      });
    } catch (error) {
      loader.style.display = 'none';
      questionOutput.innerText = 'An error occurred.';
      console.error('Popup error:', error);
    }
  });
  