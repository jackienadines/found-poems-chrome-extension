// Turn the extension on or off and adjust doc accordingly

let extensionOn = false;

chrome.runtime.onMessage.addListener(function handleMessage(request, sender, sendResponse) {
  if (request.action === "getState") {
    sendResponse({ currentState: extensionOn });
  } else if (request.action === "toggle") {
    extensionOn = !extensionOn;
    if (!extensionOn) {
      document.documentElement.classList.remove("redactable");
      const redacted = document.querySelectorAll(".redacted-text");
      for (let i = 0; i < redacted.length; i++) {
        const textNode = document.createTextNode(redacted[i].textContent);
        redacted[i].replaceWith(textNode);
      }
    } else {
      document.documentElement.classList.add("redactable");
    }
    sendResponse({ currentState: extensionOn });
  }
  return true;
});

// Redact text if necessary

function redact() {
  if (!extensionOn) return;

  const selectionCheck = window.getSelection();
  if (selectionCheck.isCollapsed) return;

  const selection = selectionCheck.getRangeAt(0);
  const redaction = document.createElement("span");
  selection.surroundContents(redaction);
  redaction.className = "redacted-text";

}

document.addEventListener('mouseup', redact);
