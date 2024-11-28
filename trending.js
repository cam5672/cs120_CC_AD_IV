const apiKey = '39b717f34916c30097beec27832459cd';
const endpoint = `http://api.marketstack.com/v1/eod?access_key=${apiKey}&limit=3&sort=desc`;
// 100 max API requests per month

const specificStocks = ['AAPL', 'TSLA', 'NVDA']; // TEMPORARY


async function fetchTrendingStocks() {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const stocksContainer = document.getElementById('stocks-container');
    
        // Filter for specific stocks
        const filteredStocks = data.data.filter(stock =>
            specificStocks.includes(stock.symbol)
        );
    
        // Display the filtered stocks
        filteredStocks.forEach(stock => {
            const stockItem = document.createElement('li');
            stockItem.innerHTML = `
            <strong>${stock.symbol}</strong>: ${stock.change_percent.toFixed(2)}% change
            `;
            stocksContainer.appendChild(stockItem);
        });
    
        // Handle case where no matching stocks are found
        if (filteredStocks.length === 0) {
            stocksContainer.innerHTML = '<p>No matching stocks found.</p>';
        }
    } catch (error) {
        console.error('Error fetching trending stocks:', error);
    }
}

fetchTrendingStocks();
