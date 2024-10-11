document.getElementById('generateButton').addEventListener('click', async () => {
    console.log('Button clicked. Attempting to send message to content script...');
    const loader = document.getElementById('loader');
    const questionOutput = document.getElementById('questionOutput');
    const generateButton = document.getElementById('generateButton');
  
    // Show loader and disable button
    toggleLoadingState(true);
    questionOutput.innerText = '';
  
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        console.error('No active tab found');
        toggleLoadingState(false);
        return;
      }
  
      // Send message to the content script to generate the question
      chrome.tabs.sendMessage(tab.id, { action: 'generateQuestion' }, (response) => {
        toggleLoadingState(false);
  
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message);
          questionOutput.innerText = 'Error: ' + chrome.runtime.lastError.message;
        } else {
          console.log('Message sent successfully, received response:', response);
          
          // Convert **Question** to <strong>Question</strong> if present in response
          if (response?.question) {
            const formattedQuestion = response.question.replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>');
            questionOutput.innerHTML = formattedQuestion;
          } else {
            questionOutput.innerText = 'No text found.';
          }
        }
      });
    } catch (error) {
      toggleLoadingState(false);
      questionOutput.innerText = 'An error occurred.';
      console.error('Popup error:', error);
    }
  });
  
  // Helper function to toggle the loading state
  function toggleLoadingState(isLoading) {
    const loader = document.getElementById('loader');
    const generateButton = document.getElementById('generateButton');
  
    if (isLoading) {
      loader.style.display = 'block';
      generateButton.disabled = true;
      generateButton.textContent = 'Generating...';
    } else {
      loader.style.display = 'none';
      generateButton.disabled = false;
      generateButton.textContent = 'Generate Question';
    }
  }  