chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pronounceText",
    title: "Pronounce Selected Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "spellText",
    title: "Spell Selected Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pronounceText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: pronounceText,
      args: [info.selectionText]
    });
  } else if (info.menuItemId === "spellText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: spellText,
      args: [info.selectionText]
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getSelectedText
    }, (results) => {
      const selectedText = results[0].result;
      if (command === "pronounce-text") {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: pronounceText,
          args: [selectedText]
        });
      } else if (command === "spell-text") {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: spellText,
          args: [selectedText]
        });
      }
    });
  });
});

function getSelectedText() {
  return window.getSelection().toString();
}

function pronounceText(text) {
  speechSynthesis.cancel(); // Stop previous speech
  let utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function spellText(text) {
  speechSynthesis.cancel(); // Stop previous speech
  let utterance = new SpeechSynthesisUtterance(text.split("").join(" "));
  speechSynthesis.speak(utterance);
}
