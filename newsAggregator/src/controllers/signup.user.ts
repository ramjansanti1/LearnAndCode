import axios from "axios";

class Signup {
    constructor() {
        document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const userName = (document.getElementById("username") as HTMLInputElement).value.trim();
            const email = (document.getElementById("email") as HTMLInputElement).value.trim();
            const password = (document.getElementById("password") as HTMLInputElement).value;
            const confirmPassword = (document.getElementById("ConfirmPassword") as HTMLInputElement).value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            try {
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signup`, {
                    userName,
                    email,
                    password
                }, {
                    withCredentials: true
                });
                console.log("Signup successful:", response.data);
                window.location.href = "/index.html";
            } catch (err: any) {
                alert("Signup failed: " + (err?.response?.data?.message || err.message));
            }
        });
    }
}

new Signup();