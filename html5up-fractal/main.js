// ---- Wallet connect ----
const walletBtn = document.getElementById('wallet-connect-btn');

function setButtonConnected(address) {
  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`;
  walletBtn.textContent = shortAddr;
  walletBtn.setAttribute('aria-label', `Wallet connected: ${shortAddr}`);
  walletBtn.disabled = true;
  walletBtn.style.background = '#333';
}

async function connectWallet() {
  if (!window.ethereum) {
    alert('MetaMask or another Ethereum wallet is not installed.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length) {
      setButtonConnected(accounts[0]);
      sessionStorage.setItem('virtcoinAddress', accounts[0]);
    }
  } catch (err) {
    if (err.code !== 4001) alert('Wallet connection failed.');
  }
}

walletBtn.addEventListener('click', connectWallet);

// Persist connection on refresh
const savedAddr = sessionStorage.getItem('virtcoinAddress');
if (savedAddr) setButtonConnected(savedAddr);

// ---- Crypto prices ----
const priceBox = document.getElementById('crypto-prices');
const API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';

async function fetchPrices() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const btc = data.bitcoin.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const eth = data.ethereum.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    // safer text output
    priceBox.innerHTML = `Bitcoin: <span>${btc}</span> &nbsp;|&nbsp; Ethereum: <span>${eth}</span>`;
  } catch {
    priceBox.textContent = 'Could not load prices.';
  }
}

fetchPrices();
setInterval(fetchPrices, 60_000);
