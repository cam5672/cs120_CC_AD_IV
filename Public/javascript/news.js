const apiKey = 'zuc9hftGHcs7gtlHaKpInxqQvkdRTEeT2e97mncO';
const endpoint = `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&filter_entities=true&countries=us&limit=20`;

async function fetchNews() {

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User token not found");
      window.location.href = "/login"; // Redirect to login if no token
      return;
    }

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const articlesContainer = document.getElementById('articles-container');
        data.data.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');
            articleDiv.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.description}</p>
            `;
            articlesContainer.appendChild(articleDiv);
        });
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

fetchNews();

function logout() {
    // Perform any logout cleanup if needed (e.g., clearing localStorage)
    localStorage.clear();
  
    // Redirect to the login page
    window.location.href = "/login";
  }
