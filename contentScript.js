// Content script for handling message and generating questions

console.log('Content script loaded successfully.');

let session = null; // Reuse session to improve performance

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);

  if (request.action === 'generateQuestion') {
    handleGenerateQuestion(request, sendResponse);
    return true; // Indicates asynchronous response
  }
});

// Function to handle 'generateQuestion' action
function handleGenerateQuestion(request, sendResponse) {
  const selectedText = getSelectedText();

  if (!selectedText) {
    sendResponse({ question: 'No text selected. Please select some text on the page.' });
    return;
  }

  generateQuestion(selectedText)
    .then(question => sendResponse({ question }))
    .catch(error => {
      console.error('Error generating question:', error);
      sendResponse({ question: 'Error generating question.' });
    });
}

// Function to get the selected text from the page
function getSelectedText() {
  return window.getSelection().toString().trim();
}

// Function to generate a question based on the given text using Gemini Nano Prompt API
async function generateQuestion(text) {
    const prompt = `You are an educational assistant. Based on the following text, ask a question that Socrates might have asked about this:\n\n"${text}"`;

  try {
    const { available } = await ai.assistant.capabilities();
    if (available !== "readily") {
      throw new Error("Gemini Nano model is not available.");
    }

    if (!session) {
      session = await ai.assistant.create();
    }

    return await session.prompt(prompt);
  } catch (error) {
    console.error('AI generation error:', error);
    return 'Error generating question.';
  }
}
