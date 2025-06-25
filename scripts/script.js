import { assignNewId, getStoredIds, resetIds } from './listIdHandler.js';
import { loadFromLocalStorage, resetListStorage, saveToLocalStorage } from './storageSystem.js';
import { MAX_TITLE_CHARS, MAX_TASK_CHARS } from './constants.js';

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
    resetIds();
    //resetListStorage();
    
    todoLists = loadFromLocalStorage();

    const listContainer = document.getElementById("listContainer");

    //console.log(todoLists);

    todoLists.forEach(list => {
        createListFromData(list);
    });
});

document.addEventListener("mousedown", function (event) {
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

        let x = event.clientX - offsetX - containerRect.left;
        let y = event.clientY - offsetY - containerRect.top;

        x = Math.max(0, Math.min(container.clientWidth - dragTarget.offsetWidth, x));
        y = Math.max(0, Math.min(container.clientHeight - dragTarget.offsetHeight, y));

        dragTarget.style.left = `${x}px`;
        dragTarget.style.top = `${y}px`;
    }
});

document.addEventListener("mouseup", function () {
    if (dragTarget) {
        dragTarget.style.cursor = "grab";

        //console.log("left: ", dragTarget.style.left);
        //console.log("top: ", dragTarget.style.top);
        let id = parseInt(dragTarget.id.replace("todoList", ""));
        //console.log(id);

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
    const listContainer = document.getElementById("listContainer");

    const todoList = document.createElement("div");
    todoList.id = `todoList${listData.id}`;
    todoList.classList.add("todo-list");
    todoList.style.left = listData.position.x + "px";
    todoList.style.top = listData.position.y + "px";

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
    //const newId = assignNewId();
    const newId = 0;

    const newListData = createListTemplate;

    todoLists.push(newListData);
    saveToLocalStorage(todoLists);
    createListElement(newListData);
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
    //console.log(taskText);
    const MAX_CHARS = MAX_TASK_CHARS;
    const originalText = taskText.textContent.trim();

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent.trim();
    input.classList.add("task-input");

    function saveTask() {
        const newTask = input.value.trim() || "Untitled";
        if (newTask == "Untitled")
            taskText.textContent = originalText;
        else
            taskText.textContent = newTask;

        input.replaceWith(taskText);
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
function deleteList(){

}

/**
 * Renames the List
 * @param {div} listContainer div representing the whole todo list
 */
function renameList(listContainer) {
    const titleDiv = listContainer.querySelector(".list-title");
    if (!titleDiv) return;

    const MAX_CHARS = MAX_TITLE_CHARS;

    const input = document.createElement("input");
    input.type = "text";
    input.value = titleDiv.textContent.trim();
    input.classList.add("list-title-input");

    function saveTitle() {
        const newTitle = input.value.trim() || "Untitled";
        titleDiv.textContent = newTitle;
        input.replaceWith(titleDiv);
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

    const MAX_CHARS = MAX_TASK_CHARS;

    function saveTask() {
        if (input.value.trim() !== "") {
            const newTask = createTaskElement({ name: input.value, completed: false });
            taskContainer.appendChild(newTask);
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

    return task;
}

document.addEventListener("click", function (event) {
    if (event.target.closest("button#addTaskButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            addTask(todoList.id, todoList.querySelector(".list-tasks"));

    } else if (event.target.closest("button#createListButton")) {
        handleCreateList(createListTemplate);

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
        taskContainer.firstElementChild.style.backgroundColor = event.target.id;
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