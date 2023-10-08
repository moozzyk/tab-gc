import { getDuplicateTabsCount, setBadgeText } from "./shared.js";

async function updateBadgeText() {
  console.log("updateBadgeText");
  const {activeTabDuplicatesCount} = await getDuplicateTabsCount();
  setBadgeText(activeTabDuplicatesCount);
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tabInfo) => {
  if (!changeInfo.url) {
    await updateBadgeText();
  }
});

chrome.tabs.onActivated.addListener(async () => {
  await updateBadgeText();
});
