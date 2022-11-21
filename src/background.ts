import Reader from 'src/lib/reader.js';

const openOptionsPage = ({ reason }: chrome.runtime.InstalledDetails) => {
    if (reason === 'install') chrome.runtime.openOptionsPage();
};

chrome.runtime.onInstalled.addListener(openOptionsPage);

function portConnected(port: chrome.runtime.Port) {
    const reader = new Reader(port);
    reader.start();
}

chrome.runtime.onConnect.addListener(portConnected);
