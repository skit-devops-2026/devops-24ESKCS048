// Task Form Submission
document.getElementById("task-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const dueDateInput = document.getElementById("due-date");
    const priorityInput = document.getElementById("priority");
    const categoryInput = document.getElementById("category");
    const errorMsg = document.getElementById("error-msg");

    // Simple Form Validation
    if (titleInput.value.trim() === "") {
        errorMsg.classList.remove("d-none");
        return;
    }
    errorMsg.classList.add("d-none");

    // Create Task Object
    const newTask = {
        id: Date.now(),
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        category: categoryInput.value,
        status: "Pending"
    };

    // Add to array
    tasks.unshift(newTask);

    // Clear form
    titleInput.value = "";
    descInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "Medium";
    categoryInput.value = "College";

    // Refresh UI
    updateStatistics();
    renderTasks();
});

// Click event for Complete and Delete buttons
document.getElementById("task-list").addEventListener("click", function(e) {
    const completeBtn = e.target.closest(".complete-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (completeBtn) {
        const taskId = Number(completeBtn.getAttribute("data-id"));
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === taskId) {
                tasks[i].status = (tasks[i].status === "Completed") ? "Pending" : "Completed";
                break;
            }
        }
        updateStatistics();
        renderTasks();
    }

    if (deleteBtn) {
        const taskId = Number(deleteBtn.getAttribute("data-id"));
        tasks = tasks.filter(function(task) {
            return task.id !== taskId;
        });
        updateStatistics();
        renderTasks();
    }
});

// Search input
document.getElementById("search-box").addEventListener("input", function() {
    renderTasks();
});

// Filter status dropdown
document.getElementById("filter-status").addEventListener("change", function() {
    renderTasks();
});

// Initial run
updateStatistics();
renderTasks();
