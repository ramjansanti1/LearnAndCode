import axios from "axios";

class NewsAggregator {
    constructor() {
        document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
            console.log("loginForm");
            e.preventDefault();
            const email = (document.getElementById("email") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;
            try {
                const response = await axios.post("http://localhost:4040/user/login", {
                    email,
                    password
                }, {
                    withCredentials: true
                });
                console.log("Login successful:", response.data);
                window.location.href = "/views/user.homepage.html";
            } catch (err: any) {
                alert("Login failed: " + err?.response?.data?.message || err.message);
            }
        });
    }
}

new NewsAggregator();