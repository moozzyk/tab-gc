import { getDuplicateTabsCount, getDuplicateTabIds, getAllDuplicateTabs, setBadgeText } from "./shared.js";

async function updateDuplicateTabCount() {
  const {activeTabDuplicatesCount, allDuplicateTabsCount} = await getDuplicateTabsCount();
  setBadgeText(activeTabDuplicatesCount);

  document.getElementById("close-duplicates-btn").innerText =
    `Close duplicate tabs (${activeTabDuplicatesCount} tabs)`;

  document.getElementById("close-all-duplicates-btn").innerText =
    `Close all duplicate tabs (${allDuplicateTabsCount} tabs)`;
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
