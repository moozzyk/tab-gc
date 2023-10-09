import { getDuplicateTabsCount, getDuplicateTabIds, getAllDuplicateTabs, setBadgeText } from "./shared.js";

async function updateDuplicateTabCount() {
  const {activeTabDuplicatesCount, allDuplicateTabsCount} = await getDuplicateTabsCount();
  setBadgeText(activeTabDuplicatesCount);

  let tabDuplicatesBtn = document.getElementById("close-duplicates-btn");
  tabDuplicatesBtn.innerText = `Close duplicates of this tab (${activeTabDuplicatesCount} tabs)`;
  tabDuplicatesBtn.disabled = activeTabDuplicatesCount === 0;

  let allDuplicatesBtn = document.getElementById("close-all-duplicates-btn");
  allDuplicatesBtn.innerText = `Close all duplicate tabs (${allDuplicateTabsCount} tabs)`;
  allDuplicatesBtn.disabled = allDuplicateTabsCount === 0;
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

await updateDuplicateTabCount();
