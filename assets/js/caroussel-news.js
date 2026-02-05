const rssUrl = "https://rss.app/feeds/MhoabB3WS4ePO0Sc.xml";

// Format date in French
function formatDate(dateString) {
    if (!dateString) return 'Date inconnue';
    
    try {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        return date.toLocaleDateString('fr-FR', options);
    } catch (e) {
        return dateString;
    }
}

// Extract image from description HTML
function extractImageFromDescription(description) {
    if (!description) return null;
    
    const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
    
    const urlMatch = description.match(/(https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|png|gif|webp))/i);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    
    return null;
}

// Display news from JSON format
function displayNewsFromJSON(data) {
    if (!data.items || data.items.length === 0) {
        console.error('No items found in feed');
        return;
    }

    const top = document.getElementById("track-top");
    const bottom = document.getElementById("track-bottom");

    if (!top || !bottom) {
        console.error('Track elements not found');
        return;
    }

    const itemsToShow = data.items.slice(0, 20);
    
    itemsToShow.forEach((item, index) => {
        const title = item.title || "Sans titre";
        const link = item.link || item.url || "#";
        const pubDate = item.pubDate || item.published || "";
        
        // Try multiple ways to get the image
        let image = item.enclosure?.link || 
                   item.enclosure?.url ||
                   item.thumbnail ||
                   item.image ||
                   extractImageFromDescription(item.description || item.content);

        // Fallback image
        if (!image) {
            image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop&auto=format&q=80";
        }

        const formattedDate = formatDate(pubDate);

        const card = `
            <article class="card">
                <img src="${image}" alt="${title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop&auto=format&q=80'">
                <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
                <p class="date">${formattedDate}</p>
            </article>
        `;

        (index % 2 === 0 ? top : bottom).innerHTML += card;
    });

    /* duplication pour effet infini */
    top.innerHTML += top.innerHTML;
    bottom.innerHTML += bottom.innerHTML;
}

// Fetch RSS using GitHub Pages compatible API
async function fetchRSS() {
    const apis = [
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
    ];

    for (let i = 0; i < apis.length; i++) {
        try {
            console.log(`Trying API ${i + 1}:`, apis[i]);
            const response = await fetch(apis[i]);
            
            if (!response.ok) {
                console.log(`API ${i + 1} failed with status:`, response.status);
                continue;
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Handle rss2json format
            if (data.status === 'ok' && data.items) {
                displayNewsFromJSON(data);
                return;
            }

            // Handle allorigins format
            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, "text/xml");
                const items = xmlDoc.querySelectorAll("item");
                
                // Convert XML items to JSON format
                const jsonData = {
                    items: Array.from(items).map(item => ({
                        title: item.querySelector("title")?.textContent,
                        link: item.querySelector("link")?.textContent,
                        pubDate: item.querySelector("pubDate")?.textContent,
                        description: item.querySelector("description")?.textContent,
                    }))
                };
                
                displayNewsFromJSON(jsonData);
                return;
            }

        } catch (error) {
            console.log(`API ${i + 1} error:`, error);
            continue;
        }
    }

    console.error('All APIs failed to fetch RSS feed');
}

// Start fetching when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchRSS);
} else {
    fetchRSS();
}
