function createList(listId){
    const listContainer = document.getElementById("list-container");

    const todoList = document.createElement("div");
    todoList.id = `todoList${listId}`;
    todoList.classList.add("todo-list");

    const listColor = document.createElement("div");
    listColor.classList.add("list-color");

    const listContent = document.createElement("div");
    listContent.classList.add("list-content");

    const listHeader = document.createElement("div");
    listHeader.classList.add("list-header");

    const listTitle = document.createElement("div");
    listTitle.classList.add("list-title");
    listTitle.textContent = "Title";

    const listRename = document.createElement("div");
    listRename.classList.add("list-rename");
    const renameButton = document.createElement("button");
    renameButton.id = "renameListButton";
    renameButton.classList.add("edit-task-button");
    renameButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    listRename.appendChild(renameButton);

    const listRemove = document.createElement("div");
    listRemove.classList.add("list-remove");
    const removeButton = document.createElement("button");
    removeButton.id = "removeListButton";
    removeButton.classList.add("edit-task-button");
    removeButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    listRemove.appendChild(removeButton);

    const listTasks = document.createElement("div");
    listTasks.classList.add("list-tasks");

    listHeader.appendChild(listTitle);
    listHeader.appendChild(listRename);
    listHeader.appendChild(listRemove);

    listContent.appendChild(listHeader);
    listContent.appendChild(listTasks);

    const addTaskContainer = document.createElement("div");
    addTaskContainer.classList.add("add-task-container");

    const addTaskBg = document.createElement("div");
    addTaskBg.classList.add("add-task-bg");

    const addTaskButton = document.createElement("button");
    addTaskButton.id = "addTaskButton";
    addTaskButton.classList.add("task-button");
    addTaskButton.innerHTML = '<i class="fa-solid fa-square-plus"></i>';
    
    addTaskBg.appendChild(addTaskButton);
    addTaskContainer.appendChild(addTaskBg);

    todoList.appendChild(listColor);
    todoList.appendChild(listContent);
    todoList.appendChild(addTaskContainer);

    listContainer.appendChild(todoList);
}

function deleteList(){

}

function addTask(listId, taskContainer) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter task name...";
    input.classList.add("task-input");

    const MAX_CHARS = 18;

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
            completeButton.innerHTML = '<i class="fa-regular fa-square"></i>';
            completeButton.classList.add("single-task-button");
            completeButton.id = 'completeTaskButton';

            completeButton.addEventListener("click", () => {
                task.classList.toggle("completed");

                const icon = completeButton.querySelector("i");
                const text = task.querySelector("span");
                if (task.classList.contains("completed")) {
                    icon.classList.replace("fa-square", "fa-square-check");
                    icon.style.color = "var(--blue-color)";
                    text.style.color = "var(--bg-color-complement)";
                    text.style.textDecoration = "line-through";
                } else {
                    icon.classList.replace("fa-square-check", "fa-square");
                    icon.style.color = "var(--bg-color-complement)";
                    text.style.color = "var(--text-color)";
                    text.style.textDecoration = "none";
                }
            });

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

    function enforceCharacterLimit(e) {
        if (input.value.length >= MAX_CHARS && e.key != "Backspace" && e.key != "Enter") {
            e.preventDefault();
        }
    }

    function onEnterPress(e) {
        if (e.key === "Enter") {
            saveTask();
        }
    }

    function onBlur() {
        saveTask();
    }

    input.addEventListener("keypress", enforceCharacterLimit);
    input.addEventListener("keydown", enforceCharacterLimit);
    input.addEventListener("input", () => {
        if (input.value.length > MAX_CHARS) {
            input.value = input.value.slice(0, MAX_CHARS);
        }
    });

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
    } else if (event.target.closest("button#createListButton")) {
        createList(0);
    }
});