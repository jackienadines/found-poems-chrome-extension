// Get the current tab: via https://developer.chrome.com/docs/extensions/reference/api/tabs

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// Get the current tab's state and trigger default button state

async function getState() {
  const tab = await getCurrentTab();
  const response = await chrome.tabs.sendMessage(tab.id, { action: 'getState' });
  updateButton(response);
}

// Update the button

const toggleButton = document.querySelector('#toggleButton')
toggleButton.addEventListener("click", toggle)

async function toggle() {
  const tab = await getCurrentTab();
  const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
  updateButton(response);
}

function updateButton(response) {
  if (response.currentState === true) {
    toggleButton.textContent = "Turn Off"
  }
  else {
    toggleButton.textContent = "Turn On"
  }
}

getState();
