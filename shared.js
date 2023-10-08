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

async function getCurrentTab() {
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab) {
    // Somehow the above doesn't work for a tab that as gmail opened in it.
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  }
  return tab;
}

export async function getDuplicateTabIds(tabMap) {
    const currentTab = await getCurrentTab();
    if (!currentTab) {
      return [];
    }

    if (!tabMap) {
      tabMap = await getAllDuplicateTabs();
    }

    const duplicateTabs = tabMap.get(currentTab.url);
    return duplicateTabs.slice(1);
}

export async function getDuplicateTabsCount() {
  const duplicateTabMap = await getAllDuplicateTabs();
  const activeTabDuplicatesCount = (await getDuplicateTabIds(duplicateTabMap)).length;
  let allDuplicateTabsCount = 0;
  duplicateTabMap.forEach((v) => {
    allDuplicateTabsCount += v.length - 1;
  });
  return {activeTabDuplicatesCount, allDuplicateTabsCount};
}

export function setBadgeText(activeTabDuplicatesCount) {
  chrome.action.setBadgeText({text: activeTabDuplicatesCount > 0 ? activeTabDuplicatesCount.toString() : null});
}