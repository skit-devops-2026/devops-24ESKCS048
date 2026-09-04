// Update Total, Pending, and Completed counters
function updateStatistics() {
    let total = tasks.length;
    let completed = 0;
    let pending = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === "Completed") {
            completed++;
        } else {
            pending++;
        }
    }

    document.getElementById("total-count").innerText = total;
    document.getElementById("pending-count").innerText = pending;
    document.getElementById("completed-count").innerText = completed;
}

// Render the task list into the DOM
function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const searchVal = document.getElementById("search-box").value.toLowerCase();
    const filterVal = document.getElementById("filter-status").value;

    const filtered = tasks.filter(function(task) {
        const matchesSearch = task.title.toLowerCase().includes(searchVal);
        const matchesStatus = (filterVal === "All") || (task.status === filterVal);
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        taskList.innerHTML = "<p class='text-muted text-center py-3'>No tasks found.</p>";
        return;
    }

    for (let i = 0; i < filtered.length; i++) {
        const task = filtered[i];

        // Choose badge color
        let badgeClass = "badge-medium";
        if (task.priority === "High") {
            badgeClass = "badge-high";
        } else if (task.priority === "Low") {
            badgeClass = "badge-low";
        }

        // Create card div
        const card = document.createElement("div");
        card.className = "card mb-3 task-card" + (task.status === "Completed" ? " completed" : "");

        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h6 class="task-title">${task.title}</h6>
                    <span class="badge ${badgeClass}">${task.priority}</span>
                </div>
                <p class="small text-muted mb-2">${task.description || "No description."}</p>
                <div class="small text-secondary mb-3">
                    <span class="me-3"><strong>Due:</strong> ${task.dueDate || "N/A"}</span>
                    <span class="me-3"><strong>Category:</strong> ${task.category}</span>
                    <span><strong>Status:</strong> ${task.status}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-success me-1 complete-btn" data-id="${task.id}">
                        ${task.status === "Completed" ? "Undo" : "Complete"}
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${task.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;

        taskList.appendChild(card);
    }
}
