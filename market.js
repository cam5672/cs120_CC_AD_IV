const apiKey = '39b717f34916c30097beec27832459cd';
const baseUrl = 'http://api.marketstack.com/v1/eod?access_key=';

document.getElementById('stock-search-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const ticker = document.getElementById('ticker-input').value.toUpperCase();
    const stockInfoContainer = document.getElementById('stock-info');

    // clear previous results (if any)
    stockInfoContainer.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`${baseUrl}${apiKey}&symbols=${ticker}&limit=1`);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            stockInfoContainer.innerHTML = `<p>No data found for ticker: ${ticker}</p>`;
            return;
        }

        const stock = data.data[0]; // latest EOD data
        stockInfoContainer.innerHTML = `
        <table>
            <tr><th>Ticker</th><td>${stock.symbol}</td></tr>
            <tr><th>Date</th><td>${stock.date}</td></tr>
            <tr><th>Close</th><td>$${stock.close}</td></tr>
            <tr><th>Open</th><td>$${stock.open}</td></tr>
            <tr><th>High</th><td>$${stock.high}</td></tr>
            <tr><th>Low</th><td>$${stock.low}</td></tr>
            <tr><th>Volume</th><td>${stock.volume}</td></tr>
        </table>
        `;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        stockInfoContainer.innerHTML = '<p>There was an error fetching the stock data. Please try again later.</p>';
    }
});
