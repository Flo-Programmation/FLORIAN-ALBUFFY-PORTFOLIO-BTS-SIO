const rssUrl = "https://rss.app/feeds/MhoabB3WS4ePO0Sc.xml";

        // Données de démonstration (fallback si les APIs échouent)
        const demoData = {
            items: [
                {
                    title: "L'IA générative transforme le développement web",
                    link: "https://example.com/ai-dev",
                    pubDate: "2026-02-05T10:00:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop"
                },
                {
                    title: "GitHub Copilot atteint 1 million d'utilisateurs",
                    link: "https://example.com/github",
                    pubDate: "2026-02-04T15:30:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=300&fit=crop"
                },
                {
                    title: "React 19 : Les nouvelles fonctionnalités",
                    link: "https://example.com/react",
                    pubDate: "2026-02-03T09:15:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop"
                },
                {
                    title: "TypeScript 5.5 améliore les performances",
                    link: "https://example.com/typescript",
                    pubDate: "2026-02-02T14:20:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=300&fit=crop"
                },
                {
                    title: "Les tendances du design UI/UX en 2026",
                    link: "https://example.com/design",
                    pubDate: "2026-02-01T11:45:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop"
                },
                {
                    title: "Node.js 22 : Ce qui change pour les développeurs",
                    link: "https://example.com/nodejs",
                    pubDate: "2026-01-31T16:00:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=300&fit=crop"
                },
                {
                    title: "Sécurité web : Les bonnes pratiques 2026",
                    link: "https://example.com/security",
                    pubDate: "2026-01-30T10:30:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=300&fit=crop"
                },
                {
                    title: "CSS Grid vs Flexbox : Guide complet",
                    link: "https://example.com/css",
                    pubDate: "2026-01-29T13:10:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=600&h=300&fit=crop"
                },
                {
                    title: "L'essor des Progressive Web Apps",
                    link: "https://example.com/pwa",
                    pubDate: "2026-01-28T09:00:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop"
                },
                {
                    title: "Vue.js 4 : Annonce et roadmap",
                    link: "https://example.com/vuejs",
                    pubDate: "2026-01-27T15:45:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=300&fit=crop"
                },
                {
                    title: "WebAssembly révolutionne le web",
                    link: "https://example.com/wasm",
                    pubDate: "2026-01-26T11:20:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop"
                },
                {
                    title: "Docker : Optimisation des containers",
                    link: "https://example.com/docker",
                    pubDate: "2026-01-25T14:00:00Z",
                    thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop"
                }
            ]
        };

        function formatDate(dateString) {
            if (!dateString) return 'Date inconnue';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                });
            } catch (e) {
                return dateString;
            }
        }

        function updateStatus(message, type = 'loading') {
            const statusEl = document.getElementById('status');
            statusEl.className = `status-message ${type}`;
            statusEl.innerHTML = type === 'loading' 
                ? `<div class="loading-spinner"></div><p>${message}</p>`
                : `<p>${message}</p>`;
        }

        function displayNews(data, source = '') {
            const top = document.getElementById("track-top");
            const bottom = document.getElementById("track-bottom");
            const carouselEl = document.getElementById('carousel-container');
            const statusEl = document.getElementById('status');

            if (!data.items || data.items.length === 0) {
                updateStatus('❌ Aucune actualité disponible', 'error');
                return;
            }

            top.innerHTML = '';
            bottom.innerHTML = '';

            const items = data.items.slice(0, 20);
            
            items.forEach((item, index) => {
                const title = item.title || "Sans titre";
                const link = item.link || item.url || "#";
                const pubDate = item.pubDate || item.published || "";
                const image = item.thumbnail || item.enclosure?.url || item.image || 
                             "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop";

                const card = `
                    <article class="card">
                        <img src="${image}" alt="${title}" loading="lazy">
                        <div class="card-content">
                            <h3><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
                            <p class="date">${formatDate(pubDate)}</p>
                        </div>
                    </article>
                `;

                if (index % 2 === 0) {
                    top.innerHTML += card;
                } else {
                    bottom.innerHTML += card;
                }
            });

            // Duplication pour effet infini
            top.innerHTML += top.innerHTML;
            bottom.innerHTML += bottom.innerHTML;

            statusEl.style.display = 'none';
            carouselEl.style.display = 'block';
            
            console.log(`✅ ${items.length} articles affichés (source: ${source})`);
        }

        async function fetchRSS() {
            updateStatus('🔄 Tentative de connexion au flux RSS...');

            // Essayer différentes APIs
            const apis = [
                {
                    name: 'RSS2JSON',
                    url: `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
                    parser: (data) => data.status === 'ok' ? data : null
                },
                {
                    name: 'AllOrigins',
                    url: `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
                    parser: (data) => {
                        if (!data.contents) return null;
                        const parser = new DOMParser();
                        const xml = parser.parseFromString(data.contents, "text/xml");
                        const items = Array.from(xml.querySelectorAll("item")).map(item => ({
                            title: item.querySelector("title")?.textContent,
                            link: item.querySelector("link")?.textContent,
                            pubDate: item.querySelector("pubDate")?.textContent,
                            description: item.querySelector("description")?.textContent,
                        }));
                        return items.length > 0 ? { items } : null;
                    }
                }
            ];

            for (const api of apis) {
                try {
                    updateStatus(`🔄 Essai avec ${api.name}...`);
                    console.log(`Tentative: ${api.name}`);
                    
                    const response = await fetch(api.url);
                    if (!response.ok) continue;

                    const data = await response.json();
                    const parsed = api.parser(data);
                    
                    if (parsed && parsed.items) {
                        updateStatus(`✅ Actualités chargées via ${api.name}`, 'success');
                        displayNews(parsed, api.name);
                        return;
                    }
                } catch (error) {
                    console.log(`${api.name} échoué:`, error);
                }
            }

            // Si tout échoue, utiliser les données de démo
            updateStatus('⚠️ Affichage des actualités de démonstration', 'error');
            setTimeout(() => {
                displayNews(demoData, 'Démo');
            }, 1000);
        }

        // Démarrer au chargement
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fetchRSS);
        } else {
            fetchRSS();
        }
