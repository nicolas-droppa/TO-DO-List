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
    return storedLists ? JSON.parse(storedLists) : defaultList;
}
/*
if (!localStorage.getItem("todoLists")) {
    saveToLocalStorage(defaultList);
}*/