const MARKETSTACK_API_URL = "http://api.marketstack.com/v1";
const MARKETSTACK_API_KEY = "0aa852cdf23d812cc3ba6ca1560b2b3a";

// Portfolio and Watchlist Data
let portfolio = [];
let watchlist = [];

// Load Portfolio on Page Load
async function loadPortfolio() {
  const userId = localStorage.getItem("userId"); // retrieve user ID
  
  try {
    const response = await fetch(`http://localhost:3000/portfolio/${userId}`);
    if (response.ok) {
      portfolio = await response.json(); // populate portfolio with saved data
      updatePortfolioTable();
      updatePortfolioSummary();
    } else {
      console.error("Failed to fetch portfolio data");
    }
  } catch (error) {
    console.error("Error loading portfolio:", error);
  }
}

// Show Add Stock Form
function showAddStockForm() {
  const form = document.getElementById("addStockForm");
  form.style.display = form.style.display === "none" ? "flex" : "none";
}

// Show Add to Watchlist Form
function showAddToWatchlistForm() {
  const form = document.getElementById("addWatchlistForm");
  form.style.display = form.style.display === "none" ? "flex" : "none";
}

// Fetch Stock Data from Marketstack API
async function fetchStockData(symbol) {
  const url = `${MARKETSTACK_API_URL}/eod?access_key=${MARKETSTACK_API_KEY}&symbols=${symbol}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const stock = data.data[0];
      return { close: stock.close, change: stock.change };
    }
    return null;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
}

// Autofill Stock Details for Add Stock Form
async function autofillStockDetails() {
  const symbolInput = document.getElementById("stockSymbol");
  const priceInput = document.getElementById("purchasePrice");

  const symbol = symbolInput.value.toUpperCase();
  if (!symbol) return;

  const stockData = await fetchStockData(symbol);
  if (stockData) {
    priceInput.value = stockData.close ? stockData.close.toFixed(2) : "";
    document.getElementById("dailyChangeInfo").textContent =
      `Daily Change: ${stockData.change ? stockData.change.toFixed(2) : "N/A"}%`;
  } else {
    alert("Stock symbol not found.");
  }
}

// Buy Stock and Add to Portfolio
function buyStock() {
  const symbol = document.getElementById("stockSymbol").value.toUpperCase();
  const shares = parseInt(document.getElementById("shares").value, 10);
  const price = parseFloat(document.getElementById("purchasePrice").value);
  const purchaseDate = document.getElementById("purchaseDate").value;
  const userId = localStorage.getItem("userId"); // retrieve user ID

  // validate input
  if (!symbol || !shares || !price || !purchaseDate) {
    alert("Please fill in all fields.");
    return;
  }

  // send stock data to back end
  try {
    const response = await fetch("http://localhost:3000/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, stockSymbol: symbol, shares, purchasePrice: price, purchaseDate }),
    });

    if (response.ok) {
      alert("Stock added to your portfolio!");
      loadPortfolio(); // reload portfolio table after saving to backend
    } else {
      const result = await response.json();
      alert(result.error || "Failed to add stock.");
    }
  } catch (error) {
    console.error("Error adding stock to portfolio:", error);
    alert("An error occurred. Please try again later.");
  }

  
  /* prev local storage code
  portfolio.push({ stockSymbol: symbol, shares, purchasePrice: price, purchaseDate });
  updatePortfolioTable();
  updatePortfolioSummary();
  */
}

// Sell Stock from Portfolio
function sellStock(symbol) {
  const index = portfolio.findIndex(stock => stock.stockSymbol === symbol);
  if (index === -1) {
    alert("Stock not found in portfolio.");
    return;
  }

  portfolio.splice(index, 1);
  updatePortfolioTable();
  updatePortfolioSummary();
}

async function autofillWatchlistDetails() {
    const symbolInput = document.getElementById("watchlistSymbol");
    const dailyChangeSpan = document.getElementById("dailyChangeInfo");
  
    const symbol = symbolInput.value.toUpperCase();
    if (!symbol) return;
  
    const stockData = await fetchStockData(symbol);
    if (stockData) {
      dailyChangeSpan.textContent = `Daily Change: ${stockData.change.toFixed(2)}%`;
    } else {
      alert("Stock symbol not found.");
      dailyChangeSpan.textContent = "Daily Change: N/A";
    }
  }
  

// Add Stock to Watchlist
async function addToWatchlist() {
  const symbol = document.getElementById("watchlistSymbol").value.toUpperCase();
  const stockData = await fetchStockData(symbol);
  if (stockData) {
    watchlist.push({
      stockSymbol: symbol,
      currentPrice: stockData.close || 0,
      dailyChange: stockData.change || 0,
    });
    updateWatchlistTable();

    document.getElementById("watchlistSymbol").value = "";
    document.getElementById("dailyChangeInfo").textContent = "Daily Change: N/A";
    showAddToWatchlistForm(); // Close the form
  
  } else {
    alert("Invalid stock symbol.");
  }
}

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
        portfolio.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "return":
        portfolio.sort((a, b) => 
          (b.currentPrice - b.purchasePrice) * b.shares - 
          (a.currentPrice - a.purchasePrice) * a.shares
        );
        break;
      default:
        console.warn("Invalid sorting criteria");
    }
    updatePortfolioTable(); // Refresh the portfolio table after sorting
  }
  

// Update Portfolio Table
async function updatePortfolioTable() {
  const tableBody = document.querySelector("#portfolioTable tbody");
  tableBody.innerHTML = "";

  for (const stock of portfolio) {
    const stockData = await fetchStockData(stock.stockSymbol);
    const currentPrice = stockData ? stockData.close : stock.purchasePrice;
    const returnValue = (currentPrice - stock.purchasePrice) * stock.shares;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stock.stockSymbol}</td>
      <td>${stock.shares}</td>
      <td>$${stock.purchasePrice.toFixed(2)}</td>
      <td>$${currentPrice.toFixed(2)}</td>
      <td>$${returnValue.toFixed(2)}</td>
      <td>${stock.purchaseDate}</td>
      <td>
        <button onclick="sellStock('${stock.stockSymbol}')">Sell</button>
      </td>
    `;
    tableBody.appendChild(row);
  }
}

// Update Portfolio Summary
function updatePortfolioSummary() {
  let totalValue = 0;
  let totalProfit = 0;

  portfolio.forEach(stock => {
    const currentPrice = stock.purchasePrice * 1.1; // Mocked current price
    const profit = (currentPrice - stock.purchasePrice) * stock.shares;

    totalValue += currentPrice * stock.shares;
    totalProfit += profit;
  });

  const percentageChange = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0;

  document.getElementById("totalValue").textContent = totalValue.toFixed(2);
  document.getElementById("dailyProfit").textContent = totalProfit.toFixed(2);
  document.getElementById("percentageChange").textContent = percentageChange.toFixed(2);
}

// Update Watchlist Table
function updateWatchlistTable() {
  const tableBody = document.getElementById("watchlistTable");
  tableBody.innerHTML = "";

  watchlist.forEach((stock, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stock.stockSymbol}</td>
      <td>$${stock.currentPrice.toFixed(2)}</td>
      <td style="color: ${stock.dailyChange >= 0 ? 'green' : 'red'};">
        ${stock.dailyChange.toFixed(2)}%
      </td>
      <td>
        <button onclick="removeFromWatchlist(${index})">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Remove Stock from Watchlist
function removeFromWatchlist(index) {
  watchlist.splice(index, 1);
  updateWatchlistTable();
}

function logout() {
  // Perform any logout cleanup if needed (e.g., clearing localStorage)
  localStorage.clear();

  // Redirect to the login page
  window.location.href = "/login";
}



