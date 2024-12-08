document.querySelector('#registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.querySelector('#registerFirstName').value;
    const lastName = document.querySelector('#registerLastName').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;

    try {
        const response = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);

            // Store the user's first and last name in localStorage for display on the homepage
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            // Redirect to the homepage
            window.location.href = '/home';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
});
