// Debug
console.log("Found Poems extension loaded");

// Listen for clicks on the page
document.addEventListener("click", function (event) {
  // If the click is already on a redacted word, toggle it
  if (event.target.classList.contains("redacted-word")) {
    event.target.classList.toggle("redacted");
    return;
  }

  // Find the text node that was clicked using the cursor's position on screen (# of pixels from left edge and from top edge)
  const range = document.caretRangeFromPoint(event.clientX, event.clientY);
  if (!range || range.startContainer.nodeType !== 3) return;

  const textNode = range.startContainer;
  const fullText = textNode.textContent;
  const clickPosition = range.startOffset;

  // Find word boundaries by moving backwards and forwards from the click point until hitting a non-word character
  let start = clickPosition;
  let end = clickPosition;

  while (start > 0 && /\w/.test(fullText[start - 1])) {
    start--;
  }
  while (end < fullText.length && /\w/.test(fullText[end])) {
    end++;
  }

  // Extract the word
  const word = fullText.substring(start, end);
  if (!word) return;

  // Split the text node and wrap the word in a span
  const beforeText = fullText.substring(0, start);
  const afterText = fullText.substring(end);

  const beforeNode = document.createTextNode(beforeText);
  const wordSpan = document.createElement("span");
  wordSpan.textContent = word;
  wordSpan.className = "redacted-word";
  const afterNode = document.createTextNode(afterText);

  textNode.parentNode.replaceChild(beforeNode, textNode);
  beforeNode.parentNode.insertBefore(wordSpan, beforeNode.nextSibling);
  wordSpan.parentNode.insertBefore(afterNode, wordSpan.nextSibling);

  wordSpan.classList.add("redacted");
});

// Add styles for redacted words
const style = document.createElement("style");
style.textContent = `
  .redacted-word {
    cursor: pointer;
  }
  .redacted-word.redacted {
    background-color: black;
    color: black;
  }
`;
document.head.appendChild(style);

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "clearAll") {
    const redactedWords = document.querySelectorAll(".redacted-word.redacted");
    redactedWords.forEach(function (word) {
      word.classList.remove("redacted");
    });
  }
});
