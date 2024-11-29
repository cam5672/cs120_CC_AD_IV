document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners for login and register forms
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
});

// Handle Login
async function handleLogin(event) {
  event.preventDefault(); // Prevent form submission reload

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem("token", result.token);

      // Redirect to portfolio page
      alert("Login successful!");
      window.location.href = "../html/home.html";
    } else {
      alert(result.error || "Login failed.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault(); // Prevent form submission reload

  const firstName = document.getElementById("registerFirstName").value;
  const lastName = document.getElementById("registerLastName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const response = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful! You can now log in.");
      window.location.href = "../html/login.html";
    } else {
      alert(result.error || "Registration failed.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred. Please try again later.");
  }
}
