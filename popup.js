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
      <h4>
        <span style="vertical-align:middle; margin-right:6px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;">
            <path d="M2 7.5A2.5 2.5 0 0 1 4.5 5H8.2a2 2 0 0 1 1.6.8l.9 1.2H20a2 2 0 0 1 2 2v8.5A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-10z" fill="#1a73e8"/>
            <rect x="3" y="9" width="18" height="9" rx="1.5" fill="#fff" stroke="#1a73e8" stroke-width="1.5"/>
          </svg>
        </span>
        Reminder Me Bro
      </h4>
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
      if (site.visited) {
        status.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" style="position:relative;top:1px;left:1px;display:inline-block;vertical-align:middle;">
            <circle cx="12" cy="12" r="10" fill="#fff"/>
            <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
            <path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else {
        status.innerHTML = '';
      }

      const a = document.createElement('a');
      a.href = site.url;
      a.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" style="display:inline-block;vertical-align:middle;margin-right:5px;">
          <path d="M17 7a1 1 0 0 1 0 2h-6a1 1 0 1 1 0-2h6zm-8 4a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2H9zm-2 4a1 1 0 0 1 0-2h12a1 1 0 1 1 0 2H7z" fill="#1a73e8"/>
          <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#1a73e8" stroke-width="1.5"/>
        </svg>
        ${site.title}
      `;
      a.target = "_blank";
      a.style.textDecoration = "none";
      a.style.color = "#333";
      a.style.fontWeight = "500";
      a.style.marginRight = "10px";

      left.appendChild(status);
      left.appendChild(a);

      const del = document.createElement('span');
      del.className = 'delete-btn';
      del.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" style="display:inline-block;vertical-align:middle;">
          <circle cx="12" cy="12" r="10" fill="#fff"/>
          <circle cx="12" cy="12" r="10" fill="#e53935"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      `;
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
