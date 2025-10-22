/*
  NOTE: Browser Extension Development Paused

  The code for the browser extension background worker has been temporarily commented out
  to stabilize the development workflow for the main web application and prevent
  recurring build errors.

  The file structure and this commented-out code are being kept as a blueprint
  for when development on this feature resumes. Do not uncomment or modify this
  file until the feature is officially scheduled for active development.
*/
/*
// Fix: Added a triple-slash directive to include type definitions for the Chrome extension APIs. This resolves errors related to the 'chrome' object being undefined.
/// <reference types="chrome" />

type CaptureState = 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';

interface ExtensionState {
  state: CaptureState;
  stream: MediaStream | null;
  tabTitle: string;
}

// In-memory state for the service worker
let extensionState: ExtensionState = {
  state: 'idle',
  stream: null,
  tabTitle: 'this tab',
};

// Function to broadcast the current state to the popup
const broadcastState = () => {
  chrome.runtime.sendMessage({
    type: 'STATE_UPDATE',
    state: extensionState.state,
    tabTitle: extensionState.tabTitle,
  }).catch(error => {
    // Suppress "Receiving end does not exist" error when popup is closed
    if (error.message.includes('Receiving end does not exist')) return;
    console.warn('Error broadcasting state:', error);
  });
};

const startCapture = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    console.error('Could not get active tab.');
    extensionState.state = 'error';
    broadcastState();
    return;
  }

  extensionState.tabTitle = tab.title || 'this tab';
  
  try {
    extensionState.stream = await chrome.tabCapture.capture({ audio: true });
    extensionState.state = 'capturing';
    broadcastState();

    // In a real app, you would connect to Gemini here and stream the audio.
    // The stream automatically stops when the tab is closed or navigates.
    extensionState.stream.getAudioTracks()[0].onended = () => {
        // If the stream ends unexpectedly (e.g., user navigates away)
        // and we are still in capturing state, stop the process.
        if (extensionState.state === 'capturing') {
            stopCapture();
        }
    };

  } catch (error) {
    console.error('Tab capture failed:', error);
    extensionState.state = 'error';
    broadcastState();
  }
};

const stopCapture = () => {
  if (extensionState.stream) {
    extensionState.stream.getAudioTracks().forEach(track => track.stop());
    extensionState.stream = null;
  }

  extensionState.state = 'analyzing';
  broadcastState();

  // Simulate AI analysis and saving to the backend
  setTimeout(() => {
    extensionState.state = 'complete';
    broadcastState();
  }, 3000); // 3-second mock analysis
};

// Main message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STATE':
      sendResponse({ state: extensionState.state, tabTitle: extensionState.tabTitle });
      break;
    case 'START_CAPTURE':
      startCapture();
      break;
    case 'STOP_CAPTURE':
      stopCapture();
      break;
  }
  return true; // Indicates async response
});
*/