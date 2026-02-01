const rssUrl = "https://rss.app/feeds/MhoabB3WS4ePO0Sc.xml";
    const apiUrl = "https://corsproxy.io/?" + encodeURIComponent(rssUrl);

    fetch(apiUrl)
    .then(res => res.text())
    .then(str => new DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const items = [...data.querySelectorAll("item")].slice(0, 20);

        const top = document.getElementById("track-top");
        const bottom = document.getElementById("track-bottom");

        items.forEach((item, index) => {
        const title = item.querySelector("title")?.textContent ?? "Sans titre";
        const link = item.querySelector("link")?.textContent ?? "#";
        const date = item.querySelector("pubDate")?.textContent ?? "";

        let image = null;
        [...item.children].forEach(el => {
            if (el.tagName.includes("media:")) {
            image = el.getAttribute("url");
            }
        });

        if (!image) {
            image = "https://placehold.co/600x300/020617/ffffff?text=Actualité";
        }

        const card = `
            <article class="card">
            <img src="${image}" alt="${title}">
            <h3><a href="${link}" target="_blank">${title}</a></h3>
            <p class="date">${date}</p>
            </article>
        `;

        (index % 2 === 0 ? top : bottom).innerHTML += card;
        });

        /* duplication pour effet infini */
        top.innerHTML += top.innerHTML;
        bottom.innerHTML += bottom.innerHTML;
    })
    .catch(err => console.error(err));