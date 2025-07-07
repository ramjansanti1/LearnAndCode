export default class HtmlHelper {
    formatDate(isoString: string): string {
        const date = new Date(isoString);
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    createInput(placeholder: string): HTMLInputElement {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = placeholder;
        input.style.width = "100%";
        return input;
    }

    createStatusDropdown(options: string[], type: string, selected?: string): HTMLSelectElement {
        const select = document.createElement("select");
        options.forEach(optVal => {
            const option = document.createElement("option");
            option.value = optVal;
            if (type === "reports") {
                option.text = optVal === "true" ? "Blocked" : optVal === "false" ? "Unblocked" : optVal;
            } else {
                option.text = optVal === "true" ? "Active" : optVal === "false" ? "Inactive" : optVal;
            }
            if (optVal === selected) option.selected = true;
            select.appendChild(option);
        });
        select.className = "status-dropdown";
        return select;
    }

    createButton(label: string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement("button");
        button.textContent = label;
        button.className = "update-btn";
        button.onclick = onClick;
        button.style.cursor = "pointer";
        return button;
    }

    applyTableStyles(row: HTMLTableRowElement): void {
        row.querySelectorAll("td, th").forEach(cell => {
            (cell as HTMLElement).style.border = "1px solid #ddd";
            (cell as HTMLElement).style.padding = "8px";
            (cell as HTMLElement).style.marginTop = "2em";
        });
    }

    createTableHeader(columns: string[]): HTMLTableSectionElement {
        const thead = document.createElement("thead");
        thead.innerHTML = `<tr style="background-color: #f2f2f2;">${columns.map(col => `<th>${col}</th>`).join('')}</tr>`;
        return thead;
    }
}
