const MARKETSTACK_API_URL = "http://api.marketstack.com/v1";
const MARKETSTACK_API_KEY = "0aa852cdf23d812cc3ba6ca1560b2b3a";

// Function to cache data in localStorage
function cacheData(key, data, ttl = 3600) {
  const cacheEntry = {
    data,
    expiry: Date.now() + ttl * 1000, // TTL in seconds
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
}

// Function to retrieve cached data
function getCachedData(key) {
  const cacheEntry = JSON.parse(localStorage.getItem(key));
  if (cacheEntry && cacheEntry.expiry > Date.now()) {
    return cacheEntry.data;
  }
  localStorage.removeItem(key);
  return null;
}

// Fetch and display major indices with graphs
function loadMarketOverview() {
  const cachedData = getCachedData("indicesData");
  if (cachedData) {
    const groupedData = groupBySymbol(cachedData);
    displayIndices(groupedData);
    return;
  }

  const symbols = "NDX.INDX,DJI.INDX"; // Corrected symbols for indices
  fetch(`${MARKETSTACK_API_URL}/eod?access_key=${MARKETSTACK_API_KEY}&symbols=${symbols}&limit=30`)
    .then(response => {
      if (!response.ok) throw new Error(`Error fetching indices (${response.status})`);
      return response.json();
    })
    .then(data => {
      if (data && data.data) {
        cacheData("indicesData", data.data);
        const groupedData = groupBySymbol(data.data);
        displayIndices(groupedData);
      } else {
        console.warn("Invalid response for indices data");
      }
    })
    .catch(error => {
      console.error("Error fetching indices:", error);
      document.getElementById("indices-data").innerHTML = `<p class="error-message">Failed to load major indices. Please try again later.</p>`;
    });
}

function displayIndices(groupedData) {
  
  plotIndexGraph(groupedData["NDX.INDX"], "NDX-chart", "NASDAQ 100");
  plotIndexGraph(groupedData["DJI.INDX"], "DJI-chart", "Dow Jones");
}

// Group data by symbol
function groupBySymbol(data) {
  return data.reduce((result, item) => {
    if (!result[item.symbol]) {
      result[item.symbol] = [];
    }
    result[item.symbol].push(item);
    return result;
  }, {});
}

// Updated plotIndexGraph with validation
function plotIndexGraph(data, canvasId, title) {
  if (!data || !Array.isArray(data)) {
    console.error(`Invalid data for graph: ${title}`);
    return;
  }

  const canvasElement = document.getElementById(canvasId);
  if (!canvasElement) {
    console.error(`Canvas element with ID '${canvasId}' not found.`);
    return;
  }

  const ctx = canvasElement.getContext("2d");
  const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
  const prices = data.map(entry => entry.close);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${title} Closing Prices`,
          data: prices,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Price (USD)" } },
      },
    },
  });
}

// Fetch and display trending stocks
function loadTrendingStocks() {
  const cachedData = getCachedData("trendingStocks");
  if (cachedData) {
    displayTrendingStocks(cachedData);
    return;
  }

  fetch(`${MARKETSTACK_API_URL}/eod?access_key=${MARKETSTACK_API_KEY}&symbols=AAPL,GOOGL,MSFT&limit=3`)
  .then(response => {
    if (!response.ok) throw new Error(`Error fetching trending stocks (${response.status})`);
    return response.json();
  })
  .then(data => {
    const trendingStocks = data.data
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 3);
    cacheData("trendingStocks", trendingStocks);
    displayTrendingStocks(trendingStocks);
  })
  .catch(error => {
    console.error("Error fetching trending stocks:", error);
    document.getElementById("stocks-data").innerHTML = `<p class="error-message">Failed to load trending stocks. Please try again later.</p>`;
  });

}

function displayTrendingStocks(stocks) {
  const tableBody = document.getElementById("stocks-data");
  tableBody.innerHTML = ""; // Clear previous data

  stocks.forEach(stock => {
    const { symbol, close, open } = stock;
    const changePercentage = open && close ? (((close - open) / open )*100).toFixed(2) : "N/A";

    // Create a row for the table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${symbol}</td>
      <td>$${close.toFixed(2)}</td>
      <td>${changePercentage}%</td>
    `;
    tableBody.appendChild(row);
  });
}

// Fetch and display currency exchange rates
function loadCurrencyExchange() {
  const cachedData = getCachedData("currencyData");
  if (cachedData) {
    displayCurrencyExchange(cachedData);
    return;
  }

  fetch(`${MARKETSTACK_API_URL}/currencies?access_key=${MARKETSTACK_API_KEY}`)
    .then(response => {
      if (!response.ok) throw new Error(`Error fetching currency data (${response.status})`);
      return response.json();
    })
    .then(data => {
      cacheData("currencyData", data.data);
      displayCurrencyExchange(data.data);
    })
    .catch(error => {
      console.error("Error fetching currency data:", error);
      document.getElementById("currencies-data").innerHTML = `<p class="error-message">Failed to load currency exchange rates. Please try again later.</p>`;
    });
}

function displayCurrencyExchange(currencies) {
  const container = document.getElementById("currencies-data");
  container.innerHTML = ""; // Clear container

  // Create a table for displaying currency exchange rates
  const table = document.createElement("table");
  table.className = "currency-table";

  // Add the table header
  table.innerHTML = `
    <thead>
      <tr>
        <th>Currency</th>
        <th>Symbol</th>
        <th>Exchange Rate </th>
      </tr>
    </thead>
    <tbody id="currency-table-body"></tbody>
  `;

  const tableBody = table.querySelector("tbody");

  currencies.forEach(currency => {
    const { code, name, symbol, rate } = currency;

    // Add each currency as a row in the table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name} (${code})</td>
      <td>${symbol || "N/A"}</td>
      <td>${rate ? rate.toFixed(4) : "N/A"}</td>
    `;
    tableBody.appendChild(row);
  });

  container.appendChild(table);
}

// Initialize all data
document.addEventListener("DOMContentLoaded", () => {
  
  loadMarketOverview();
  loadTrendingStocks();
  loadCurrencyExchange();
});
