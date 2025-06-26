import { handleAdminChoice } from "./adminFunctions.js";
import { handleUserChoice } from "./userFunctions.js";

export function giveAuthChoices() {
    console.log("1. Login");
    console.log("2. Sign up");
    console.log("3. Exit");
}

export async function showAdminOptions(accessToken: string) {
    console.log("1. View the list of external servers and status\n2. View the external server's details\n3. Update/Edit the external server's details\n4. Add new News Category\n5. Logout");
    await handleAdminChoice(accessToken);
}

export async function showUserOptions(accessToken: string) {
    console.log("1. Headlines\n2. Saved Articles\n3. Search\n4. Notifications\n5. Change Password\n6. Logout");
    await handleUserChoice(accessToken);
}