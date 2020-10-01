import { useState, useEffect } from 'react';

/**
 * useState, but stores the state in sessionStorage
 * (wrapped in an object so it can handle any type)
 * 
 * @param {string} storageKey 
 * @param {*} initialValue 
 * @returns [value, setValue]
 */

const useStateWithSessionStorage = (storageKey, initialValue) => {
    const [value, setValue] = useState(() => {
        let item = sessionStorage.getItem(storageKey);
        return item ? JSON.parse(item)[storageKey] : initialValue;
    });

    useEffect(() => {
        sessionStorage.setItem(storageKey, 
            JSON.stringify({ [storageKey]: value }));
        return () => {
            sessionStorage.removeItem(storageKey);
        }
    }, [value, storageKey]);

    return [value, setValue];
}

export default useStateWithSessionStorage;