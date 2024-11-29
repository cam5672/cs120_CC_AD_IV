function loadUserDetails() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    const usernameElement = document.getElementById('username');
    usernameElement.textContent = `${firstName} ${lastName}`;
}

function loadMarketOverview() {
    // Placeholder for market overview logic
    console.log('Loading market overview...');
}
