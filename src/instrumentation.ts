export async function register() {
  // Fix broken localStorage global created by Node.js --localstorage-file flag.
  // Node.js v25+ creates a localStorage object with non-function methods when
  // --localstorage-file is provided without a valid path, causing
  // "localStorage.getItem is not a function" errors during SSR.
  try {
    if (
      typeof globalThis.localStorage !== 'undefined' &&
      typeof globalThis.localStorage.getItem !== 'function'
    ) {
      (globalThis as Record<string, unknown>).localStorage = undefined;
    }
  } catch {
    // Silently ignore if deletion fails
  }
}
