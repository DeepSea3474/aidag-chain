async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      alert('Cüzdan bağlandı: ' + accounts[0]);
    } catch (error) {
      alert('Bağlantı reddedildi.');
    }
  } else {
    alert('Web3 cüzdanı bulunamadı. Lütfen MetaMask veya benzeri bir cüzdan yükleyin.');
  }
}

