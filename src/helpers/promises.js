/**
 * Simple Promise‑based timeout helper.
 * Used by the sorting algorithms to pause between visual steps so changes are visible.
 */
export function awaitTimeout(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, timeout);
    });
}