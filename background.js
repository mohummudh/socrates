chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'generateQuestion',
      title: 'Generate Question from Selection',
      contexts: ['selection']
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'generateQuestion') {
      chrome.tabs.sendMessage(tab.id, { action: 'generateQuestion' }, (response) => {
        // Optionally handle the response
      });
    }
  });
  