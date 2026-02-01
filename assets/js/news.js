const rssUrl = "https://rss.app/feeds/MhoabB3WS4ePO0Sc.xml";
        const apiUrl = "https://corsproxy.io/?" + encodeURIComponent(rssUrl);

        // Format date in French
        function formatDate(dateString) {
            if (!dateString) return 'Date inconnue';
            
            try {
                const date = new Date(dateString);
                const options = { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                return date.toLocaleDateString('fr-FR', options);
            } catch (e) {
                return dateString;
            }
        }

        // Fetch and display news
        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error('Erreur réseau');
                return res.text();
            })
            .then(str => new DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                const items = data.querySelectorAll("item");
                const container = document.getElementById("news");
                const loading = document.getElementById("loading");

                loading.style.display = "none";
                container.style.display = "grid";

                if (items.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state" style="grid-column: 1 / -1;">
                            <div class="empty-state-icon">📭</div>
                            <p class="empty-state-text">Aucune actualité disponible pour le moment.</p>
                        </div>
                    `;
                    return;
                }

                items.forEach((item, index) => {
                    if (index >= 18) return;

                    const title = item.querySelector("title")?.textContent ?? "Sans titre";
                    const link = item.querySelector("link")?.textContent ?? "#";
                    const pubDate = item.querySelector("pubDate")?.textContent ?? "";

                    // Extract image from RSS feed
                    let image = null;
                    [...item.children].forEach(el => {
                        if (el.tagName.includes("media:content") || 
                            el.tagName.includes("media:thumbnail") ||
                            el.tagName.includes("enclosure")) {
                            image = el.getAttribute("url") || el.getAttribute("href");
                        }
                    });

                    // Fallback image
                    if (!image) {
                        image = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&auto=format&q=80`;
                    }

                    const formattedDate = formatDate(pubDate);

                    container.innerHTML += `
                        <article class="card">
                            <div class="card-image-container">
                                <img src="${image}" alt="${title}" class="card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&auto=format&q=80'">
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">
                                    <a href="${link}" target="_blank" rel="noopener noreferrer">
                                        ${title}
                                    </a>
                                </h3>
                                <p class="card-date">${formattedDate}</p>
                            </div>
                        </article>
                    `;
                });
            })
            .catch(err => {
                const loading = document.getElementById("loading");
                loading.innerHTML = `
                    <div class="error">
                        <div class="error-icon">⚠️</div>
                        <p class="error-text">Impossible de charger les actualités. Veuillez réessayer plus tard.</p>
                    </div>
                `;
                console.error('Erreur:', err);
            });