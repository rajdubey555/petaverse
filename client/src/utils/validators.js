/**
 * Validators — Reusable validation functions for forms and data.
 */

/**
 * Validate an email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
};

/**
 * Validate a phone number (generic international format).
 * Allows: +91XXXXXXXXXX, 9876543210, +1 (555) 123-4567
 * @param {string} phone
 * @returns {boolean}
 */
export const isPhone = (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = phone.replace(/[\s\-().]/g, '');
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    return phoneRegex.test(cleaned);
};

/**
 * Check if a string meets a minimum length requirement.
 * @param {string} value
 * @param {number} min - Minimum length
 * @returns {boolean}
 */
export const minLength = (value, min) => {
    if (!value || typeof value !== 'string') return false;
    return value.trim().length >= min;
};

/**
 * Check if a string does not exceed a maximum length.
 * @param {string} value
 * @param {number} max - Maximum length
 * @returns {boolean}
 */
export const maxLength = (value, max) => {
    if (!value || typeof value !== 'string') return true;
    return value.trim().length <= max;
};

/**
 * Check if a value is a valid number within a range.
 * @param {*} value
 * @param {number} [min] - Minimum allowed value
 * @param {number} [max] - Maximum allowed value
 * @returns {boolean}
 */
export const isNumberInRange = (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};

/**
 * Check if a value is a valid URL.
 * @param {string} value
 * @returns {boolean}
 */
export const isURL = (value) => {
    if (!value || typeof value !== 'string') return false;
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object).
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Validate password strength.
 * Minimum 8 characters, at least 1 letter and 1 number.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, message: 'Password is required.' };
    }
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters.' };
    }
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one letter.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number.' };
    }
    return { valid: true, message: 'Password is strong.' };
};

// Aliases for backward compatibility
export const validateEmail = isEmail;
export const validatePhone = isPhone;