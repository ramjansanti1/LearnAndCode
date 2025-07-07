import axios from "axios";

class News {
    private newsData: any;
    private notificationData: any;
    private category: string = 'general';
    private notificationVisibility: boolean = false;
    private newsVisibility: boolean = true;
    private totalPages = 1;
    private currentPage = 1;

    async init() {
        try {
            this.toggleNotificationVisibility();
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/news?page=${this.currentPage}`, {
                withCredentials: true
            });
            this.newsData = response.data.data.news;
            this.totalPages = response.data.data.totalPages;
            this.initiateNewsCards();
            this.renderPagination();
        } catch (err) {
            console.error("Failed to fetch news:", err);
        }
    }

    toggleNotificationVisibility() {
        const div = document.getElementById("notificationContainer");
        if (div) div.style.display = this.notificationVisibility ? "block" : "none";
    }

    toggleNewsVisibility() {
        const div = document.getElementById("newsContainer");
        if (div) {
            div.classList.toggle("hidden", !this.newsVisibility);
        }
    }

    setContent(newsVisibility: boolean, notificationVisibility: boolean) {
        this.newsVisibility = newsVisibility;
        this.notificationVisibility = notificationVisibility;
        this.toggleNewsVisibility();
        this.toggleNotificationVisibility();
    }

    async initiateNewsCards() {
        const newsContainer = document.getElementById("newsContainer");
        if (!newsContainer) return;
        newsContainer.innerHTML = "";
        if (this.newsData.length) {
            this.newsData.forEach((item: any) => {
                const card = document.createElement("div");
                card.className = "news-card";
                card.innerHTML = this.getNewsCardHtml(item);
                newsContainer?.appendChild(card);
            });
        }
        else {
            const message = document.createElement("h1");
            message.innerHTML = `<h1>No news available</h1>`;
            newsContainer.appendChild(message);
        }
    }

    private getNewsCardHtml(item: { [key: string]: any }) {
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
                <span>${item.likes.length}</span>
                <button onclick="dislikeArticle('${item._id}')" class="btn dislike-btn" title="Dislike">
                    <i class="fa-regular fa-thumbs-down"></i>
                </button>
                <span>${item.dislikes.length}</span>
                <button onclick="saveArticle('${item._id}')" class="btn save-btn" title="Save"><i class="fa-regular fa-bookmark"></i></button>
                <button onclick="reportArticle('${item._id}')" class="btn report-btn" title="Report"><i class="fa-regular fa-flag"></i></button>
                </div>
            </div>`
    }

    async getNewsBasedOnCategory(category: string) {
        try {
            this.setContent(true, false);
            this.category = category;
            if (category === 'general') {
                this.init();
            }
            else {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/news?category=${category}&page=${this.currentPage}`, {
                    withCredentials: true
                });
                this.newsData = response.data.data.news;
                this.totalPages = response.data.data.totalPages;
                this.initiateNewsCards();
                this.renderPagination();
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
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/news/like?articleId=${artcleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }

    async dislikeArticle(articleId: string) {
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/news/dislike?articleId=${articleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }

    async saveArticle(articleId: string) {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/news/save?articleId=${articleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }

    async reportArticle(articleId: string) {
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/news/report?articleId=${articleId}`, {}, {
            withCredentials: true
        });
        this.getNewsBasedOnCategory(this.category);
    }

    async getSavedNews() {
        this.setContent(true, false);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/news/save`, {
            withCredentials: true
        });
        this.newsData = response.data.data;
        this.initiateNewsCards();
    }

    async getNotifications() {
        this.setContent(false, true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/notification`, {
            withCredentials: true
        });
        this.notificationData = response.data.data;
        this.initiateNotificationCards();
    }

    private initiateNotificationCards() {
        const notificationContainer = document.getElementById("notificationContainer");
        if (!notificationContainer) return;
        notificationContainer.innerHTML = "";
        if (this.notificationData.length) {
            this.notificationData.forEach((item: any) => {
                const card = document.createElement("div");
                card.className = "notification-card";
                card.innerHTML = this.getNotificationCardHtml(item);
                notificationContainer?.appendChild(card);
            });
        }
        else {
            const message = document.createElement("h1");
            message.innerHTML = `<h1>No Notification</h1>`;
            notificationContainer.appendChild(message);
        }
    }

    private getNotificationCardHtml(item: { [key: string]: any }) {
        const content = item.content || "";
        const shortContent = content.length > 150
            ? content.slice(0, 150) + "..."
            : content;
        return `<div class="notification-header">
                    <span class="timestamp">2025-07-04 11:39</span>
                </div>
                <div class="notification-body">
                    <p><strong>Title:</strong>${item.title}</p>
                    <a href=${item.url}
                        target="_blank">
                        View Article ↗
                    </a>
                </div>`
    }

    private renderPagination() {
        const container = document.getElementById("paginationContainer");
        if (!container || this.totalPages <= 1) {
            if (container) container.innerHTML = "";
            return;
        }
        container.innerHTML = "";
        for (let i = 1; i <= this.totalPages; i++) {
            const button = document.createElement("button");
            button.className = "pagination-button" + (i === this.currentPage ? " active" : "");
            button.innerText = `${i}`;
            button.onclick = async () => {
                this.currentPage = i;
                await this.getNewsBasedOnCategory(this.category);
            };
            container.appendChild(button);
        }
    }

    async getNewsByQuery() {
        const query = (document.getElementById("searchInput") as HTMLInputElement).value.trim();
        if (!query) return;
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/news?searchQuery=${encodeURIComponent(query)}&page=${this.currentPage}`, {
                withCredentials: true,
            });
            this.setContent(true, false);
            this.newsData = data.data.news;
            this.initiateNewsCards();
        } catch (err) {
            console.error("Search failed:", err);
        }
    }

    logoutUser() {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/views/index.html";
    }
}

const newsInstance = new News();
newsInstance.init();

(window as any).getNewsBasedOnCategory = (category: string) => { newsInstance.getNewsBasedOnCategory(category); };
(window as any).toggleCategoryMenu = () => { newsInstance.toggleCategoryMenu(); }
(window as any).likeArticle = (artcleId: string) => { newsInstance.likeArticle(artcleId); };
(window as any).dislikeArticle = (artcleId: string) => { newsInstance.dislikeArticle(artcleId); };
(window as any).saveArticle = (artcleId: string) => { newsInstance.saveArticle(artcleId); };
(window as any).getSavedNews = () => { newsInstance.getSavedNews(); };
(window as any).getNotifications = () => { newsInstance.getNotifications(); };
(window as any).getNewsByQuery = async () => { newsInstance.getNewsByQuery(); };
(window as any).logoutUser = () => { newsInstance.logoutUser(); };
(window as any).reportArticle = (artcleId: string) => { newsInstance.reportArticle(artcleId); };