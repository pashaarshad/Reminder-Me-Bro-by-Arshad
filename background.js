chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['sites'], (result) => {
      const sites = result.sites || [];
      const currentUrl = new URL(tab.url);
      
      sites.forEach((site, index) => {
        const siteUrl = new URL(site.url);
        if (currentUrl.hostname === siteUrl.hostname) {
          sites[index].visited = true;
          chrome.storage.sync.set({ sites });
        }
      });

      const unvisitedSites = sites.filter(site => !site.visited);
      if (unvisitedSites.length > 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons.png',
          title: 'Reminder Me Bro',
          message: `Don't forget to visit: ${unvisitedSites.map(s => s.title).join(', ')}`
        });
      }
    });
  }
});

// Reset visits at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    chrome.storage.sync.get(['sites'], (result) => {
      const sites = result.sites || [];
      sites.forEach(site => site.visited = false);
      chrome.storage.sync.set({ sites });
    });
  }
}, 60000);
