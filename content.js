// Updated June 25 22:32

console.log("Found Poems extension loaded");

document.addEventListener("mouseup", function () {
  const selection = window.getSelection();

  // If nothing is selected, do nothing
  if (!selection || selection.isCollapsed) return;

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  // Get the range of the selection
  const range = selection.getRangeAt(0);

  // Split selection into words (split on spaces)
  const fragment = range.extractContents();
  const words = fragment.textContent.split(" ");

  // Check if any words in selection are already redacted
  const redactedWords = fragment.querySelectorAll(".redacted-word.redacted");
  const hasRedacted = redactedWords.length > 0;

  // Create a new fragment to replace the selection with
  const newFragment = document.createDocumentFragment();

  words.forEach(function (word, index) {
    if (word === "") return;

    const span = document.createElement("span");
    span.textContent = word;
    span.className = "redacted-word";

    // If mixed or all redacted, un-redact. If all unredacted, redact.
    if (!hasRedacted) {
      span.classList.add("redacted");
    }

    newFragment.appendChild(span);

    // Add space between words (except after last word)
    if (index < words.length - 1) {
      newFragment.appendChild(document.createTextNode(" "));
    }
  });

  // Replace the selected content with our new spans
  range.insertNode(newFragment);

  // Clear the selection
  selection.removeAllRanges();
});

// Handle clicking individual redacted words to toggle them
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("redacted-word")) {
    event.target.classList.toggle("redacted");
  }
});

// Add styles
const style = document.createElement("style");
style.textContent = `
  .redacted-word {
    cursor: pointer;
  }
  .redacted-word.redacted {
    background-color: black;
    color: black;
    user-select: none;
  }
`;
document.head.appendChild(style);
