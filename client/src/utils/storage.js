/**
 * Storage — Safe localStorage wrapper with JSON serialization and error handling.
 *
 * All methods handle:
 * - JSON parse/stringify errors
 * - QuotaExceededError (storage full)
 * - Private browsing restrictions
 */

const STORAGE_PREFIX = 'petverse_';

/**
 * Check if localStorage is available.
 * @returns {boolean}
 */
const isStorageAvailable = () => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};

/**
 * Set a value in localStorage with JSON serialization.
 * @param {string} key - Storage key (prefixes 'petverse_' automatically)
 * @param {*} value - Value to store (objects/arrays are JSON stringified)
 * @returns {boolean} Success status
 */
export const setStorage = (key, value) => {
    if (!isStorageAvailable()) return false;

    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(STORAGE_PREFIX + key, serialized);
        return true;
    } catch (err) {
        if (err.name === 'QuotaExceededError') {
            console.warn('[Storage] Quota exceeded. Could not save:', key);
        } else {
            console.error('[Storage] Error setting item:', key, err);
        }
        return false;
    }
};

/**
 * Get a value from localStorage with JSON parsing.
 * @param {string} key - Storage key (without prefix)
 * @param {*} [defaultValue=null] - Default value if key doesn't exist or parse fails
 * @returns {*} Parsed value or defaultValue
 */
export const getStorage = (key, defaultValue = null) => {
    if (!isStorageAvailable()) return defaultValue;

    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
    } catch (err) {
        console.error('[Storage] Error getting item:', key, err);
        return defaultValue;
    }
};

/**
 * Remove a key from localStorage.
 * @param {string} key - Storage key (without prefix)
 * @returns {boolean} Success status
 */
export const removeStorage = (key) => {
    if (!isStorageAvailable()) return false;

    try {
        localStorage.removeItem(STORAGE_PREFIX + key);
        return true;
    } catch (err) {
        console.error('[Storage] Error removing item:', key, err);
        return false;
    }
};

/**
 * Clear all petverse-prefixed items from localStorage.
 * @returns {boolean} Success status
 */
export const clearAllStorage = () => {
    if (!isStorageAvailable()) return false;

    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(STORAGE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        return true;
    } catch (err) {
        console.error('[Storage] Error clearing storage:', err);
        return false;
    }
};