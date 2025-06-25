import { assignNewId, resetIds, saveIds } from "./listIdHandler.js";

const defaultList = [
    {
        id: 0,
        name: "My todo-list",
        color: "#ff3535",
        position: {
            x: 0,
            y: 0
        },
        tasks: [
            { name: "Create todo-list", completed: true },
            { name: "Make pizza", completed: false }
        ]
    }
];

/**
 * Saves data to local storage
 * @param 
 */
export function saveToLocalStorage(data) {
    localStorage.setItem("todoLists", JSON.stringify(data));
}

/**
 * Loads data from local storage
 * @returns 
 */
export function loadFromLocalStorage() {
    const storedLists = localStorage.getItem("todoLists");

    if (!storedLists) {
        return defaultList;
    }

    const parsedLists = JSON.parse(storedLists);

    // check if only default list is in stored lists
    const isDefaultOnly = parsedLists.length === 1 &&
        parsedLists[0].id === defaultList[0].id &&
        parsedLists[0].name === defaultList[0].name &&
        parsedLists[0].color === defaultList[0].color &&
        parsedLists[0].position.x === defaultList[0].position.x &&
        parsedLists[0].position.y === defaultList[0].position.y &&
        JSON.stringify(parsedLists[0].tasks) === JSON.stringify(defaultList[0].tasks);

    if (isDefaultOnly) {
        console.log("Detected only default list, calling your function...");
        saveIds([0]);
    }

    return parsedLists;
}

/**
 * Loads data from local storage
 * @returns 
 */
export function resetListStorage() {
    localStorage.setItem("todoLists", JSON.stringify(defaultList));
}