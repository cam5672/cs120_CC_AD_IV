// Event Listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Load Market Overview data
  if (document.getElementById("sp500Chart")) {
    fetchMarketData();
  }

  // Load Portfolio data
  if (document.getElementById("portfolioTable")) {
    loadPortfolio();
  }
});

// MARKET OVERVIEW
async function fetchMarketData() {
  try {
    // Mock API response: Replace this with a real API call
    const sp500Data = [3700, 3750, 3800, 3850, 3900]; // Example S&P 500 data
    const nasdaqData = [12000, 12100, 12200, 12300, 12400]; // Example NASDAQ data
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    renderChart("sp500Chart", labels, sp500Data, "S&P 500");
    renderChart("nasdaqChart", labels, nasdaqData, "NASDAQ");

    // Update Top Movers
    document.getElementById("topMovers").textContent = "AAPL, TSLA, AMZN";
  } catch (error) {
    console.error("Error fetching market data:", error);
  }
}

function renderChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Days",
          },
        },
        y: {
          title: {
            display: true,
            text: "Index Value",
          },
        },
      },
    },
  });
}

function updateChartRange(chartId, range) {
  console.log(`Loading ${chartId} data for ${range}`);
  // Placeholder for API call to fetch data based on range
}

// LOGIN AND REGISTER
async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  const response = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  alert(result.message);
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  if (result.success) {
    alert("Login successful!");
    window.location.href = "portfolio.html";
  } else {
    alert(result.message);
  }
}

let portfolio = []; // Portfolio data
let totalValue = 0;

function showAddStockForm() {
  const form = document.getElementById("addStockForm");
  form.style.display = form.style.display === "none" ? "flex" : "none";
}

async function buyStock(stockSymbol = null, purchasePrice = null) {
  // If stock details are not passed, take input from the form
  const symbol = stockSymbol || document.getElementById("stockSymbol").value;
  const shares = parseInt(document.getElementById("shares").value, 10);
  const price = purchasePrice || parseFloat(document.getElementById("purchasePrice").value);
  const purchaseDate = document.getElementById("purchaseDate").value;

  // Validate inputs
  if (!symbol || !shares || !price || !purchaseDate) {
    alert("Please fill in all fields.");
    return;
  }

  // Add stock to the portfolio
  portfolio.push({
    stockSymbol: symbol,
    shares: shares,
    purchasePrice: price,
    purchaseDate: purchaseDate,
  });

  updatePortfolioTable(); // Update the portfolio table
  updatePortfolioSummaryFromTable(); // Update the summary
  alert(`Bought ${shares} shares of ${symbol} at $${price.toFixed(2)} per share.`);

  // Clear the input fields only if the function was invoked via the form
  if (!stockSymbol && !purchasePrice) {
    document.getElementById("stockSymbol").value = "";
    document.getElementById("shares").value = "";
    document.getElementById("purchasePrice").value = "";
    document.getElementById("purchaseDate").value = "";
  }
}


function sellStock(stockSymbol = null) {
  const symbol = stockSymbol || prompt("Enter the stock symbol you want to sell:");
  const stockIndex = portfolio.findIndex((stock) => stock.stockSymbol === symbol);

  if (stockIndex === -1) {
    alert(`You don't own any shares of ${symbol}.`);
    return;
  }

  const stock = portfolio[stockIndex];
  const sharesToSell = prompt(`You own ${stock.shares} shares of ${symbol}. How many would you like to sell?`, "1");
  const sharesNum = parseInt(sharesToSell, 10);

  if (!isNaN(sharesNum) && sharesNum > 0 && sharesNum <= stock.shares) {
    stock.shares -= sharesNum; // Deduct shares

    if (stock.shares === 0) {
      portfolio.splice(stockIndex, 1); // Remove stock if all shares are sold
    }

    updatePortfolioTable(); // Update portfolio table
    updatePortfolioSummaryFromTable(); // Update summary
    alert(`Sold ${sharesNum} shares of ${symbol}.`);
  } else {
    alert("Invalid number of shares.");
  }
}

  // Sort Portfolio by criteria
function sortPortfolio(criteria) {
  switch (criteria) {
    case "date":
      portfolio.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
      break;
    case "symbol":
      portfolio.sort((a, b) => a.stockSymbol.localeCompare(b.stockSymbol));
      break;
    case "shares":
      portfolio.sort((a, b) => b.shares - a.shares);
      break;
    case "purchasePrice":
      portfolio.sort((a, b) => b.purchasePrice - a.purchasePrice);
      break;
    case "currentPrice":
      portfolio.sort(
        (a, b) =>
          (b.purchasePrice * 1.1) - (a.purchasePrice * 1.1) // Mocked current price
      );
      break;
    case "return":
      portfolio.sort(
        (a, b) =>
          b.shares * b.purchasePrice * 0.1 - a.shares * a.purchasePrice * 0.1 // Mocked return
      );
      break;
    default:
      console.warn("Invalid sorting criteria");
  }
  updatePortfolioTable();
}

  alert("Stock added to portfolio!");


function updatePortfolioTable() {
  const tableBody = document.querySelector("#portfolioTable tbody");
  tableBody.innerHTML = "";

  portfolio.forEach((stock, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stock.stockSymbol}</td>
      <td>${stock.shares}</td>
      <td>$${stock.purchasePrice.toFixed(2)}</td>
      <td>$${(stock.purchasePrice * 1.1).toFixed(2)}</td> <!-- Mock current price -->
      <td>$${(stock.shares * stock.purchasePrice * 0.1).toFixed(2)}</td> <!-- Mock return -->
      <td>${stock.purchaseDate}</td>
      <td>
        <button onclick="sellStock(${index})">Sell</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updatePortfolioSummaryFromTable() {
  const table = document.getElementById("portfolioTable");
  let totalPurchaseValue = 0;
  let totalCurrentValue = 0;
  let totalProfit = 0;

  // Loop through table rows (excluding the header)
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const shares = parseFloat(row.cells[1].textContent); // Shares
    const purchasePrice = parseFloat(row.cells[2].textContent.replace("$", "")); // Purchase Price
    const currentPrice = parseFloat(row.cells[3].textContent.replace("$", "")); // Current Price

    // Update calculations
    totalPurchaseValue += shares * purchasePrice;
    totalCurrentValue += shares * currentPrice;
    totalProfit += shares * (currentPrice - purchasePrice);
  }

  // Calculate overall percentage change
  const overallPercentageChange =
    totalPurchaseValue > 0
      ? ((totalCurrentValue - totalPurchaseValue) / totalPurchaseValue) * 100
      : 0;

  // Update summary UI
  document.getElementById("totalValue").textContent = totalCurrentValue.toFixed(2);
  document.getElementById("dailyProfit").textContent = totalProfit.toFixed(2);
  document.getElementById("percentageChange").textContent =
    overallPercentageChange.toFixed(2);
}


function loadPortfolio() {
  // Simulated portfolio data with mocked current prices
  portfolio = [
    {
      stockSymbol: "AAPL",
      shares: 10,
      purchasePrice: 150,
      purchaseDate: "2024-01-01",
      currentPrice: 165, // Mocked current price
    },
    {
      stockSymbol: "GOOGL",
      shares: 5,
      purchasePrice: 2800,
      purchaseDate: "2024-02-01",
      currentPrice: 3080, // Mocked current price
    },
  ];

  // Update the portfolio table and summary
  updatePortfolioTable();
  updatePortfolioSummaryFromTable();

}

// Mock Watchlist Data
const watchlist = [
  { symbol: "MSFT", currentPrice: 330.50, dailyChange: 1.2 },
  { symbol: "TSLA", currentPrice: 750.10, dailyChange: -0.8 },
  { symbol: "AMZN", currentPrice: 3200.25, dailyChange: 0.5 },
];

// Function to Render Watchlist
function loadWatchlist() {
  const watchlistTable = document.getElementById("watchlistTable");
  watchlistTable.innerHTML = ""; // Clear existing rows

  watchlist.forEach((stock, index) => {
    const row = document.createElement("tr");

    // Populate the row with stock data
    row.innerHTML = `
      <td>${stock.symbol}</td>
      <td>$${stock.currentPrice.toFixed(2)}</td>
      <td style="color: ${stock.dailyChange >= 0 ? 'green' : 'red'};">
        ${stock.dailyChange.toFixed(2)}%
      </td>
      <td>
        <button onclick="removeFromWatchlist(${index})">Remove</button>
        <button onclick="buyStockFromWatchlist('${stock.symbol}', ${stock.currentPrice})">Buy</button>
      </td>
    `;

    // Append the row to the table
    watchlistTable.appendChild(row);
  });
}

// Function to Remove Stock from Watchlist
function removeFromWatchlist(index) {
  watchlist.splice(index, 1); // Remove stock from watchlist array
  loadWatchlist(); // Reload the watchlist
}

// Function to Simulate Buying Stock from Watchlist
function buyStockFromWatchlist(symbol, price) {
  alert(`Buying stock: ${symbol} at $${price.toFixed(2)}`);
  // You can integrate this with your buyStock function if needed
}

// Call loadWatchlist on page load
document.addEventListener("DOMContentLoaded", loadWatchlist);



