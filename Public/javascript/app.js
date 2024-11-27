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
let recentTransactions = []; // Transactions for the current day

function showAddStockForm() {
  const form = document.getElementById("addStockForm");
  form.style.display = form.style.display === "none" ? "flex" : "none";
}

async function buyStock() {
  const stockSymbol = document.getElementById("stockSymbol").value;
  const shares = parseInt(document.getElementById("shares").value, 10);
  const purchasePrice = parseFloat(document.getElementById("purchasePrice").value);
  const purchaseDate = document.getElementById("purchaseDate").value;

  if (!stockSymbol || !shares || !purchasePrice || !purchaseDate) {
    alert("Please fill in all fields.");
    return;
  }

  const newStock = { stockSymbol, shares, purchasePrice, purchaseDate };
  portfolio.push(newStock);

  updatePortfolioTable();
  alert("Stock added to portfolio!");
}

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

function sellStock(index) {
  const soldStock = portfolio.splice(index, 1)[0]; // Remove the stock from portfolio

  // Add to recent transactions
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  recentTransactions.push({
    ...soldStock,
    date: today,
  });

  // Filter recent transactions to keep only today's transactions
  recentTransactions = recentTransactions.filter(
    (transaction) => transaction.date === today
  );

  updatePortfolioTable();
  updateRecentTransactionsTable();
  alert(`Sold ${soldStock.shares} shares of ${soldStock.stockSymbol}!`);
}

function updateRecentTransactionsTable() {
  const tableBody = document.querySelector("#recentTransactionsTable tbody");
  tableBody.innerHTML = "";

  recentTransactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${transaction.stockSymbol}</td>
      <td>${transaction.shares}</td>
      <td>$${transaction.purchasePrice.toFixed(2)}</td>
      <td>${transaction.date}</td>
    `;
    tableBody.appendChild(row);
  });
}

function loadPortfolio() {
  // Simulate loading portfolio data
  portfolio = [
    { stockSymbol: "AAPL", shares: 10, purchasePrice: 150, purchaseDate: "2024-01-01" },
    { stockSymbol: "GOOGL", shares: 5, purchasePrice: 2800, purchaseDate: "2024-02-01" },
  ];
  updatePortfolioTable();
}

