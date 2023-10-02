
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const closeDuplicateTabsButton = document.getElementById("close-duplicates-btn");
closeDuplicateTabsButton.addEventListener("click", async () => {
  try {
    const currentTab = await getCurrentTab();
    if (!currentTab) {
      return;
    }

    let duplicateTabs = await chrome.tabs.query({url: currentTab.url});
    let duplicateTabIds = duplicateTabs
      .filter(tab => tab.id !== currentTab.id)
      .map(tab => tab.id);
    await chrome.tabs.remove(duplicateTabIds);
  } catch (error) {
    console.error(error);
  }
});