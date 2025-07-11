import { assignNewId, getStoredIds, resetIds, removeId } from './listIdHandler.js';
import { loadFromLocalStorage, resetListStorage, saveToLocalStorage } from './storageSystem.js';
import { MAX_TITLE_CHARS, MAX_TASK_CHARS, RESET_APP } from './constants.js';

let todoLists = [];

let isDragging = false;
let dragTarget = null;
let offsetX = 0;
let offsetY = 0;

const createListTemplate =
    {
        id: 0,
        name: "Untitled",
        color: "#ff3535",
        position: {
            x: 0,
            y: 0
        },
        tasks: []
    }
;

document.addEventListener("DOMContentLoaded", () => {
    if (RESET_APP == 0) {
        resetIds();
        resetListStorage();
    }
    
    todoLists = loadFromLocalStorage();

    const listContainer = document.getElementById("listContainer");

    todoLists.forEach(list => {
        createListFromData(list);
    });

    const toolbox = document.getElementById("toolbox");
    const icon = document.querySelector("#toggleToolboxButton i");
    if (localStorage.getItem("sidebarExpanded") === "true") {
        toolbox.classList.add("expanded");
        icon.classList.replace("fa-angle-right", "fa-angle-left");
    }

    renderListOverview();
});

document.addEventListener("mousedown", function (event) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA"))
        return;
    
    const list = event.target.closest(".todo-list");
    if (list && !event.target.closest("button")) {
        isDragging = true;
        dragTarget = list;
        offsetX = event.clientX - list.offsetLeft;
        offsetY = event.clientY - list.offsetTop;
        list.style.cursor = "grabbing";
    }
});

document.addEventListener("mousemove", function (event) {
    if (isDragging && dragTarget) {
        const container = document.getElementById("listContainer");
        const containerRect = container.getBoundingClientRect();
        const toolboxWidth = 80;

        let x = event.clientX - offsetX - containerRect.left;
        let y = event.clientY - offsetY - containerRect.top;

        x = Math.max(toolboxWidth, Math.min(container.clientWidth - dragTarget.offsetWidth, x));
        y = Math.max(0, Math.min(container.clientHeight - dragTarget.offsetHeight, y));

        dragTarget.style.left = `${x}px`;
        dragTarget.style.top = `${y}px`;
    }
});

document.addEventListener("mouseup", function () {
    if (dragTarget) {
        dragTarget.style.cursor = "grab";

        let id = parseInt(dragTarget.id.replace("todoList", ""));

        let targetList = todoLists.find(list => list.id === id);

        if (targetList) {
            targetList.position.x = parseInt(dragTarget.style.left);
            targetList.position.y = parseInt(dragTarget.style.top);
            saveToLocalStorage(todoLists);
        } else {
            console.log("List not found!");
        }
    }
    isDragging = false;
    dragTarget = null;
});

/**
 * Creates new list from data --not saving
 * @param {int} listData list
 */
function createListElement(listData) {
    const { width, height } = getWindowSize();
    const safeMargin = 50;

    const posX = Math.min(Math.max(listData.position.x, 80), width - safeMargin);
    const posY = Math.min(Math.max(listData.position.y, 0), height - safeMargin);
    const listContainer = document.getElementById("listContainer");

    const todoList = document.createElement("div");
    todoList.id = `todoList${listData.id}`;
    todoList.classList.add("todo-list");
    todoList.style.left = `${posX}px`;
    todoList.style.top = `${posY}px`;

    const listColor = document.createElement("div");
    listColor.classList.add("list-color");
    listColor.style.backgroundColor = listData.color;

    const listContent = document.createElement("div");
    listContent.classList.add("list-content");

    const listHeader = document.createElement("div");
    listHeader.classList.add("list-header");

    const listTitle = document.createElement("div");
    listTitle.classList.add("list-title");
    listTitle.textContent = listData.name;

    const listRename = document.createElement("div");
    listRename.classList.add("list-rename");
    const renameButton = document.createElement("button");
    renameButton.id = "renameListButton";
    renameButton.classList.add("edit-task-button");
    renameButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    listRename.appendChild(renameButton);

    const listColorChange = document.createElement("div");
    listColorChange.classList.add("list-color-change");
    const colorButton = document.createElement("button");
    colorButton.id = "changeListColorButton";
    colorButton.classList.add("edit-task-button");
    colorButton.innerHTML = '<i class="fa-solid fa-brush"></i>';
    listColorChange.appendChild(colorButton);

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
    listHeader.appendChild(listColorChange);
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

/**
 * Handles creating list after button press
 */
function handleCreateList() {
    const newListData = JSON.parse(JSON.stringify(createListTemplate));

    newListData.id = assignNewId();

    if (!newListData.id) {
        console.log("Maximum number of lists reached!");
        return;
    }

    todoLists.push(newListData);
    saveToLocalStorage(todoLists);
    createListElement(newListData);
    renderListOverview();
}

/**
 * Creates new list --saving included
 * @param {int} listData list
 */
function createListFromData(listData) {
    createListElement(listData);

    const listElement = document.getElementById(`todoList${listData.id}`);
    const listTasks = listElement.querySelector(".list-tasks");

    listData.tasks.forEach(taskData => {
        const taskElement = createTaskElement(taskData);
        listTasks.appendChild(taskElement);
    });
}

/**
 * Renames the Task
 * @param {div} taskText text to be changed
 */
function renameTask(taskText) {
    const MAX_CHARS = MAX_TASK_CHARS;
    const originalText = taskText.textContent.trim();

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent.trim();
    input.classList.add("task-input");

    let id = parseInt(taskText.parentElement.parentElement.parentElement.parentElement.id.replace("todoList", ""));

    function saveTask() {
        const newTaskName = input.value.trim() || originalText;
        taskText.textContent = newTaskName;

        input.replaceWith(taskText);

        const targetList = todoLists.find(list => list.id === id);
        if (targetList) {
            const taskIndex = Array.from(taskText.parentElement.parentElement.children).indexOf(taskText.parentElement);
            if (taskIndex !== -1) {
                targetList.tasks[taskIndex].name = newTaskName;
                saveToLocalStorage(todoLists);
            }
        }
    }

    input.addEventListener("blur", saveTask);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
    });

    input.addEventListener("input", () => {
        if (input.value.length > MAX_CHARS) {
            input.value = input.value.slice(0, MAX_CHARS);
        }
    });

    taskText.replaceWith(input);
    input.focus();
}

/**
 * Deletes list
 */
function deleteList(list) {
    let id = parseInt(list.id.replace("todoList", ""));

    let index = todoLists.findIndex(l => l.id === id);

    if (index !== -1) {
        todoLists.splice(index, 1);
        removeId(id);

        const listElement = document.getElementById(`todoList${id}`);
        if (listElement)
            listElement.remove();

        saveToLocalStorage(todoLists);
    } else {
        console.log("List not found!");
    }

    renderListOverview();
}

/**
 * Renames the List
 * @param {div} listContainer div representing the whole todo list
 */
function renameList(listContainer) {
    const titleDiv = listContainer.querySelector(".list-title");
    if (!titleDiv) 
        return;

    let id = parseInt(titleDiv.parentElement.parentElement.parentElement.id.replace("todoList", ""));

    const MAX_CHARS = MAX_TITLE_CHARS;

    const input = document.createElement("input");
    input.type = "text";
    input.value = titleDiv.textContent.trim();
    input.classList.add("list-title-input");

    function saveTitle() {
        const newTitle = input.value.trim() || "Untitled";
        titleDiv.textContent = newTitle;
        input.replaceWith(titleDiv);

        let targetList = todoLists.find(list => list.id === id);

        if (targetList) {
            targetList.name = newTitle;
            saveToLocalStorage(todoLists);
        } else {
            console.log("List not found!");
        }
    }

    input.addEventListener("blur", saveTitle);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
    });

    input.addEventListener("input", () => {
        if (input.value.length > MAX_CHARS) {
            input.value = input.value.slice(0, MAX_CHARS);
        }
    });

    titleDiv.replaceWith(input);
    input.focus();
}

/**
 * Creates and appends task to list
 * @param {int} listId id of list
 * @param {div} taskContainer div to where new task will be appended
 */
function addTask(listId, taskContainer) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter task name...";
    input.classList.add("task-input");

    let id = parseInt(taskContainer.parentElement.parentElement.id.replace("todoList", ""));

    const MAX_CHARS = MAX_TASK_CHARS;

    function saveTask() {
        if (input.value.trim() !== "") {
            const newTask = createTaskElement({ name: input.value, completed: false });
            taskContainer.appendChild(newTask);
            
            let targetList = todoLists.find(list => list.id === id);
            if (targetList) {
                targetList.tasks.push({
                    name: input.value.trim(),
                    completed: false
                });

                saveToLocalStorage(todoLists);
            }
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

function createTaskElement(taskData) {
    const task = document.createElement("div");
    task.classList.add("task-item");
    if (taskData.completed) task.classList.add("completed");

    const taskText = document.createElement("span");
    taskText.textContent = taskData.name;
    taskText.classList.add("task-text");
    taskText.style.color = task.classList.contains("completed")
        ? "var(--bg-color-complement)"
        : "var(--text-color)";
    taskText.style.textDecoration = task.classList.contains("completed")
        ? "line-through"
        : "none";

    const renameButton = document.createElement("button");
    renameButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    renameButton.classList.add("single-task-button");
    renameButton.id = 'renameTaskButton';
    renameButton.addEventListener("click", () => renameTask(taskText));

    const completeButton = document.createElement("button");
    completeButton.innerHTML = task.classList.contains("completed")
        ? '<i class="fa-regular fa-square-check"></i>'
        : '<i class="fa-regular fa-square"></i>';
    completeButton.querySelector("i").style.color = task.classList.contains("completed") 
        ? "var(--blue-color)"
        : "var(--bg-color-complement)";
    completeButton.classList.add("single-task-button");
    completeButton.id = 'completeTaskButton';

    completeButton.addEventListener("click", () => {
        task.classList.toggle("completed");

        const icon = completeButton.querySelector("i");
        const text = task.querySelector("span");
        const isCompleted = task.classList.contains("completed");

        if (isCompleted) {
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

        const id = parseInt(task.closest(".todo-list").id.replace("todoList", ""));
        const targetList = todoLists.find(list => list.id === id);

        if (targetList) {
            const taskName = text.textContent.trim();
            const targetTask = targetList.tasks.find(t => t.name === taskName);

            if (targetTask) {
                targetTask.completed = isCompleted;
                saveToLocalStorage(todoLists);
            }
        }
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.classList.add("single-task-button");
    deleteButton.id = 'deleteTaskButton';
    deleteButton.addEventListener("click", () => {
        let id = parseInt(task.parentElement.parentElement.parentElement.id.replace("todoList", ""));

        task.remove();

        const targetList = todoLists.find(list => list.id === id);
        if (targetList) {
            targetList.tasks = targetList.tasks.filter(t => t.name !== taskText.textContent);

            saveToLocalStorage(todoLists);
        }
    });

    task.appendChild(completeButton);
    task.appendChild(taskText);
    task.appendChild(renameButton);
    task.appendChild(deleteButton);

    return task;
}

document.addEventListener("click", function (event) {
    if (event.target.closest("button#addTaskButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            addTask(todoList.id, todoList.querySelector(".list-tasks"));

    } else if (event.target.closest("button#createListButton")) {
        handleCreateList();
    
    } else if (event.target.closest("button#removeListButton")) {
        deleteList(event.target.closest(".todo-list"));

    } else if (event.target.closest("button#changeListColorButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            showColorModal(todoList);

    } else if (event.target.closest("button#renameListButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            renameList(todoList);
    }
});

function hideColorModal() {
    const modal = document.getElementById("modalBg");

    if (modal) {
        modal.style.display = "none";
    }
}

function showColorModal(taskContainer) {
    const modal = document.getElementById("modalBg");

    if (!modal) return;
    
    modal.style.display = "flex";

    function handleClick(event) {
        const newColor = event.target.id;

        taskContainer.firstElementChild.style.backgroundColor = newColor;

        const id = parseInt(taskContainer.id.replace("todoList", ""));
        const targetList = todoLists.find(list => list.id === id);

        if (targetList) {
            targetList.color = newColor;
            saveToLocalStorage(todoLists);
        }
    }

    document.querySelectorAll('.change-color-modal-content > div').forEach(div => {
        div.removeEventListener('click', div.handleClickRef);
        div.handleClickRef = handleClick;
        div.addEventListener('click', div.handleClickRef);
    });
}

document.getElementById("modalBg").addEventListener("click", () => {
    hideColorModal();
});

function getWindowSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function renderListOverview() {
    const listSection = document.getElementById("listSection");
    listSection.innerHTML = "";

    todoLists.forEach(list => {
        const item = document.createElement("div");
        item.classList.add("list-overview-item");

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-list";

        const text = document.createElement("span");
        text.classList.add("text");
        text.textContent = `${list.name} (${list.tasks.length})`;

        item.appendChild(icon);
        item.appendChild(text);

        item.addEventListener("click", () => {
            const targetList = document.getElementById(`todoList${list.id}`);
            if (targetList) {
                targetList.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });

        listSection.appendChild(item);
    });
}

document.getElementById("toggleToolboxButton").addEventListener("click", () => {
    const toolbox = document.getElementById("toolbox");
    const icon = document.querySelector("#toggleToolboxButton i");

    toolbox.classList.toggle("expanded");

    if (toolbox.classList.contains("expanded"))
        icon.classList.replace("fa-angle-right", "fa-angle-left");
    else
        icon.classList.replace("fa-angle-left", "fa-angle-right");
});