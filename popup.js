const DEFAULT_REMINDERS = [
  { title: "ChatGPT", url: "https://chat.openai.com", visited: false },
  { title: "Google", url: "https://google.com", visited: false },
  { title: "Arshad's Website", url: "https://arshadpasha.netlify.app", visited: false }
];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['sites'], (result) => {
    if (!result.sites || result.sites.length === 0) {
      chrome.storage.sync.set({ sites: DEFAULT_REMINDERS }, loadSites);
    } else {
      loadSites();
    }
  });
  document.getElementById('addSite').addEventListener('click', addNewSite);
});

function addNewSite() {
  const url = document.getElementById('siteUrl').value;
  const title = document.getElementById('siteTitle').value;
  if (!url || !title) return;

  chrome.storage.sync.get(['sites'], (result) => {
    const sites = result.sites || [];
    sites.push({ url, title, visited: false });
    chrome.storage.sync.set({ sites }, () => {
      loadSites();
      document.getElementById('siteUrl').value = '';
      document.getElementById('siteTitle').value = '';
    });
  });
}

function loadSites() {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = `
    <div id="reminder-list">
      <h4>🔔 Reminder Me Bro</h4>
      <ul id="reminderItems"></ul>
    </div>
  `;

  const ul = document.getElementById('reminderItems');
  chrome.storage.sync.get(['sites'], (result) => {
    const sites = result.sites || [];
    sites.forEach((site, index) => {
      const li = document.createElement('li');
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.justifyContent = "space-between";

      const left = document.createElement('div');
      left.style.display = "flex";
      left.style.alignItems = "center";

      const status = document.createElement('span');
      status.className = 'status-circle';
      status.style.marginRight = "10px";
      status.style.display = "inline-block";
      status.style.width = "20px";
      status.style.height = "20px";
      status.style.borderRadius = "50%";
      status.style.border = site.visited ? "2px solid #4CAF50" : "2px solid #ccc";
      status.style.background = site.visited ? "#4CAF50" : "#fff";
      status.innerText = site.visited ? "✔️" : ""; // Use emoji and innerText

      const a = document.createElement('a');
      a.href = site.url;
      a.textContent = "🔗 " + site.title;
      a.target = "_blank";
      a.style.textDecoration = "none";
      a.style.color = "#333";
      a.style.fontWeight = "500";
      a.style.marginRight = "10px";

      left.appendChild(status);
      left.appendChild(a);

      const del = document.createElement('span');
      del.className = 'delete-btn';
      del.innerText = "✖️"; // Use emoji and innerText
      del.style.color = "red";
      del.style.cursor = "pointer";
      del.style.fontSize = "16px";
      del.onclick = () => deleteSite(index);

      li.appendChild(left);
      li.appendChild(del);
      ul.appendChild(li);
    });
  });
}

function deleteSite(index) {
  chrome.storage.sync.get(['sites'], (result) => {
    const sites = result.sites || [];
    sites.splice(index, 1);
    chrome.storage.sync.set({ sites }, loadSites);
  });
}
