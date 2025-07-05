import axios from "axios";

class News {
    private newsData: any;
    private category: string = 'general';

    async init() {
        try {
            const response = await axios.get(`http://localhost:4040/news`, {
                withCredentials: true
            });
            this.newsData = response.data.data;
            this.initiateCards();
        } catch (err) {
            console.error("Failed to fetch news:", err);
        }
    }

    async initiateCards() {
        const newsContainer = document.getElementById("newsContainer");
        if (!newsContainer) return;
        newsContainer.innerHTML = "";
        if (this.newsData.length) {
            this.newsData.forEach((item: any) => {
                const card = document.createElement("div");
                card.className = "news-card";
                card.innerHTML = this.getCardHtml(item);
                newsContainer?.appendChild(card);
            });
        }
        else {
            const message = document.createElement("h1");
            message.innerHTML = `<h1>No news available</h1>`;
            newsContainer.appendChild(message);
        }
    }

    private getCardHtml(item: { [key: string]: any }) {
        const content = item.content || "";
        const shortContent = content.length > 150
            ? content.slice(0, 150) + "..."
            : content;
        return `<img src="${item.imageUrl ? item.imageUrl : 'https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=1024x1024&w=is&k=20&c=C9JwCd6nvW_0hmfolDgi5uq2yAqeNWwyqLgZdODGsEQ='}" 
            alt="News Image"
            class="news-img"
            onerror="this.onerror=null;this.src='https://media.istockphoto.com/id/1381637603/photo/mountain-landscape.jpg?s=1024x1024&w=is&k=20&c=C9JwCd6nvW_0hmfolDgi5uq2yAqeNWwyqLgZdODGsEQ='"
            />
            <div class="news-content">
                <h3>${item.title}</h3>
                <p>${shortContent}</p>
                <a href="${item.link}" target="_blank">Read more →</a>
                <div class="card-actions">
                <button onclick="likeArticle('${item._id}')" class="btn like-btn" title="Like">
                    <i class="fa-regular fa-thumbs-up"></i>
                </button>
                <span>${item.likes}</span>
                <button onclick="dislikeArticle('${item._id}')" class="btn dislike-btn" title="Dislike">
                    <i class="fa-regular fa-thumbs-down"></i>
                </button>
                <span>${item.dislikes}</span>
                <button onclick="saveArticle('${item._id}')" class="btn save-btn" title="Save"><i class="fa-regular fa-bookmark"></i></button>
                <button class="btn report-btn" title="Report"><i class="fa-regular fa-flag"></i></button>
                </div>
            </div>`
    }

    async getNewsBasedOnCategory(category: string) {
        try {
            this.category = category;
            if (category === 'general') {
                this.init();
            }
            else {
                const response = await axios.get(`http://localhost:4040/news?category=${category}`, {
                    withCredentials: true
                });
                this.newsData = response.data.data;
                this.initiateCards();
            }
        } catch (err) {
            console.error("Failed to fetch news:", err);
        }
    }

    toggleCategoryMenu() {
        const list = document.getElementById("categoryList");
        if (list) list.style.display = list.style.display === "block" ? "none" : "block";
    }

    async likeArticle(artcleId: string) {
        await axios.patch(`http://localhost:4040/news/like?articleId=${artcleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }

    async dislikeArticle(articleId: string) {
        await axios.patch(`http://localhost:4040/news/dislike?articleId=${articleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }

    async saveArticle(articleId: string) {
        await axios.post(`http://localhost:4040/news/save?articleId=${articleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }
}

const newsInstance = new News();
newsInstance.init();

(window as any).getNewsBasedOnCategory = (category: string) => {
    newsInstance.getNewsBasedOnCategory(category);
};

(window as any).toggleCategoryMenu = () => {
    newsInstance.toggleCategoryMenu();
};

(window as any).likeArticle = (artcleId: string) => {
    newsInstance.likeArticle(artcleId);
};

(window as any).dislikeArticle = (artcleId: string) => {
    newsInstance.dislikeArticle(artcleId);
};

(window as any).saveArticle = (artcleId: string) => {
    newsInstance.saveArticle(artcleId);
};
