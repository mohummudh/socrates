console.log('Content script loaded successfully.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Log messages to track what happens in the content script
    console.log('Message received in content script:', request);
    console.log('Content script loaded successfully.');
  
    // Handle "generateQuestion" action
    if (request.action === 'generateQuestion') {
      let pageText = document.body.innerText.trim();
  
      if (!pageText) {
        sendResponse({ question: 'No text found on this page.' });
        return;
      }
  
      // Call the function to generate the question with the full page text
      generateQuestion(pageText).then((question) => {
        sendResponse({ question });
      }).catch((error) => {
        console.error('Error generating question:', error);
        sendResponse({ question: 'Error generating question.' });
      });
  
      return true; // Indicates asynchronous response
    }
  });
  
  // Function to generate a question based on the given text
  async function generateQuestion(text) {
    // Use a prompt to generate the question
    const prompt = `Based on the following text, generate the most important question to test understanding:\n\n"${text}"`;
  
    try {
      // Uncomment this block to use a simulated response for testing purposes:
      return `What is the main idea of the following text: "${text.substring(0, 100)}..."?`;
  
      // Uncomment this block to use the actual Chrome AI API when available:
      /*
      const response = await chrome.ai.generate({
        prompt: prompt,
        // Include any required parameters per the API documentation
      });
      return response.text;
      */
  
    } catch (error) {
      console.error('AI generation error:', error);
      return 'Error generating question.';
    }
  }
  