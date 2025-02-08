function createList(){

}

function deleteList(){

}

function addTask(listId, taskContainer){
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter task name...";
    input.classList.add("task-input");

    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && input.value.trim() !== "") {
            const task = document.createElement("div");
            task.classList.add("task-item");
            task.textContent = input.value;
            taskContainer.appendChild(task);
            input.remove();
        }
    });

    if (!taskContainer.querySelector(".task-input")) {
        taskContainer.appendChild(input);
        input.focus();
    }
}

function deleteTask(){

}

document.addEventListener("click", function (event) {
    if (event.target.closest("button#addTaskButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            addTask(todoList.id, todoList.querySelector(".list-tasks"));
    }
});