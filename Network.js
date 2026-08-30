document.addEventListener('DOMContentLoaded', () => {
  const hostNameEl = document.getElementById('host-name');
  const portEl = document.getElementById('port-number');
  const protocolEl = document.getElementById('protocol-name');
  const launchTimeEl = document.getElementById('launch-time');

  const storageKey = 'neonReflectionsLastLaunch';
  const currentLaunchTime = new Date().toISOString();
  localStorage.setItem(storageKey, currentLaunchTime);

  const hostname = window.location.hostname || 'localhost';
  const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
  const protocol = window.location.protocol.replace(':', '').toUpperCase() || 'HTTP';
  const launchDate = new Date(localStorage.getItem(storageKey) || currentLaunchTime);

  hostNameEl.textContent = hostname;
  portEl.textContent = port;
  protocolEl.textContent = protocol;
  launchTimeEl.textContent = launchDate.toLocaleString();
});
