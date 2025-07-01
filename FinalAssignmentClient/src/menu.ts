import { Choices } from "./constants/menu.constant.js";

export default class Menu {
    showAuthOptions() {
        console.log(Choices.AUTH_CHOICES);
    }

    showAdminOptions() {
        console.log(Choices.ADMIN_CHOICES);
    }

    showUserOptions() {
        console.log(Choices.USER_CHOICES);
    }
}