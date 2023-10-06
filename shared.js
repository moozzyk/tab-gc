
async function getCurrentTab() {
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

export async function getDuplicateTabIds() {
    const currentTab = await getCurrentTab();
    if (!currentTab) {
      return [];
    }

    let duplicateTabs = await chrome.tabs.query({url: currentTab.url});
    let duplicateTabIds = duplicateTabs
      .filter(tab => tab.id !== currentTab.id)
      .map(tab => tab.id);
    return duplicateTabIds;
}

export async function getAllDuplicateTabs() {
    const allTabs = await chrome.tabs.query({});
    const tabMap = new Map();
    allTabs.forEach((tab) => {
      if (!tabMap.has(tab.url)) {
        tabMap.set(tab.url, []);
      }
      if (tab.active) {
        // Put active tab at the front of the list so it's not closed
        tabMap.get(tab.url).unshift(tab.id);
      } else {
        tabMap.get(tab.url).push(tab.id);
      }
    });
    return tabMap;
}

export async function getDuplicateTabsCount() {
  const activeTabDuplicatesCount = (await getDuplicateTabIds()).length;
  const duplicateTabMap = await getAllDuplicateTabs();
  let allDuplicateTabsCount = 0;
  duplicateTabMap.forEach((v) => {
    allDuplicateTabsCount += v.length - 1;
  });
  return {activeTabDuplicatesCount, allDuplicateTabsCount};
}

export function setBadgeText(activeTabDuplicatesCount) {
  chrome.action.setBadgeText({text: activeTabDuplicatesCount > 0 ? activeTabDuplicatesCount.toString() : null});
}