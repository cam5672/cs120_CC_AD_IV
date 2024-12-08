const API_URL = 'http://localhost:3000/notifications'; // Adjust based on your local server setup

// Load Alerts
async function loadAlerts() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("User token not found");
    window.location.href = "/login"; // Redirect to login if no token
    return;
  }

  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      const alerts = await response.json();
      populateAlertsTable(alerts);
    } else {
      const errorText = await response.text();
      console.error('Failed to fetch alerts:', errorText);
    }
  } catch (error) {
    console.error("Error loading alerts:", error);
  }
}

// Populate Alerts Table
function populateAlertsTable(alerts) {
  const tableBody = document.querySelector('#alertsTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  alerts.forEach(alert => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${alert.alert_name}</td>
      <td>${alert.stocks_included || 'All'}</td>
      <td>${alert.percent_or_nominal ? 'Percent' : 'Nominal'}</td>
      <td>${alert.valuation_period} Days</td>
      <td>${alert.notification_method}</td>
      <td>
        <button onclick="deleteAlert(${alert.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Show Add Alert Form
function showAddAlertForm() {
  const form = document.getElementById('addAlertForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Create Alert
async function createAlert() {
  const token = localStorage.getItem('token');
  const alertData = {
    alertName: document.getElementById('alertName').value,
    stocksIncluded: document.getElementById('stocksIncluded').value,
    percentOrNominal: document.getElementById('percentOrNominal').value === 'true',
    valuationPeriod: parseInt(document.getElementById('valuationPeriod').value),
    notificationMethod: document.getElementById('notificationMethod').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alertData)
    });

    if (response.ok) {
      alert('Alert created successfully!');
      loadAlerts(); // Reload the alerts table
    } else {
      const errorText = await response.text();
      console.error('Failed to create alert:', errorText);
    }
  } catch (error) {
    console.error("Error creating alert:", error);
  }
}

// Delete Alert
async function deleteAlert(id) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.ok) {
      alert('Alert deleted successfully!');
      loadAlerts(); // Reload the alerts table
    } else {
      const errorText = await response.text();
      console.error('Failed to delete alert:', errorText);
    }
  } catch (error) {
    console.error("Error deleting alert:", error);
  }
}

// Load Alerts on Page Load
document.addEventListener('DOMContentLoaded', loadAlerts);

function logout() {
    // Perform any logout cleanup if needed (e.g., clearing localStorage)
    localStorage.clear();
  
    // Redirect to the login page
    window.location.href = "/login";
  }
