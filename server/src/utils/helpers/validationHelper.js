export class ValidationHelper {
    static isTypeMatchingConfig(value, key, config) {
        return typeof value === config[key];
    }

    static areObjectsEmpty(...objects) {
        for (const key of objects) {
            if (Object.keys(key).length > 0) {
                return false
            }
        }

        return true;
    }

    static areArraysEmpty(...arrays) {
        for (const key in arrays) {
            if (key.length > 0) {
                return false;
            }
        }

        return true;
    }
}