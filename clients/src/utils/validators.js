export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isStrongPassword = (pwd) => pwd?.length >= 6;
export const required = (v) => v !== undefined && v !== null && v !== '';