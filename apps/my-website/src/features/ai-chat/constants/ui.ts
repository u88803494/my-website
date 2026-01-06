// UI Magic Numbers for AI Chat feature

/** Threshold (in pixels) for determining if user is at the bottom of the chat container */
export const SCROLL_BOTTOM_THRESHOLD = 100;

/** Maximum height (in pixels) for the auto-resizing textarea */
export const TEXTAREA_MAX_HEIGHT = 200;

/**
 * IME (Input Method Editor) keyCode value
 * When using input methods like Zhuyin/注音, the browser fires keyCode 229
 * to indicate composition is in progress. We need to ignore Enter key during this state.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 */
export const IME_KEYCODE = 229;
