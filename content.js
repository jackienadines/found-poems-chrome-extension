// Turn the extension on or off

let extensionOn = false;

chrome.runtime.onMessage.addListener((request, sendResponse) => {
  if (request.action === "getState") {
    sendResponse({ currentState: extensionOn });
  } else if (request.action === "toggle") {
    extensionOn = !extensionOn;

    if (extensionOn === false) {
      const redacted = document.querySelectorAll(".redacted-word");
      for (let i = 0; i < redacted.length; i++) {
        const textNode = document.createTextNode(redacted[i].textContent);
        redacted[i].replaceWith(textNode);
      }
    }

    sendResponse({ currentState: extensionOn });
  }
});
