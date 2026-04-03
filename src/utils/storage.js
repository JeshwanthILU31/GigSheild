const INVALID_STORAGE_VALUES = new Set(['undefined', 'null', '']);

const getStorage = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.localStorage;
};

export const safeGetItem = (key) => {
    const storage = getStorage();
    if (!storage) {
        return null;
    }

    const value = storage.getItem(key);
    if (value == null || INVALID_STORAGE_VALUES.has(value)) {
        if (value != null) {
            storage.removeItem(key);
        }
        return null;
    }

    return value;
};

export const safeParse = (key) => {
    const rawValue = safeGetItem(key);
    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        const storage = getStorage();
        storage?.removeItem(key);
        return null;
    }
};

export const safeSetItem = (key, value) => {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    if (value === undefined || value === null || value === '') {
        storage.removeItem(key);
        return;
    }

    storage.setItem(key, String(value));
};

export const safeSetJSON = (key, value) => {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    if (value === undefined || value === null) {
        storage.removeItem(key);
        return;
    }

    try {
        storage.setItem(key, JSON.stringify(value));
    } catch {
        storage.removeItem(key);
    }
};

export const safeRemoveItems = (...keys) => {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    keys.forEach((key) => storage.removeItem(key));
};
