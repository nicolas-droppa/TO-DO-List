import { CURRENT_LIST_ID_STORAGE_KEY, MAX_LISTS } from './constants.js';

/**
 * Loads the stored list IDs from localStorage.
 * @returns {number[]} Array of IDs (0-9)
 */
export function getStoredIds() {
    return JSON.parse(localStorage.getItem(CURRENT_LIST_ID_STORAGE_KEY)) || [];
}

/**
 * Saves the list IDs to localStorage.
 * @param {number[]} idList Array of IDs to save
 */
export function saveIds(idList) {
    localStorage.setItem(CURRENT_LIST_ID_STORAGE_KEY, JSON.stringify(idList));
}

/**
 * Finds the lowest available ID (from 0 to 9) and assigns it to a new list.
 * @returns {number|null} Assigned ID or null if the limit is reached.
 */
export function assignNewId() {
    let idList = getStoredIds();

    console.log("STORED IDs: ", idList);

    if (idList.length >= MAX_LISTS) {
        return null;
    }

    for (let i = 0; i < MAX_LISTS; i++) {
        if (!idList.includes(i)) {
            idList.push(i);
            saveIds(idList);
            console.log("ID on assign: ", i);
            return i;
        }
    }
}

/**
 * Removes an ID from the list, allowing it to be reused.
 * @param {number} id ID to remove
 */
function removeId(id) {
    let idList = getStoredIds().filter(existingId => existingId !== id);
    saveIds(idList);
}

/**
 * Resets all stored IDs (for debugging/testing purposes).
 */
export function resetIds() {
    saveIds([]);
}