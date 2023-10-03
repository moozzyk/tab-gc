
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getDuplicateTabIds() {
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

async function getAllDuplicateTabs() {
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

const closeDuplicateTabsButton = document.getElementById("close-duplicates-btn");
closeDuplicateTabsButton.addEventListener("click", async () => {
  try {
    const duplicateTabIds = await getDuplicateTabIds();
    await chrome.tabs.remove(duplicateTabIds);
    await updateDuplicateTabCount();
  } catch (error) {
    console.error(error);
  }
});

const closeAllDuplicateTabsButton = document.getElementById("close-all-duplicates-btn");
closeAllDuplicateTabsButton.addEventListener("click", async () => {
  try {
    const duplicateTabMap = await getAllDuplicateTabs();
    const tabsToClose = [];
    duplicateTabMap.forEach((v) => {
      tabsToClose.push(...v.slice(1));
    });
    await chrome.tabs.remove(tabsToClose);
    await updateDuplicateTabCount();
  } catch (error) {
    console.error(error);
  }
});

async function updateDuplicateTabCount() {
  const duplicateTabCount = (await getDuplicateTabIds()).length;
  closeDuplicateTabsButton.innerText = `Close duplicate tabs (${duplicateTabCount} tabs)`;

  const duplicateTabMap = await getAllDuplicateTabs();
  let numDuplicateTabs = 0;
  duplicateTabMap.forEach((v) => {
    numDuplicateTabs += v.length - 1;
  });
  closeAllDuplicateTabsButton.innerText = `Close all duplicate tabs (${numDuplicateTabs} tabs)`;
}

await updateDuplicateTabCount();
