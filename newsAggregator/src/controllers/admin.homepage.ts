import axios from "axios";
import AdminHelper from "./admin.helper";

type ApiKeyData = {
    _id: string;
    serverName: string;
    apiKey: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};

type CategoryData = {
    _id: string;
    category: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
};

type AdminUser = {
    _id: string;
    userName: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
};

class Admin {
    private apiKeyData: ApiKeyData[] = [];
    private adminHelper: AdminHelper = new AdminHelper();

    async init() {
        try {
            const data = await this.fetchExternalSources();
            this.apiKeyData = data;
            this.renderExternalSourceTable();
        } catch (err) {
            console.error("Failed to fetch external sources", err);
        }
    }

    private async fetchExternalSources(): Promise<ApiKeyData[]> {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/externalsource`,
            { withCredentials: true }
        );
        return data.data;
    }

    private renderExternalSourceTable() {
        const externalTableSection = document.getElementById("externalServers");
        const categorySection = document.getElementById("categoryContainer");
        const reportedSection = document.getElementById("reportedArticleContainer");
        const adminAccessSection = document.getElementById("adminAccessContainer");
        if (categorySection) categorySection.style.display = "none";
        if (reportedSection) reportedSection.style.display = "none";
        if (adminAccessSection) adminAccessSection.style.display = "none";
        if (!externalTableSection) return;
        externalTableSection.style.display = "block";
        externalTableSection.innerHTML = "";
        const table = this.createExternalSourceTable();
        externalTableSection.appendChild(table);
    }

    private createExternalSourceTable(): HTMLTableElement {
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.appendChild(this.adminHelper.createTableHeader(["Server Name", "API Key", "Status", "Created At", "Updated At", "Action"]));
        const tbody = document.createElement("tbody");
        this.apiKeyData.forEach((item, index) => tbody.appendChild(this.createTableRow(item, index)));
        tbody.appendChild(this.addNewServerRow());
        table.appendChild(tbody);
        return table;
    }

    private createTableRow(item: ApiKeyData, index: number): HTMLTableRowElement {
        const row = document.createElement("tr");
        const apiKeyInput = document.createElement("input");
        apiKeyInput.id = `apiKeyInput${index}`;
        apiKeyInput.type = "text";
        apiKeyInput.value = item.apiKey;
        apiKeyInput.oninput = (e) => this.apiKeyData[index].apiKey = (e.target as HTMLInputElement).value;
        const statusSelect = this.adminHelper.createStatusDropdown(["active", "inactive"], "externalSource", item.status);
        statusSelect.id = `externalSourceStatus${index}`;
        statusSelect.onchange = (e) => this.apiKeyData[index].status = (e.target as HTMLSelectElement).value;
        const updateBtn = this.adminHelper.createButton("Update", async () => {
            await this.updateExternalSource(this.apiKeyData[index], index);
        });
        row.innerHTML = `
            <td>${item.serverName}</td>
            <td></td>
            <td></td>
            <td>${this.adminHelper.formatDate(item.createdAt)}</td>
            <td>${this.adminHelper.formatDate(item.updatedAt)}</td>
            <td></td>
        `;
        const cells = row.querySelectorAll("td");
        cells[1].appendChild(apiKeyInput);
        cells[2].appendChild(statusSelect);
        cells[5].appendChild(updateBtn);
        this.adminHelper.applyTableStyles(row);
        return row;
    }

    private async updateExternalSource(item: ApiKeyData, index: number) {
        try {
            const apiKey = (document.getElementById(`apiKeyInput${index}`) as HTMLInputElement).value.trim();
            const status = (document.getElementById(`externalSourceStatus${index}`) as HTMLInputElement).value.trim();
            await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/externalsource`, {
                serverName: item.serverName,
                apiKey,
                status
            }, { withCredentials: true });
            alert("Update successful");
            this.init();
        } catch (err: any) {
            console.error("Update failed:", err);
            alert("Failed to update server: " + err?.response?.data?.message || err.message);
        }
    }

    private addNewServerRow(): HTMLTableRowElement {
        const row = document.createElement("tr");
        const nameInput = this.adminHelper.createInput("Server Name");
        const apiKeyInput = this.adminHelper.createInput("API Key");
        const statusSelect = this.adminHelper.createStatusDropdown(["active", "inactive"], "ExternalSource");
        const addBtn = this.adminHelper.createButton("Add Server", async () => {
            const name = nameInput.value.trim();
            const key = apiKeyInput.value.trim();
            const status = statusSelect.value;
            if (!name || !key) {
                alert("Server name and API key are required.");
                return;
            }
            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/externalsource`, {
                    serverName: name,
                    apiKey: key
                }, { withCredentials: true });
                alert("New server added!");
                this.init();
            } catch (err: any) {
                console.error("Failed to add server", err);
                alert("Error adding server: " + err?.response?.data?.message || err.message);
            }
        });
        row.innerHTML = `<td></td><td></td><td></td><td>-</td><td>-</td><td></td>`;
        const cells = row.querySelectorAll("td");
        cells[0].appendChild(nameInput);
        cells[1].appendChild(apiKeyInput);
        cells[2].appendChild(statusSelect);
        cells[5].appendChild(addBtn);
        this.adminHelper.applyTableStyles(row);
        return row;
    }

    showExternalSource() {
        const tableSection = document.getElementById("externalServers");
        const categorySection = document.getElementById("categoryContainer");
        if (categorySection) categorySection.style.display = "none";
        if (!tableSection) return;
        tableSection.style.display = "block";
        this.renderExternalSourceTable();
    }

    async showCategorySection() {
        const externalTableSection = document.getElementById("externalServers");
        const categorySection = document.getElementById("categoryContainer");
        const reportedSection = document.getElementById("reportedArticleContainer");
        const adminAccessSection = document.getElementById("adminAccessContainer");
        if (externalTableSection) externalTableSection.style.display = "none";
        if (reportedSection) reportedSection.style.display = "none";
        if (adminAccessSection) adminAccessSection.style.display = "none";
        if (!categorySection) return;
        categorySection.style.display = "block";
        categorySection.innerHTML = "";
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/categories`, {
                withCredentials: true
            });
            const table = this.createCategoryTable(data.data);
            categorySection.appendChild(table);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            categorySection.innerHTML += `<p style="color:red;">Error loading category list.</p>`;
        }
    }

    private createCategoryTable(data: CategoryData[]): HTMLTableElement {
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.appendChild(this.adminHelper.createTableHeader(["Category", "Status", "Created At", "Updated At", "Action"]));
        const tbody = document.createElement("tbody");
        data.forEach((item) => {
            const row = document.createElement("tr");
            const statusSelect = this.adminHelper.createStatusDropdown(["true", "false"], "category", item.status.toString());
            const updateBtn = this.adminHelper.createButton("Update", async () => {
                try {
                    await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/categories`, {
                        category: item.category,
                        status: statusSelect.value === "true"
                    }, { withCredentials: true });
                    alert("Category updated successfully");
                    this.showCategorySection();
                } catch (err: any) {
                    console.error("Failed to update category:", err);
                    alert("Error: " + err?.response?.data?.message || err.message);
                }
            });
            row.innerHTML = `
                <td>${item.category}</td>
                <td></td>
                <td>${new Date(item.createdAt).toLocaleString()}</td>
                <td>${new Date(item.updatedAt).toLocaleString()}</td>
                <td></td>
            `;
            const cells = row.querySelectorAll("td");
            cells[1].appendChild(statusSelect);
            cells[4].appendChild(updateBtn);
            this.adminHelper.applyTableStyles(row);
            tbody.appendChild(row);
        });
        const addRow = document.createElement("tr");
        const nameInput = this.adminHelper.createInput("Category Name");
        const statusSelect = this.adminHelper.createStatusDropdown(["true", "false"], "category");
        const addBtn = this.adminHelper.createButton("Add Category", async () => {
            const categoryName = nameInput.value.trim();
            const status = statusSelect.value === "true";
            if (!categoryName) {
                alert("Category name is required");
                return;
            }
            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/categories`, {
                    category: categoryName,
                    status
                }, { withCredentials: true });
                alert("Category added successfully");
                this.showCategorySection();
            } catch (err: any) {
                console.error("Failed to add category", err);
                alert("Error: " + err?.response?.data?.message || err.message);
            }
        });
        addRow.innerHTML = `<td></td><td></td><td>-</td><td>-</td><td></td>`;
        const addCells = addRow.querySelectorAll("td");
        addCells[0].appendChild(nameInput);
        addCells[1].appendChild(statusSelect);
        addCells[4].appendChild(addBtn);
        this.adminHelper.applyTableStyles(addRow);
        tbody.appendChild(addRow);
        table.appendChild(tbody);
        return table;
    }

    logoutUser() {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/views/index.html";
    }

    async showKeywordSection() {
        const keywordContainer = document.getElementById("blockedKeywordContainer");
        const categoryContainer = document.getElementById("categoryContainer");
        const externalServerContainer = document.getElementById("externalServers");

        if (categoryContainer) categoryContainer.style.display = "none";
        if (externalServerContainer) externalServerContainer.style.display = "none";
        if (!keywordContainer) return;

        keywordContainer.style.display = "block";
        keywordContainer.innerHTML = "";

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/keywords`, {
                withCredentials: true
            });

            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.style.width = "100%";

            const thead = document.createElement("thead");
            thead.innerHTML = `
                <tr style="background-color: #f2f2f2;">
                    <th>Keyword</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>`;
            table.appendChild(thead);

            const tbody = document.createElement("tbody");

            data.data.forEach((item: any) => {
                const row = document.createElement("tr");

                const removeBtn = this.adminHelper.createButton("Remove", async () => {
                    try {
                        await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/keywords`, {
                            data: { keyword: item.keyword },
                            withCredentials: true
                        });
                        alert("Keyword removed");
                        this.showKeywordSection();
                    } catch (err: any) {
                        alert("Failed to remove keyword: " + err?.response?.data?.message || err.message);
                    }
                });

                row.innerHTML = `
                    <td>${item.keyword}</td>
                    <td>${new Date(item.createdAt).toLocaleString()}</td>
                    <td></td>
                `;

                const cells = row.querySelectorAll("td");
                cells[2].appendChild(removeBtn);
                this.adminHelper.applyTableStyles(row);
                tbody.appendChild(row);
            });
            const addRow = document.createElement("tr");
            const input = this.adminHelper.createInput("Enter keyword");
            const addBtn = this.adminHelper.createButton("Add", async () => {
                const keyword = input.value.trim();
                if (!keyword) return alert("Keyword is required");
                try {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/keywords`, {
                        keyword
                    }, { withCredentials: true });
                    alert("Keyword added");
                    this.showKeywordSection();
                } catch (err: any) {
                    alert("Failed to add keyword: " + err?.response?.data?.message || err.message);
                }
            });

            addRow.innerHTML = `<td></td><td>-</td><td></td>`;
            const addCells = addRow.querySelectorAll("td");
            addCells[0].appendChild(input);
            addCells[2].appendChild(addBtn);
            this.adminHelper.applyTableStyles(addRow);
            tbody.appendChild(addRow);

            table.appendChild(tbody);
            keywordContainer.appendChild(table);
        } catch (err) {
            console.error("Failed to fetch keywords:", err);
            keywordContainer.innerHTML += `<p style="color:red;">Error loading keywords.</p>`;
        }
    }

    async showReportedArticles() {
        const externalTableSection = document.getElementById("externalServers");
        const categorySection = document.getElementById("categoryContainer");
        const reportedSection = document.getElementById("reportedArticleContainer");
        const adminAccessSection = document.getElementById("adminAccessContainer");
        if (externalTableSection) externalTableSection.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (adminAccessSection) adminAccessSection.style.display = "none";
        if (!reportedSection) return;
        reportedSection.style.display = "block";
        reportedSection.innerHTML = "";

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/reports`, {
                withCredentials: true
            });

            const reportedArticles = data.data.filter((item: any) => item.reports?.length > 0);
            const table = this.createReportedArticlesTable(reportedArticles);
            reportedSection.appendChild(table);
        } catch (err) {
            console.error("Failed to fetch reported articles:", err);
            reportedSection.innerHTML = `<p style="color:red;">Error loading reported articles.</p>`;
        }
    }

    private createReportedArticlesTable(data: any[]): HTMLTableElement {
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.appendChild(
            this.adminHelper.createTableHeader([
                "Title",
                "Source",
                "Reports",
                "Created At",
                "Link",
                "Block Status",
                "Action"
            ])
        );
        const tbody = document.createElement("tbody");
        data.forEach((item, index) => {
            const row = document.createElement("tr");
            const blockStatusSelect = this.adminHelper.createStatusDropdown(["true", "false"], "reports", item.blocked.toString());
            blockStatusSelect.id = `blockStatusSelect${index}`;
            const updateBtn = this.adminHelper.createButton("Update", async () => {
                const selectedStatus = (document.getElementById(`blockStatusSelect${index}`) as HTMLSelectElement).value === "true";
                try {
                    await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/reports`, {
                        articleId: item._id,
                        status: selectedStatus
                    }, { withCredentials: true });
                    alert("Article status updated successfully");
                    this.showReportedArticles();
                } catch (err: any) {
                    console.error("Failed to update article", err);
                    alert("Error: " + err?.response?.data?.message || err.message);
                }
            });
            const linkAnchor = document.createElement("a");
            linkAnchor.href = item.url;
            linkAnchor.textContent = "View";
            linkAnchor.target = "_blank";
            linkAnchor.rel = "noopener noreferrer";
            row.innerHTML = `
                <td>${item.title}</td>
                <td>${item.source}</td>
                <td>${item.reports?.length}</td>
                <td>${new Date(item.createdAt).toLocaleString()}</td>
                <td></td>
                <td></td>
                <td></td>
            `;
            const cells = row.querySelectorAll("td");
            cells[4].appendChild(linkAnchor);
            cells[5].appendChild(blockStatusSelect);
            cells[6].appendChild(updateBtn);
            this.adminHelper.applyTableStyles(row);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        return table;
    }

    async showAdminAccessSection() {
        const tableSection = document.getElementById("externalServers");
        const categorySection = document.getElementById("categoryContainer");
        const reportedSection = document.getElementById("reportedArticleContainer");
        const adminAccessSection = document.getElementById("adminAccessContainer");
        if (tableSection) tableSection.style.display = "none";
        if (categorySection) categorySection.style.display = "none";
        if (reportedSection) reportedSection.style.display = "none";
        if (!adminAccessSection) return;
        adminAccessSection.style.display = "block";
        adminAccessSection.innerHTML = "";
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin`, {
                withCredentials: true
            });
            const table = this.createAdminAccessTable(data.data);
            adminAccessSection.appendChild(table);
        } catch (err) {
            console.error("Failed to fetch admin users:", err);
            adminAccessSection.innerHTML = `<p style="color:red;">Error loading admin user list.</p>`;
        }
    }

    private createAdminAccessTable(data: AdminUser[]): HTMLTableElement {
        const table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.appendChild(
            this.adminHelper.createTableHeader(["Name", "Email", "Role", "Created At", "Updated At", "Action"])
        );
        const tbody = document.createElement("tbody");
        data.forEach(admin => {
            const row = document.createElement("tr");
            const revokeBtn = this.adminHelper.createButton("Revoke Access", async () => {
                try {
                    await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/revokeadminaccess`, {
                        email: admin.email
                    }, { withCredentials: true });
                    alert("Access revoked");
                    this.showAdminAccessSection();
                } catch (err: any) {
                    console.error("Failed to revoke access", err);
                    alert("Error: " + err?.response?.data?.message || err.message);
                }
            });
            row.innerHTML = `
                <td>${admin.userName}</td>
                <td>${admin.email}</td>
                <td>${admin.isAdmin ? "Admin" : "User"}</td>
                <td>${new Date(admin.createdAt).toLocaleString()}</td>
                <td>${new Date(admin.updatedAt).toLocaleString()}</td>
                <td></td>
            `;
            const cells = row.querySelectorAll("td");
            cells[5].appendChild(revokeBtn);
            this.adminHelper.applyTableStyles(row);
            tbody.appendChild(row);
        });
        const addRow = document.createElement("tr");
        const emailInput = this.adminHelper.createInput("Email");
        const addBtn = this.adminHelper.createButton("Add Admin", async () => {
            const email = emailInput.value.trim();
            if (!email) {
                alert("Email required.");
                return;
            }
            try {
                await axios.patch(`${import.meta.env.VITE_BASE_URL}/admin/grantadminaccess`, {
                    email
                }, { withCredentials: true });
                alert("Admin added");
                this.showAdminAccessSection();
            } catch (err: any) {
                console.error("Failed to add admin", err);
                alert("Error: " + err?.response?.data?.message || err.message);
            }
        });
        addRow.innerHTML = `<td></td><td></td><td></td><td>-</td><td>-</td><td></td>`;
        const addCells = addRow.querySelectorAll("td");
        addCells[1].appendChild(emailInput);
        addCells[5].appendChild(addBtn);
        this.adminHelper.applyTableStyles(addRow);
        tbody.appendChild(addRow);
        table.appendChild(tbody);
        return table;
    }
}

const adminInstance = new Admin();
adminInstance.init();

(window as any).logoutUser = () => adminInstance.logoutUser();
(window as any).showCategorySection = () => adminInstance.showCategorySection();
(window as any).showExternalSource = () => adminInstance.showExternalSource();
(window as any).showKeywordSection = () => adminInstance.showKeywordSection();
(window as any).showReportedArticles = () => adminInstance.showReportedArticles();
(window as any).showAdminAccessSection = () => adminInstance.showAdminAccessSection();