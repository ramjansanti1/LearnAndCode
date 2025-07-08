import axios from "axios";

class AdminLogin {
    constructor() {
        document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
            console.log("loginForm");
            event.preventDefault();
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
                if (response.data.data.userFromDatabase.isAdmin) {
                    window.location.href = "/views/admin.homepage.html";
                }
                else {
                    alert("You don't have admin access.");
                    window.location.href = "/index.html";
                    return;
                }
            } catch (err: any) {
                alert("Login failed: " + err?.response?.data?.message || err.message);
            }
        });
    }
}

new AdminLogin();