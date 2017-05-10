import { OpaqueToken } from '@angular/core';

export let WINDOW = new OpaqueToken('window');

/**
 * Gets the window instance.
 */
export function getWindow() {
    return window;
}
