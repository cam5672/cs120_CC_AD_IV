const apiKey = 'zuc9hftGHcs7gtlHaKpInxqQvkdRTEeT2e97mncO';
const endpoint = `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&filter_entities=true&countries=us&limit=20`;
// API limits to 100 requests for the month

async function fetchNews() {
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
