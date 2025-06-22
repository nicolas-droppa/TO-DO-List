import { assignNewId, getStoredIds } from './listIdHandler.js';
import { loadFromLocalStorage, saveToLocalStorage } from './storageSystem.js';

let todoLists = loadFromLocalStorage();

const listContainer = document.getElementById("listContainer");

todoLists.forEach(list => {
    createListFromData(list);
});

let isMouseDown = false;
let mouseDownTarget = null;
let mouseDownEvent = null;

document.addEventListener("mousedown", function (event) {
    isMouseDown = true;
    mouseDownTarget = event.target;
    mouseDownEvent = event;
});

document.addEventListener("mouseup", function () {
    setTimeout(() => {
        isMouseDown = false;
        mouseDownTarget = null;
        mouseDownEvent = null;
    }, 100);
});

let todoList = loadFromLocalStorage();

console.log(todoList);

function createListFromData(listData) {
    const id = listData.id;
    createList(id);

    const listElement = document.getElementById(`todoList${id}`);
    const listTasks = listElement.querySelector(".list-tasks");
    const titleElement = listElement.querySelector(".list-title");
    const colorElement = listElement.querySelector(".list-color");

    titleElement.textContent = listData.name;
    colorElement.style.backgroundColor = listData.color;

    listData.tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task-item");
        if (task.completed) taskDiv.classList.add("completed");

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.name;

        // Add rest of task buttons as in addTask()

        taskDiv.appendChild(taskText);
        listTasks.appendChild(taskDiv);
    });
}

/**
 * Creates new list
 * @param {int} listId id of new list
 */
function createList(listId){
    const listContainer = document.getElementById("listContainer");

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

    console.log(listContainer);
    listContainer.appendChild(todoList);
    console.log(todoList);
    console.log(getStoredIds());

    todoLists.push({
        id: listId,
        name: "Untitled",
        color: "#ffffff",
        position: { x: 0, y: 0 },
        tasks: []
    });
    saveToLocalStorage(todoLists);
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

    const MAX_CHARS = 12;

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
    if (mouseDownTarget) {
        console.log(mouseDownTarget.closest(".todo-list"));
    } else {
        console.log("mouseDownTarget is null");
    }
    if (event.target.closest("button#addTaskButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            addTask(todoList.id, todoList.querySelector(".list-tasks"));

    } else if (event.target.closest("button#createListButton")) {
        createList(assignNewId());

    } else if (event.target.closest("button#changeListColorButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            showColorModal(todoList);

    } else if (event.target.closest("button#renameListButton")) {
        const todoList = event.target.closest(".todo-list");

        if (todoList)
            renameList(todoList);
    } else if ( isMouseDown && mouseDownTarget && mouseDownTarget.closest(".todo-list") ) {
        console.log("Mouse is still held down on .todo-list element");
        if (mouseDownEvent) {
            console.log("X:", mouseDownEvent.clientX);
            console.log("Y:", mouseDownEvent.clientY);
        }
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