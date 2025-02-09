function createList(){

}

function deleteList(){

}

function addTask(listId, taskContainer) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter task name...";
    input.classList.add("task-input");

    function saveTask() {
        if (input.value.trim() !== "") {
            const task = document.createElement("div");
            task.classList.add("task-item");

            const taskText = document.createElement("span");
            taskText.textContent = input.value;
            taskText.classList.add("task-text");

            const renameButton = document.createElement("button");
            renameButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
            renameButton.classList.add("single-task-button");
            renameButton.id = 'renameTaskButton';
            renameButton.addEventListener("click", () => renameTask(taskText));

            const completeButton = document.createElement("button");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
            completeButton.classList.add("single-task-button");
            completeButton.id = 'completeTaskButton';
            completeButton.addEventListener("click", () => task.classList.toggle("completed"));

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteButton.classList.add("single-task-button");
            deleteButton.id = 'deleteTaskButton';
            deleteButton.addEventListener("click", () => task.remove());

            task.appendChild(completeButton);
            task.appendChild(taskText);
            task.appendChild(renameButton);
            task.appendChild(deleteButton);

            taskContainer.appendChild(task);
        }

        input.removeEventListener("keypress", onEnterPress);
        input.removeEventListener("blur", onBlur);
        input.remove();
    }

    function onEnterPress(e) {
        if (e.key === "Enter") {
            saveTask();
        }
    }

    function onBlur() {
        saveTask();
    }

    input.addEventListener("keypress", onEnterPress);
    input.addEventListener("blur", onBlur);

    if (!taskContainer.querySelector(".task-input")) {
        taskContainer.appendChild(input);
        input.focus();
    }
}

document.addEventListener("click", function (event) {
    if (event.target.closest("button#addTaskButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            addTask(todoList.id, todoList.querySelector(".list-tasks"));
    }
});